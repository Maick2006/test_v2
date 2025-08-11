import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ActasTable from "./components/ActasTable";
import ActaDetail from "./components/ActaDetail";

export default function App() {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("session") || "null")
  );
  const [selected, setSelected] = useState(null);

  const onLogin = (data) => {
    const s = { token: data.token, role: data.role, user: data.user };
    localStorage.setItem("session", JSON.stringify(s));
    setSession(s);
  };

  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  if (!session) {
    return (
      <div>
        <h1>Sistema de Actas</h1>
        <LoginForm onLogin={onLogin} />
      </div>
    );
  }

  return (
    <div>
      <div>
        {session.user.username} ({session.role}){" "}
        <button onClick={logout}>Salir</button>
      </div>
      {!selected && <ActasTable token={session.token} onSelect={setSelected} />}
      {selected && (
        <ActaDetail
          token={session.token}
          actaId={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
