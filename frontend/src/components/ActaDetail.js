import React, { useState, useEffect } from "react";
import { fetchActaDetail, fetchProtectedFile } from "../api";
import GestionForm from "./GestionForm";

export default function ActaDetail({ token, actaId, onClose }) {
  const [acta, setActa] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchActaDetail(token, actaId).then(setActa);
  }, [actaId, token]);

  const verPDF = async () => {
    if (!acta?.pdf_path) return;
    const blob = await fetchProtectedFile(token, acta.pdf_path);
    setPdfUrl(URL.createObjectURL(blob));
  };

  if (!acta) return <div>Cargando...</div>;

  return (
    <div>
      <button onClick={onClose}>Cerrar</button>
      <h3>{acta.titulo}</h3>
      <p>{acta.descripcion}</p>
      <button onClick={verPDF}>Ver PDF</button>
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