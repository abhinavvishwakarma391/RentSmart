const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
      throw new Error(error.detail || "Server error occurred.");
    }

    return response.json();
  } catch (err) {
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      throw new Error("Could not connect to the RentSmart API (http://localhost:8000). Please make sure the backend server is running.");
    }
    throw err;
  }
}

export function predictRent(payload) {
  return request("/api/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchListings(city) {
  const query = city ? `?city=${encodeURIComponent(city)}` : "";
  return request(`/api/listings${query}`);
}

export function compareListings(ids) {
  return request("/api/compare", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function recommendListings(payload) {
  return request("/api/recommend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMarket(city = "Raipur") {
  return request(`/api/market?city=${encodeURIComponent(city)}`);
}
