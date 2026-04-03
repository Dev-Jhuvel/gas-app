# 📄 Fuel Price Scraper (DOE Philippines)

A Node.js backend service that automatically fetches, parses, and structures weekly fuel price data from the Department of Energy (DOE) Philippines.

---

## 🚀 Features

- Fetches latest fuel price PDFs from DOE website  
- Supports multiple regions:
  - NCR
  - North Luzon
  - South Luzon
  - Visayas
  - Mindanao  
- Parses PDF tables into structured JSON  
- Extracts:
  - Area (City/Province)
  - Fuel types (RON, Diesel, etc.)
  - Station prices (Petron, Shell, etc.)
- Handles messy PDF layouts (row grouping, column detection)  
- Auto-detects latest available data  

---

## 🧱 Tech Stack

- Node.js  
- Axios (HTTP requests)  
- Cheerio (HTML scraping)  
- pdfjs-dist (PDF parsing)  

---

## 📁 Project Structure
