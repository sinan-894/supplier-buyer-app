// src/components/Buyer.jsx
import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function Buyer() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => { load(); }, [category]);

  async function load() {
    setMsg("");
    try {
      const url = category ? `${API}/listings?category=${encodeURIComponent(category)}` : `${API}/listings`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load listings");
    }
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
    </div>
  );
}
