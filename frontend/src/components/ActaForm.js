import React, { useState } from "react";
import axios from "axios";

export default function ActaForm({ token, initialData = {}, onCancel, onSaved }) {
  const [titulo, setTitulo] = useState(initialData.titulo || "");
  const [estado, setEstado] = useState(initialData.estado || "");
  const [fecha, setFecha] = useState(initialData.fecha || "");
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !estado || !fecha) {
      setError("Todos los campos obligatorios deben estar completos");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("estado", estado);
    formData.append("fecha", fecha);
    if (archivo) formData.append("archivo", archivo);

    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (initialData.id) {
        await axios.put(`http://127.0.0.1:8000/api/actas/${initialData.id}/`, formData, config);
      } else {
        await axios.post("http://127.0.0.1:8000/api/actas/", formData, config);
      }

      setError(null);
      if (onSaved) onSaved();
    } catch {
      setError("Error al guardar el acta");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      >
        <option value="">Seleccione estado</option>
        <option value="abierta">Abierta</option>
        <option value="en_revision">En revisión</option>
        <option value="cerrada">Cerrada</option>
      </select>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setArchivo(e.target.files[0])}
        style={{ display: "block", marginBottom: 10 }}
      />
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <div>
        <button type="submit">Guardar</button>
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 10 }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}