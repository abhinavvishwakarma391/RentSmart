const API_BASE = "http://127.0.0.1:8000";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const detail = error.detail;
      const message = Array.isArray(detail)
        ? detail
            .map((item) => item.msg || item.detail || JSON.stringify(item))
            .join(" ")
        : (detail || "Server error occurred.");
      throw new Error(message);
    }

    return response.json();
  } catch (err) {
    if (
      err.message === "Failed to fetch" ||
      err.name === "TypeError"
    ) {
      throw new Error(
        `Could not connect to the RentSmart API (${API_BASE}). Please make sure the backend server is running.`
      );
    }

    throw err;
  }
}

// Predict fair rent using the ML model
export function predictRent(payload) {
  return request("/api/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Get rental listings
export function fetchListings(city) {
  const query = city
    ? `?city=${encodeURIComponent(city)}`
    : "";

  return request(`/api/listings${query}`);
}

// Compare properties
export function compareListings(ids) {
  return request("/api/compare", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

// Get smart recommendations
export function recommendListings(payload) {
  return request("/api/recommend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Get market analysis
export function fetchMarket(city = "Raipur") {
  return request(
    `/api/market?city=${encodeURIComponent(city)}`
  );
}