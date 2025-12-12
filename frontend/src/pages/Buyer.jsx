import React, { useState } from "react";

// BuyerUI.jsx
// Minimal, unstyled React component (JavaScript) providing the UI structure
// for a buyer to view supplier listings and logout. Drop into a Vite + React app.

export default function Buyer({ initialListings = null }) {
  // initialListings can be passed as a prop (from an API) or left null to use demo data
  const demo = [
    {
      id: 1,
      supplier: "Supplier Co.",
      category: "raw_material",
      name: "Steel Bolts - Grade A",
      description: "High-grade steel bolts, corrosion resistant.",
      quantity_available: 1200,
      unit: "pcs",
      location_country: "India",
      pricing_mode: "fixed",
      unit_price: 0.45,
      created_at: "2025-12-01T10:00:00Z",
    },
    {
      id: 2,
      supplier: "Industrial Supplies Ltd.",
      category: "service",
      name: "Machining Service - Batch A",
      description: "Precision machining for custom parts.",
      quantity_available: 10,
      unit: "jobs",
      location_country: "Germany",
      pricing_mode: "rfq_only",
      unit_price: null,
      created_at: "2025-12-03T08:30:00Z",
    },
  ];

  const [route, setRoute] = useState("view"); // 'view' | 'logout'
  const [listings] = useState(initialListings || demo);

  function navigate(to) {
    setRoute(to);
  }

  function logout() {
    // UI-only: switch to logout route; real apps will call auth API
    navigate("logout");
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h2>Browse Listings</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Filter: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="">All</option>
          <option value="raw_material">Raw material</option>
          <option value="service">Service</option>
          <option value="other">Other</option>
        </select>
        <button onClick={load} style={{ marginLeft: 8 }}>Refresh</button>
      </div>

      {msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
        {listings.map(item => (
          <article key={item._id || item.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{item.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {item.pricing_mode === "fixed" ? `${item.unit_price}` : "RFQ"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>{item.unit}</div>
              </div>
            </div>

            <p style={{ margin: "8px 0", color: "#333" }}>{item.description}</p>

            <div style={{ fontSize: 13, color: "#444" }}>
              <div>Available: {item.quantity_available} {item.unit}</div>
              <div>Location: {item.location_country}</div>
            </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  {item.pricing_mode === "fixed" ? (
                    <button>Buy / Request</button>
                  ) : (
                    <button>Request Quote</button>
                  )}

                  <button>View Details</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {route === "logout" && (
        <div>
          <h2>You are logged out</h2>
          <p>Implement real auth logout to end the session.</p>
        </div>
      )}
    </div>
  );
}
