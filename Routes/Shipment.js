import express from 'express';
const router = express.Router();
import { getAllShipments, getCertainShipment, getShipmentETA, createShipment, updateShipmentCurrentLocation } from '../Controllers/Shipment.js';

router.route('/shipment/:id/eta').get(getShipmentETA);

router.route('/shipment/:id/update-location').post(updateShipmentCurrentLocation);

router.route('/shipment/:id').get(getCertainShipment);

router.route('/shipments').get(getAllShipments);

router.route('/shipment').post(createShipment);

export default router;