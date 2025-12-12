import React, { useState } from "react";

export default function Supplier() {
  const [route, setRoute] = useState("view"); // 'view' | 'create' | 'logout'
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  const initialForm = {
    category: "raw_material",
    name: "",
    description: "",
    quantity_available: "",
    unit: "kg",
    location_country: "India",
    pricing_mode: "fixed", // default
    unit_price: "",
  };
  const [form, setForm] = useState(initialForm);

  function navigate(to) {
    setError("");
    setRoute(to);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handlePricingMode(e) {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      pricing_mode: value,
      unit_price: value === "fixed" ? f.unit_price : "", // clear unit_price when switching to rfq_only
    }));
  }

  function validateForm() {
    if (!form.name.trim()) return "Name is required.";
    if (form.quantity_available === "") return "Quantity available is required.";
    const qty = Number(form.quantity_available);
    if (!Number.isFinite(qty) || qty < 0) return "Quantity must be a non-negative number.";
    if (!form.unit) return "Unit is required.";
    if (!form.location_country) return "Location country is required.";
    if (!form.pricing_mode) return "Pricing mode is required.";
    if (form.pricing_mode === "fixed") {
      if (form.unit_price === "") return "Unit price is required for fixed pricing.";
      const p = Number(form.unit_price);
      if (!Number.isFinite(p) || p < 0) return "Unit price must be a non-negative number.";
    }
    return null;
  }

  function createListing(e) {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    const newListing = {
      id: Date.now(),
      category: form.category,
      name: form.name.trim(),
      description: form.description.trim(),
      quantity_available: Number(form.quantity_available),
      unit: form.unit,
      location_country: form.location_country,
      pricing_mode: form.pricing_mode,
      unit_price: form.pricing_mode === "fixed" ? Number(form.unit_price) : null,
      created_at: new Date().toISOString(),
    };

    setListings((L) => [newListing, ...L]);
    setForm(initialForm);
    setRoute("view");
    setError("");
  }

  function deleteListing(id) {
    if (!confirm("Delete this listing?")) return;
    setListings((L) => L.filter((x) => x.id !== id));
  }

  function logout() {
    // simple logout simulation: clear listings and show logout page (adjust as needed)
    setRoute("logout");
    // optionally: setListings([]); // keep or clear listings depending on desired behavior
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      {/* Navigation */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => navigate("view")}>View Listing</button>
        <button onClick={() => navigate("create")}>Create Listing</button>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Routes */}
      {route === "view" && (
        <div>
          <h2>Listings ({listings.length})</h2>
          {listings.length === 0 ? (
            <p>No listings yet. Use "Create Listing" to add one.</p>
          ) : (
            listings.map((item) => (
              <div key={item.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}>
                <div><strong>{item.name}</strong> — <em>{item.category}</em></div>
                {item.description && <div>{item.description}</div>}
                <div>
                  Quantity: {item.quantity_available} {item.unit} — Location: {item.location_country}
                </div>
                <div>
                  Price: {item.pricing_mode === "fixed" ? `${item.unit_price} per ${item.unit}` : "RFQ only"}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => deleteListing(item.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {route === "create" && (
        <div>
          <h2>Create Listing</h2>
          <form onSubmit={createListing}>
            {/* Category */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Category:
                <select name="category" value={form.category} onChange={handleChange} style={{ marginLeft: 8 }}>
                  <option value="raw_material">raw_material</option>
                  <option value="service">service</option>
                  <option value="other">other</option>
                </select>
              </label>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Name:
                <input name="name" value={form.name} onChange={handleChange} style={{ marginLeft: 8 }} />
              </label>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Description:
                <br />
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} cols={60} />
              </label>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Quantity available:
                <input
                  name="quantity_available"
                  value={form.quantity_available}
                  onChange={handleChange}
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>

            {/* Unit */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Unit:
                <select name="unit" value={form.unit} onChange={handleChange} style={{ marginLeft: 8 }}>
                  <option value="kg">kg</option>
                  <option value="ton">ton</option>
                  <option value="litre">litre</option>
                  <option value="pcs">pcs</option>
                </select>
              </label>
            </div>

            {/* Country */}
            <div style={{ marginBottom: 8 }}>
              <label>
                Location country:
                <select
                  name="location_country"
                  value={form.location_country}
                  onChange={handleChange}
                  style={{ marginLeft: 8 }}
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>China</option>
                  <option>Germany</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            {/* Pricing Mode - RADIO */}
            <div style={{ marginBottom: 8 }}>
              <div>Pricing mode:</div>
              <label style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name="pricing_mode"
                  value="fixed"
                  checked={form.pricing_mode === "fixed"}
                  onChange={handlePricingMode}
                />{" "}
                Fixed (public unit price)
              </label>

              <label>
                <input
                  type="radio"
                  name="pricing_mode"
                  value="rfq_only"
                  checked={form.pricing_mode === "rfq_only"}
                  onChange={handlePricingMode}
                />{" "}
                RFQ Only (buyers must request a quote)
              </label>
            </div>

            {/* Unit Price - ONLY when fixed */}
            {form.pricing_mode === "fixed" && (
              <div style={{ marginBottom: 8 }}>
                <label>
                  Unit price:
                  <input name="unit_price" value={form.unit_price} onChange={handleChange} style={{ marginLeft: 8 }} />
                </label>
              </div>
            )}

            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

            <div style={{ marginTop: 10 }}>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setForm(initialForm)} style={{ marginLeft: 8 }}>
                Reset
              </button>
              <button type="button" onClick={() => navigate("view")} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {route === "logout" && (
        <div>
          <h2>You are logged out.</h2>
          <p>Refresh the page to start a new session (or implement real auth as needed).</p>
        </div>
      )}
    </div>
  );
}