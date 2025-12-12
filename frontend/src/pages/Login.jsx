import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {

  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState(null);

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
      role, // will be whatever the state has (default customer or what user picked in signup)
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

      let selectedRole = null

      // store role returned by backend if present (safe fallback)
      if (data.data?.role) {
        localStorage.setItem("role", data.data.role);
        const stored = localStorage.getItem("role");
        const user = stored ? stored : null;
        console.log(user)
        console.log(data.data.role)
        selectedRole = user
      } else {
        // for signup we already have the chosen role in state
        if (mode === "signup"){
            localStorage.setItem("role", role);
            const stored = localStorage.getItem("role");
            const user = stored ? stored : null;
            console.log(user)
            selectedRole = user
        }  
      }


      console.log(`selected role = ${selectedRole}`)
      if(selectedRole=='customer') navigate("/supplier");
      else navigate("/buyer")


    } catch (err) {
      console.error(err);
      setMessage("Server connection failed.");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

        {/* Tab Selection */}
        <div className="row" role="tablist" aria-label="Auth tabs">
          <button
            type="button"
            className={mode === "login" ? "tab-active" : "tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "signup" ? "tab-active" : "tab"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Role selection: only visible in Sign Up mode and placed below tabs */}
        {mode === "signup" && (
          <div className="row" style={{ marginTop: 12 }}>
            <button
              type="button"
              className={role === "customer" ? "active-btn" : "btn"}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={role === "buyer" ? "active-btn" : "btn"}
              onClick={() => setRole("buyer")}
            >
              Buyer
            </button>
          </div>
        )}

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
