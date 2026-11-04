const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data", "donations.json");

// Read donations
function readDonations() {
  const data = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(data);
}

// Save donations
function saveDonations(donations) {
  fs.writeFileSync(dataFile, JSON.stringify(donations, null, 2));
}

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Surplus2Shelter Backend is running 🚀"
  });
});

// GET all donations
app.get("/api/donations", (req, res) => {
  const donations = readDonations();
  res.json(donations);
});

// POST a new donation
app.post("/api/donations", (req, res) => {
  const {
    foodName,
    quantity,
    donorName,
    location,
    expiryTime
  } = req.body;

  if (!foodName || !quantity || !donorName || !location) {
    return res.status(400).json({
      message: "Food name, quantity, donor name and location are required."
    });
  }

  const donations = readDonations();

  const newDonation = {
    id: Date.now().toString(),
    foodName,
    quantity,
    donorName,
    location,
    expiryTime: expiryTime || null,
    status: "Available",
    createdAt: new Date().toISOString()
  };

  donations.push(newDonation);
  saveDonations(donations);

  res.status(201).json(newDonation);
});

// UPDATE donation status
// UPDATE donation / rescue workflow

app.patch("/api/donations/:id", (req, res) => {
  const donations = readDonations();

  const donation = donations.find(
    (item) => item.id === req.params.id
  );

  if (!donation) {
    return res.status(404).json({
      message: "Donation not found."
    });
  }

  const allowedFields = [
    "status",
    "selectedShelterName",
    "pickupAssigned",
    "deliveryStarted",
    "delivered",
    "handoffVerified",
    "trackingStartAt",
    "driverIndex",
    "driverName",
    "driverAccepted",
    "driverDeclined"
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      donation[field] = req.body[field];
    }
  });

  saveDonations(donations);

  res.json(donation);
});

// DELETE donation
app.delete("/api/donations/:id", (req, res) => {
  const donations = readDonations();

  const updatedDonations = donations.filter(
    (item) => item.id !== req.params.id
  );

  if (updatedDonations.length === donations.length) {
    return res.status(404).json({
      message: "Donation not found."
    });
  }

  saveDonations(updatedDonations);

  res.json({
    message: "Donation deleted successfully."
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});