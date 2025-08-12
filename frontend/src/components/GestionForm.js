import React, { useState } from "react";
import { createGestion } from "../api";

export default function GestionForm({ token, compromisos = [] }) {
  const [compromiso, setCompromiso] = useState(compromisos.length > 0 ? compromisos[0].id : "");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!compromiso || !fecha || !descripcion) return;

    const form = new FormData();
    form.append("compromiso", compromiso);
    form.append("fecha", fecha);
    form.append("descripcion", descripcion);
    if (archivo) form.append("archivo", archivo);

    try {
      await createGestion(token, form);
      alert("Gestión creada");
      setFecha("");
      setDescripcion("");
      setArchivo(null);
      setCompromiso(compromisos.length > 0 ? compromisos[0].id : "");
    } catch {
      alert("Error al crear la gestión");
    }
  };

  return (
    <form onSubmit={submit}>
      <select value={compromiso} onChange={(e) => setCompromiso(e.target.value)} required>
        {compromisos.length > 0 ? (
          compromisos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.titulo}
            </option>
          ))
        ) : (
          <option value="">No hay compromisos disponibles</option>
        )}
      </select>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg"
        onChange={(e) => setArchivo(e.target.files[0])}
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
