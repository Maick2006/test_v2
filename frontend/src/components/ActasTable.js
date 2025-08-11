import React, { useState, useEffect, useCallback } from "react";
import { fetchActas } from "../api";
import axios from "axios";

export default function ActasTable({ token, user, onSelect }) {
  const [actas, setActas] = useState([]);
  const [filtro, setFiltro] = useState({ titulo: "", estado: "", fecha: "" });
  const [showModal, setShowModal] = useState(false);
  const [newActa, setNewActa] = useState({ titulo: "", estado: "", fecha: "", archivo: null });

  const load = useCallback(async () => {
    try {
      const data = await fetchActas(token, filtro);
      setActas(data);
    } catch (error) {
      console.error("Error al cargar las actas:", error);
      alert("Error al cargar las actas: " + (error.message || JSON.stringify(error)));
    }
  }, [token, filtro]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newActa.titulo || !newActa.estado || !newActa.fecha) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const formData = new FormData();
    formData.append("titulo", newActa.titulo);
    formData.append("estado", newActa.estado);
    formData.append("fecha", newActa.fecha);
    if (newActa.archivo) {
      formData.append("pdf", newActa.archivo);
    }
    try {
      await axios.post("http://localhost:8000/api/actas/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setShowModal(false);
      setNewActa({ titulo: "", estado: "", fecha: "", archivo: null });
      load();
    } catch (error) {
      console.error("Error al crear el acta:", error);
      if (error.response && error.response.data) {
        alert("Error: " + JSON.stringify(error.response.data));
      } else if (error.message) {
        alert("Error: " + error.message);
      } else {
        alert("Error desconocido al crear el acta");
      }
    }
  };

  return (
    <div>
      <h2>Actas</h2>
      {user?.is_staff && (
        <button style={{ marginBottom: "10px" }} onClick={() => setShowModal(true)}>Nueva Acta</button>
      )}
      <div>
        <input
          placeholder="Título"
          value={filtro.titulo}
          onChange={(e) => setFiltro({ ...filtro, titulo: e.target.value })}
        />
        <select
          value={filtro.estado}
          onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="abierta">Abierta</option>
          <option value="en_revision">En revisión</option>
          <option value="cerrada">Cerrada</option>
        </select>
        <input
          type="date"
          value={filtro.fecha}
          onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
        />
        <button onClick={load}>Filtrar</button>
      </div>
      <table border="1" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Compromisos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actas.map((a) => (
            <tr key={a.id}>
              <td>{a.titulo}</td>
              <td>{a.estado}</td>
              <td>{a.fecha}</td>
              <td>{a.compromisos.length}</td>
              <td><button onClick={() => onSelect(a.id)}>Detalle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: "300px",
            }}
          >
            <h3>Nueva Acta</h3>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Título"
                value={newActa.titulo}
                onChange={(e) => setNewActa({ ...newActa, titulo: e.target.value })}
              />
              <select
                value={newActa.estado}
                onChange={(e) => setNewActa({ ...newActa, estado: e.target.value })}
              >
                <option value="">Seleccione estado</option>
                <option value="abierta">Abierta</option>
                <option value="en_revision">En revisión</option>
                <option value="cerrada">Cerrada</option>
              </select>
              <input
                type="date"
                value={newActa.fecha}
                onChange={(e) => setNewActa({ ...newActa, fecha: e.target.value })}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setNewActa({ ...newActa, archivo: e.target.files[0] })}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
