import React, { useState } from "react";
import "./App.css"; // Import external CSS file

export default function App() {
  const [mode, setMode] = useState("login"); 
  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!form.email || !form.password) {
      return setMessage("Email and password required.");
    }

    if (mode === "signup" && form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    const url =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

    const dataToSend = {
      name: form.name,
      email: form.email,
      password: form.password,
      role,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.msg || "Error");

      setMessage(data.msg || "Success!");

      if (data.token) localStorage.setItem("token", data.token);
    } catch (err) {
      setMessage("Server connection failed.");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

        <div className="row">
          <button
            className={role === "customer" ? "active-btn" : "btn"}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
          <button
            className={role === "buyer" ? "active-btn" : "btn"}
            onClick={() => setRole("buyer")}
          >
            Buyer
          </button>
        </div>

        {/* Tab Selection */}
        <div className="row">
          <button
            className={mode === "login" ? "tab-active" : "tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "tab-active" : "tab"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              className="input"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          )}

          <input
            className="input"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="input"
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {mode === "signup" && (
            <input
              className="input"
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          )}

          {message && <p className="message">{message}</p>}

          <button className="main-btn" type="submit">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
