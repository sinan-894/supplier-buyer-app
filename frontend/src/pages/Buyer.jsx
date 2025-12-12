import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigateRoute = useNavigate()
  const [route, setRoute] = useState("view"); // 'view' | 'logout'
  const [listings] = useState(initialListings || demo);

  function navigate(to) {
    setRoute(to);
  }

  function onLogoutConfirm(){
    localStorage.removeItem("role");
    navigateRoute("/login");
  }


  function logout() {
    // UI-only: switch to logout route; real apps will call auth API
    navigate("logout");
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      {/* Top navigation */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Buyer Portal</h1>
        <div style={{ marginLeft: 12 }}>
          <button onClick={() => navigate("view")} style={{ marginRight: 8 }}>View Listings</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Routes */}
      {route === "view" && (
        <section>
          <h2 style={{ marginTop: 0 }}>Available Listings ({listings.length})</h2>

          {/* Filters / Search placeholder (UI structure only) */}
          <div style={{ marginBottom: 12 }}>
            <input placeholder="Search by name, supplier, or country" style={{ padding: 6, width: 320 }} />
            <select style={{ marginLeft: 8, padding: 6 }}>
              <option value="">All categories</option>
              <option value="raw_material">raw_material</option>
              <option value="service">service</option>
              <option value="other">other</option>
            </select>
          </div>

          {/* Listing list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {listings.map((item) => (
              <article key={item.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{item.supplier} • {item.category}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {item.pricing_mode === "fixed" ? `$${item.unit_price}` : "RFQ"}
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
          <h2>Are you sure you want to logout?</h2>
          <button  onClick={onLogoutConfirm}>
            Confirm Logout
          </button>
        </div>
      )}
    </div>
  );
}