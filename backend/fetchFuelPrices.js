import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { fetchLatestPDF } from "./fetchLatestPDF.js";

// ----------------------
// Helpers
// ----------------------
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.\-]/g, "")
    .trim();
}

function groupByRows(items, tolerance = 2) {
  const rows = [];

  items.forEach((item) => {
    let row = rows.find((r) => Math.abs(r.y - item.y) < tolerance);
    if (!row) {
      row = { y: item.y, items: [] };
      rows.push(row);
    }
    row.items.push(item);
  });

  return rows
    .sort((a, b) => b.y - a.y)
    .map((r) => r.items.sort((a, b) => a.x - b.x));
}

// ----------------------
// Column Detection
// ----------------------
function detectColumns(headerRow) {
  const columns = [];

  headerRow.forEach((item) => {
    const t = normalize(item.text);

    let name = null;

    if (t.includes("petron")) name = "Petron";
    else if (t.includes("shell")) name = "Shell";
    else if (t.includes("caltex")) name = "Caltex";
    else if (t.includes("phoenix")) name = "Phoenix";
    else if (t.includes("total")) name = "Total";
    else if (t.includes("flying")) name = "Flying V";
    else if (t.includes("unioil")) name = "Unioil";
    else if (t.includes("seaoil")) name = "Seaoil";
    else if (t.includes("ptt")) name = "PTT";
    else if (t.includes("independent")) name = "Independent";

    if (name) {
      columns.push({
        name,
        x: item.x,
      });
    }
  });

  return columns.sort((a, b) => a.x - b.x);
}

// ----------------------
// Match Column
// ----------------------
function findNearestColumn(x, columns) {
  let best = null;
  let minDist = Infinity;

  for (const col of columns) {
    const dist = Math.abs(x - col.x);
    if (dist < minDist) {
      minDist = dist;
      best = col;
    }
  }

  if (minDist > 25) return null;
  return best;
}

// ----------------------
// Parse PDF
// ----------------------
async function parsePDF(buffer) {
  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
  }).promise;

  const results = [];
  const areaMap = new Map();

  let currentArea = null;
  let columns = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    const items = content.items.map((i) => ({
      text: i.str,
      x: i.transform[4],
      y: i.transform[5],
    }));

    const rows = groupByRows(items);

    for (const row of rows) {
      const rowText = row.map((i) => i.text).join(" ");
      const normalizedLine = normalize(rowText);

      // ----------------------
      // AREA
      // ----------------------
      // ----------------------
      // AREA (FIXED CLEAN)
      // ----------------------
      const areaMatch = rowText.match(/^([A-Z\s]+?(CITY|MANILA))/i);

      if (areaMatch) {
        currentArea = areaMatch[1].trim();

        if (!areaMap.has(currentArea)) {
          const obj = { area: currentArea, fuels: {} };
          areaMap.set(currentArea, obj);
          results.push(obj);
        }

        continue; // 🚨 IMPORTANT: stop processing this row
      }

      // ----------------------
      // HEADER
      // ----------------------
      if (normalizedLine.includes("petron")) {
        columns = detectColumns(row);
        continue;
      }

      // ----------------------
      // FUEL
      // ----------------------
      const fuelMatch = rowText.match(/(RON\s\d+|DIESEL(?:\sPLUS)?|KEROSENE)/i);

      if (fuelMatch && currentArea && columns.length) {
        const fuel = fuelMatch[1].toUpperCase();
        const areaObj = areaMap.get(currentArea);

        if (!areaObj.fuels[fuel]) {
          areaObj.fuels[fuel] = {};
        }

        const columnBuckets = {};

        row.forEach((item) => {
          const col = findNearestColumn(item.x, columns);
          if (!col) return;

          if (!columnBuckets[col.name]) {
            columnBuckets[col.name] = [];
          }

          columnBuckets[col.name].push(item.text);
        });

        const stations = {};

        columns.forEach((col) => {
          const texts = columnBuckets[col.name];
          if (!texts) return;

          const nums = texts
            .map((t) => parseFloat(t))
            .filter((n) => !isNaN(n))
            .sort((a, b) => a - b)
            .slice(0, 2);

          if (nums.length === 2) {
            stations[col.name] = {
              price: nums[0],
              minPrice: nums[0],
              maxPrice: nums[1],
            };
          }
        });

        areaObj.fuels[fuel] = stations;
      }
    }
  }

  return results;
}

// ----------------------
// MAIN FUNCTION
// ----------------------
export async function fetchFuelPrices() {
  try {
    const pdfUrl = await fetchLatestPDF();

    if (!pdfUrl) {
      console.error("❌ No PDF found");
      return [];
    }

    const res = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const data = await parsePDF(res.data);

    console.log("✅ Parsed:", data.length, "areas");

    return data;
  } catch (err) {
    console.error("❌ Failed:", err.message);
    return [];
  }
}
