import React, { useState, useEffect, useCallback } from "react";
import { fetchActas } from "../api";

export default function ActasTable({ token, rol, onSelect }) {
  const [actas, setActas] = useState([]);
  const [filtro, setFiltro] = useState({ titulo: "", estado: "", fecha: "" });

  const load = useCallback(async () => {
    try {
      const data = await fetchActas(token, filtro);
      setActas(data);
    } catch {}
  }, [token, filtro]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2>Actas</h2>
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
      <table border="1" style={{ marginTop: 10, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {actas.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No hay actas para mostrar
              </td>
            </tr>
          )}
          {actas.map((a) => (
            <tr key={a.id}>
              <td>{a.titulo}</td>
              <td>{a.estado}</td>
              <td>{a.fecha}</td>
              <td>
                <button onClick={() => onSelect(a.id)}>Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}