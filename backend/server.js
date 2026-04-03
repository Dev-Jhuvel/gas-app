import express from "express";
import cors from "cors";
import { citiesList, fuelTypes } from "./constants.js";
import { fetchFuelPrices } from "./fetchFuelPrices.js";

const app = express();
app.use(cors());

let fuelPrices = [];

(async () => {
  fuelPrices = await fetchFuelPrices();
})();

app.get("/api/lists", (req, res) => {
  res.json({ cities: citiesList, fuelPrices, fuelTypes });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
