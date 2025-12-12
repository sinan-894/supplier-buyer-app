import React, { useState } from "react";

// BuyerUI.jsx
// Minimal, self-contained React component for browsing listings and logout confirmation.

export default function Buyer({ initialListings = null, onLogout = null }) {
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

  const [listings] = useState(initialListings || demo);
  const [route, setRoute] = useState("view"); // 'view' | 'confirmLogout' | 'loggedOut'
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState("");

  // Simulated refresh/load function
  function load() {
    setMsg("Listings refreshed.");
    setTimeout(() => setMsg(""), 2500);
  }

  function openLogoutConfirm() {
    setRoute("confirmLogout");
  }

  function cancelLogout() {
    setRoute("view");
  }

  function performLogout() {
    // UI-only logout. Replace with real auth API call if you have one.
    try {
      localStorage.removeItem("user");
    } catch (e) {
      // ignore if localStorage not available
    }
    if (typeof onLogout === "function") onLogout();
    setRoute("loggedOut");
  }

  function handleBuy(item) {
    // stub: integrate real buy/request logic here
    setMsg(`Requested action for "${item.name}"`);
    setTimeout(() => setMsg(""), 2500);
  }

  // filter logic
  const filtered = listings.filter((it) => (category ? it.category === category : true));

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Browse Listings</h2>
        <div>
          <button onClick={openLogoutConfirm} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {route === "view" && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="categoryFilter">Filter: </label>
            <select
              id="categoryFilter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="">All</option>
              <option value="raw_material">Raw material</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
            <button onClick={load} style={{ marginLeft: 8 }}>
              Refresh
            </button>
          </div>

          {msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
            {filtered.map((item) => (
              <article key={item._id || item.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{item.category}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{item.supplier}</div>
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
                  <div>
                    Available: {item.quantity_available} {item.unit}
                  </div>
                  <div>Location: {item.location_country}</div>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  {item.pricing_mode === "fixed" ? (
                    <button onClick={() => handleBuy(item)}>Buy / Request</button>
                  ) : (
                    <button onClick={() => handleBuy(item)}>Request Quote</button>
                  )}
                  <button onClick={() => setMsg(`Viewing details for "${item.name}"`)}>View Details</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {route === "confirmLogout" && (
        <div style={styles.confirmBox}>
          <h3 style={{ marginTop: 0 }}>Are you sure you want to logout?</h3>
          <p style={{ marginTop: 0 }}>This will end your session on this device.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={performLogout} style={styles.confirmBtn}>
              Confirm Logout
            </button>
            <button onClick={cancelLogout} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {route === "loggedOut" && (
        <div style={{ marginTop: 16 }}>
          <h2>You are logged out</h2>
          <p>Session ended. Implement real auth logout to fully end the session on the server.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: 12,
    borderRadius: 6,
    background: "#fff",
  },
  confirmBox: {
    border: "1px solid #eee",
    padding: 16,
    borderRadius: 6,
    maxWidth: 420,
    background: "#fafafa",
  },
  logoutBtn: {
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "8px 12px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};
