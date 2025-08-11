import React, { useState } from "react";
import { login } from "../api";

export default function LoginForm({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(correo, password);
      onLogin(data);
    } catch {
      setError("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}