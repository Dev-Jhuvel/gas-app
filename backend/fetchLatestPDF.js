import axios from "axios";

let cachedUrl = null;
let lastFetch = 0;

function formatDate(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}${dd}${yyyy}`;
}

export async function fetchLatestPDF() {
  try {
    const now = Date.now();

    // ✅ Cache (6 hours)
    if (cachedUrl && now - lastFetch < 6 * 60 * 60 * 1000) {
      return cachedUrl;
    }

    // 🔥 Start from today, go backwards
    const today = new Date();

    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dateStr = formatDate(d);

      const url = `https://prod-cms.doe.gov.ph/documents/d/guest/ncr-price-monitoring-${dateStr}-pdf`;

      try {
        // 🔥 HEAD request (fast check)
        await axios.head(url);

        console.log("✅ Found latest PDF:", url);

        cachedUrl = url;
        lastFetch = now;

        return url;
      } catch (err) {
        // ignore 404
      }
    }

    console.log("❌ No PDF found in last 60 days");
    return null;
  } catch (err) {
    console.error("❌ fetchLatestPDF error:", err.message);
    return null;
  }
}