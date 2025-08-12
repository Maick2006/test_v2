import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ActasTable from "./components/ActasTable";
import ActaDetail from "./components/ActaDetail";
import ActaForm from "./components/ActaForm";

export default function App() {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("session") || "null")
  );
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);

  const onLogin = (data) => {
    const s = { token: data.token, role: data.role, user: data.user };
    localStorage.setItem("session", JSON.stringify(s));
    setSession(s);
  };

  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
    setSelected(null);
    setCreating(false);
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

      {!selected && !creating && (
        <>
          {session.role === "admin" && (
            <button onClick={() => setCreating(true)}>Agregar Acta</button>
          )}
          <ActasTable
            token={session.token}
            rol={session.role}
            onSelect={setSelected}
          />
        </>
      )}

      {selected && (
        <ActaDetail
          token={session.token}
          actaId={selected}
          onClose={() => setSelected(null)}
          rol={session.role}
        />
      )}

      {creating && (
        <ActaForm
          token={session.token}
          onCancel={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
