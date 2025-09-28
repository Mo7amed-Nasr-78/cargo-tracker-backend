# 🖥️ Cargo Shipment Tracker – Backend

This is the **backend** of the Cargo Shipment Tracker app.  
It is built with **Node.js, Express, MongoDB**, and integrates with:
- **OSRM** for route & ETA calculation.
- **OpenStreetMap (Nominatim API)** for geocoding/search.

---

## 📌 Features
- REST APIs for managing shipments.
- Store shipment data in MongoDB.
- Calculate routes and ETA using OSRM.
- Search location coordinates using Nominatim.
- Update shipment location.

---

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Axios (for OSRM & Nominatim requests)

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cargo-tracker-backend.git
cd cargo-tracker-backend
