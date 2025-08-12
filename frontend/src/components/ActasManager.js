import React, { useState } from "react";
import ActasTable from "./ActasTable";
import ActaDetail from "./ActaDetail";
import ActaForm from "./ActaForm";

export default function ActasManager({ token, rol }) {
  const [selectedActaId, setSelectedActaId] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleSelect = (id) => {
    setSelectedActaId(id);
    setCreating(false);
  };

  const handleAddClick = () => {
    setCreating(true);
    setSelectedActaId(null);
  };

  const handleCloseDetail = () => {
    setSelectedActaId(null);
  };

  const handleCancelForm = () => {
    setCreating(false);
  };

  const handleSaved = () => {
    setCreating(false);
    setSelectedActaId(null);
  };

  return (
    <div>
      {!selectedActaId && !creating && (
        <>
          {rol === "admin" && (
            <button onClick={handleAddClick} style={{ marginBottom: 10 }}>
              Agregar Acta
            </button>
          )}
          <ActasTable token={token} rol={rol} onSelect={handleSelect} />
        </>
      )}
      {selectedActaId && (
        <ActaDetail token={token} rol={rol} actaId={selectedActaId} onClose={handleCloseDetail} />
      )}
      {creating && (
        <ActaForm
          token={token}
          onCancel={handleCancelForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
