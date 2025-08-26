import React, { useState } from "react";
import { account, ID } from "../api/appwrite";

export default function Login({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      onAuth(user);
    } catch (err) {
      setError(err.message || "Błąd logowania");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    try {
      await account.create(ID.unique(), email, password, name || undefined);
      await account.createEmailSession(email, password);
      const user = await account.get();
      onAuth(user);
    } catch (err) {
      setError(err.message || "Błąd rejestracji");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>
        {mode === "login" ? "Logowanie" : "Rejestracja"}
      </h2>
      <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
        {mode === "register" && (
          <div>
            <label>Imię (opcjonalne)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan"
            />
          </div>
        )}
        <div>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="submit">
            {mode === "login" ? "Zaloguj" : "Zarejestruj"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Mam nowe konto" : "Mam już konto"}
          </button>
        </div>
      </form>
    </div>
  );
}
