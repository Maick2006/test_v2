import React, { useState, useEffect } from "react";
import { fetchActaDetail, updateActa } from "../api";

export default function ActaDetail({ token, rol, actaId, onClose }) {
  const [acta, setActa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    titulo: "",
    estado: "",
    fecha: "",
    archivo: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchActaDetail(token, actaId)
      .then((data) => {
        setActa(data);
        setEditData({
          titulo: data.titulo || "",
          estado: data.estado || "",
          fecha: data.fecha || "",
          archivo: null,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actaId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) setEditData((prev) => ({ ...prev, archivo: files[0] }));
    else setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!editData.titulo.trim() || !editData.estado || !editData.fecha) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", editData.titulo);
    formData.append("estado", editData.estado);
    formData.append("fecha", editData.fecha);
    if (editData.archivo) formData.append("archivo", editData.archivo);

    try {
      await updateActa(token, actaId, formData);
      setEditing(false);
      onClose();
    } catch {
      setError("Error al guardar la acta.");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!acta) return <div>No se encontró el acta</div>;

  return (
    <div>
      <button onClick={onClose} style={{ marginBottom: 10 }}>Cerrar</button>
      {!editing ? (
        <>
          <h3>{acta.titulo}</h3>
          <p>{acta.descripcion || "Sin descripción"}</p>
          <p>Estado: {acta.estado}</p>
          <p>Fecha: {acta.fecha}</p>
          {rol === "admin" && (
            <button onClick={() => setEditing(true)} style={{ marginTop: 10 }}>
              Editar
            </button>
          )}
        </>
      ) : (
        <form onSubmit={handleSave}>
          <input
            name="titulo"
            type="text"
            value={editData.titulo}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
          <select
            name="estado"
            value={editData.estado}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: 10 }}
          >
            <option value="">Seleccione estado</option>
            <option value="abierta">Abierta</option>
            <option value="en_revision">En revisión</option>
            <option value="cerrada">Cerrada</option>
          </select>
          <input
            name="fecha"
            type="date"
            value={editData.fecha}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: 10 }}
          />
          <input
            name="archivo"
            type="file"
            accept=".pdf"
            onChange={handleChange}
            style={{ display: "block", marginBottom: 10 }}
          />
          {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}