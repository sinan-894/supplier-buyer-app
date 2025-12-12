import React, { useState } from "react";

export default function Supplier() {
  const [route, setRoute] = useState("view"); // 'view' | 'create' | 'logout'
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    category: "raw_material",
    name: "",
    description: "",
    quantity_available: "",
    unit: "kg",
    location_country: "India",
    pricing_mode: "fixed",
    unit_price: ""
  };
  const [form, setForm] = useState(initialForm);

  async function loadMine() {
    setError("");
    try {
      const res = await fetch(`${API}/listings/mine`, {
        headers: { "Content-Type": "application/json", ...authHeaders() }
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        setError(d.msg || "Failed to load your listings");
        return;
      }
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load listings. Check server and login.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handlePricingMode(e) {
    const v = e.target.value;
    setForm(f => ({ ...f, pricing_mode: v, unit_price: v === "fixed" ? f.unit_price : "" }));
  }

  function validate() {
    if (!form.name.trim()) return "Name required";
    if (form.quantity_available === "") return "Quantity required";
    if (form.pricing_mode === "fixed" && (form.unit_price === "" || isNaN(Number(form.unit_price)))) return "Unit price required";
    return null;
  }

  async function submitListing(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) { setError(v); return; }

    const payload = {
      category: form.category,
      name: form.name.trim(),
      description: form.description.trim(),
      quantity_available: Number(form.quantity_available),
      unit: form.unit,
      location_country: form.location_country,
      pricing_mode: form.pricing_mode,
      unit_price: form.pricing_mode === "fixed" ? Number(form.unit_price) : undefined
    };

    try {
      const res = await fetch(`${API}/listings${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || 'Save failed'); return; }
      // reload
      setForm(initialForm);
      setEditingId(null);
      setRoute("view");
      await loadMine();
    } catch (err) {
      console.error(err);
      setError("Server error while saving listing");
    }
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`${API}/listings/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() }
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        setError(d.msg || 'Delete failed');
        return;
      }
      setListings(prev => prev.filter(x => (x._id || x.id) !== id));
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  }

  function startEdit(item) {
    setEditingId(item._id || item.id);
    setForm({
      category: item.category || "raw_material",
      name: item.name || "",
      description: item.description || "",
      quantity_available: item.quantity_available || "",
      unit: item.unit || "kg",
      location_country: item.location_country || "India",
      pricing_mode: item.pricing_mode || "fixed",
      unit_price: item.unit_price ?? ""
    });
    setRoute("create");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => { setRoute('view'); setError(''); }}>View Listing</button>
        <button onClick={() => { setRoute('create'); setForm(initialForm); setEditingId(null); setError(''); }}>Create Listing</button>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      {route === 'view' && (
        <div>
          <h2>Listings ({listings.length})</h2>
          {listings.length === 0 ? <p>No listings yet.</p> : listings.map(item => (
            <div key={item._id || item.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
              <div><strong>{item.name}</strong> — <em>{item.category}</em></div>
              {item.description && <div>{item.description}</div>}
              <div>Quantity: {item.quantity_available} {item.unit} — Location: {item.location_country}</div>
              <div>Price: {item.pricing_mode === 'fixed' ? `${item.unit_price} per ${item.unit}` : 'RFQ only'}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteListing(item._id || item.id)} style={{ marginLeft: 8 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {route === 'create' && (
        <div>
          <h2>{editingId ? 'Edit Listing' : 'Create Listing'}</h2>
          <form onSubmit={submitListing}>
            {/* ... form fields same as before ... */}
            <div style={{ marginTop: 10 }}>
              <button type="submit">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }} style={{ marginLeft: 8 }}>Reset</button>
              <button type="button" onClick={() => { setRoute('view'); setError(''); }} style={{ marginLeft: 8 }}>Cancel</button>
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
