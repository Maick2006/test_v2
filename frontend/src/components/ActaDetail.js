import React, { useState, useEffect } from "react";
import { fetchActaDetail, fetchProtectedFile } from "../api";
import GestionForm from "./GestionForm";

export default function ActaDetail({ token, actaId, onClose }) {
  const [acta, setActa] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchActaDetail(token, actaId)
      .then((data) => {
        setActa(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar detalles del acta:", error);
        alert("Error al cargar detalles del acta: " + (error.message || JSON.stringify(error)));
        setLoading(false);
      });
  }, [actaId, token]);

  const verPDF = async () => {
    if (!acta?.pdf_path) return;
    try {
      const blob = await fetchProtectedFile(token, acta.pdf_path);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error al cargar el PDF:", error);
      alert("Error al cargar el PDF: " + (error.message || JSON.stringify(error)));
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!acta) return <div>No se encontró la acta</div>;

  return (
    <div>
      <button onClick={onClose}>Cerrar</button>
      <h3>{acta.titulo}</h3>
      <p>{acta.descripcion}</p>
      <button onClick={verPDF} disabled={!acta.pdf_path}>Ver PDF</button>
      {pdfUrl && <iframe src={pdfUrl} width="100%" height="400" title="pdf" />}
      <h4>Compromisos</h4>
      <ul>
        {acta.compromisos.map((c) => (
          <li key={c.id}>{c.titulo}</li>
        ))}
      </ul>
      <GestionForm token={token} compromisos={acta.compromisos} />
    </div>
  );
}
