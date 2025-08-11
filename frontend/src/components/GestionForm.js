import React, { useState } from "react";
import { createGestion } from "../api";

export default function GestionForm({ token, compromisos }) {
  const [compromiso, setCompromiso] = useState(compromisos[0]?.id || "");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("compromiso", compromiso);
    form.append("fecha", fecha);
    form.append("descripcion", descripcion);
    if (archivo) form.append("archivo", archivo);
    await createGestion(token, form);
    alert("Gestión creada");
  };

  return (
    <form onSubmit={submit}>
      <select value={compromiso} onChange={(e) => setCompromiso(e.target.value)}>
        {compromisos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.titulo}
          </option>
        ))}
      </select>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => setArchivo(e.target.files[0])} />
      <button type="submit">Guardar</button>
    </form>
  );
}