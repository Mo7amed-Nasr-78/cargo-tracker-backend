import Shipment from "../Models/Shipment.js";

export const getAllShipments = async (req, res) => {
	const status = req.query.status;
	let orderBy = req.query.orderBy;

	switch(orderBy) {
		case 'container': 
			orderBy = { containerId: 1 };
			break;
		case 'eta': 
			orderBy = { currentETA: 1 };
			break;
		case 'latest':
			orderBy = { createdAt: 1 };
			break;
		default:
			orderBy = { createdAt: -1 };
			break;
	}

	const shipments = await Shipment.aggregate([
		{
			$match: {
				...(status? { status: status }: {}),
			}
		}, {
			$sort: orderBy,
		}
	])

	if (shipments.length < 1) {
		res.status(404);
		return res.json({
			status: 404,
			msg: "There aren't shipments found",
		});
	}

	res.status(200).json({
		status: 200,
		shipments,
	});
};

export const getCertainShipment = async (req, res) => {
	const shipmentId = req.params.id;

	const shipment = await Shipment.findOne({ shipmentId });

	if (!shipment) {
		res.status(404);
		return res.json({
			status: 404,
			msg: "shipment not found",
		});
	}

	res.status(200).json({
		status: 200,
		shipment
	})
};

export const getShipmentETA = async (req, res) => {
	const shipmentId = req.params.id;

	const shipment = await Shipment.findOne({
		shipmentId,
	})
	.select('currentLocation destination');

	if (!shipment) {
		return res.status(404).json({
			status: 404,
			msg: 'shipment not found',
		})
	}

	const { currentLocation, destination } = shipment;
	const etaValue = await etaCalculator(currentLocation, destination);

	return res.status(200).json({
		status: 200,
		eta: `${etaValue}m`,
		currentLocation,
		destination,
	});
};

export const createShipment = async (req, res) => {
	const { containerId, origin, destination, eta, route } = req.body;

	if (!containerId || !origin || !destination || !eta || !route) {
		res.status(400);
		return res.json({
			status: 400,
			msg: 'Please, fill all details first'
		})
	}

	const shipment = new Shipment({
		shipmentId: `ship-${generateIdentifier(12)}`,
		containerId,
		origin,
		destination,
		currentLocation: {
			location: origin.location,
			coordinates: {
				lat: origin.coordinates.lat,
				lng: origin.coordinates.lng,
			},
			updatedAt: new Date()
		},
		currentETA: eta,
		route: {
			coordinates: route
		},
	});
	await shipment.save();

	res.status(201).json({
		status: 201,
		msg: 'shipment has been created',
		shipment
	})
};

export const updateShipmentCurrentLocation = async (req, res) => {
	const shipmentId = req.params.id;
	const { currentLocation } = req.body;

	const shipment = await Shipment.findOneAndUpdate(
		{ shipmentId },
		{ $set: { currentLocation } },
		{ new: true },
	);

	if (!shipment) {
		res.status(404);
		return res.json({
			status: 404,
			msg: "Shipment not found",
		});
	}

	if (!shipment.currentETA) {
		res.status(400);
		return res.json({
			status: 400,
			msg: "Shipment delivered successfully",
		});
	}

	const etaValue = await etaCalculator(shipment.currentLocation, shipment.destination);
	const updateShipmentEta = await Shipment.findOneAndUpdate(
		{ shipmentId },
		{ $set: { currentETA: etaValue } },
		{ new: true }
	);

	res.status(200).json({
		status: 200,
		msg: "Shipment's current location has been updated",
		shipment: updateShipmentEta,
	});
};

const generateIdentifier = (length = 12) => {
	const nums = "0123456789"

	let newIdentifier = '';
	for (let i = 0; i < length; i++) {
		newIdentifier += nums[Math.floor(Math.random() * nums.length)]
	}

	return newIdentifier;
}

const etaCalculator = async (currentLocation, destination) => {
	const url = await fetch(`http://router.project-osrm.org/route/v1/driving/${currentLocation.coordinates.lng},${currentLocation.coordinates.lat};${destination.coordinates.lng},${destination.coordinates.lat}?overview=false`);
	const data = await url.json();
	
	if (!data.routes || !data.routes.length > 0) {
		return res.status(400).json({
			status: 400,
			msg: 'Failed to get shipment eta'
		})
	}

	const seconds = data.routes[0].duration;
	const minutes = Math.floor(seconds / 60);

	return minutes;
}