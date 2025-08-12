import React, { useState } from "react";
import { login } from "../api";

export default function LoginForm({ onLogin = () => {} }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(correo, password);
      if (!data) throw new Error("Respuesta vacía del servidor");
      onLogin(data);
    } catch (err) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Credenciales inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <label htmlFor="correo">Correo</label>
      <input
        id="correo"
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
