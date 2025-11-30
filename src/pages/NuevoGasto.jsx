// Página: Añadir gasto
// Esta pantalla reproduce el formulario original del mockup (HTML + CSS + JS) en formato React.
// Aquí el usuario puede introducir un concepto, cantidad, quién pagó y los participantes.
//
// Versión actual: modo mockup (datos estáticos y no se conecta a backend).
// Más adelante: conectaremos ExpensesContext y expensesService.

import { useState } from "react";

export default function NuevoGasto() {
  // ======================================
  //   ESTADOS DEL FORMULARIO (mockup)
  // ======================================
  const [concepto, setConcepto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [pagadoPor, setPagadoPor] = useState("Juan");

  // Lista estática de participantes (mockup original)
  // Más adelante → vendrá del backend (grupo actual)
  const participantesIniciales = ["Juan", "Luismi", "Alex", "Jesús"];

  // Estado que guarda quién está seleccionado
  const [participantes, setParticipantes] = useState({
    Juan: true,
    Luismi: true,
    Alex: false,
    Jesús: true,
  });

  // Manejar cambios en los checkboxes
  const toggleParticipante = (nombre) => {
    setParticipantes({
      ...participantes,
      [nombre]: !participantes[nombre],
    });
  };

  // ======================================
  //  MANEJAR ENVÍO DEL FORMULARIO
  // ======================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica semejante al mockup original
    if (!concepto.trim() || !cantidad.trim()) {
      alert("Por favor completa el concepto y la cantidad.");
      return;
    }

    // Preparar gasto (modo mockup)
    const gasto = {
      concepto,
      cantidad: parseFloat(cantidad),
      pagadoPor,
      participantes: Object.keys(participantes).filter((p) => participantes[p]),
    };

    console.log("GASTO CREADO (mockup):", gasto);

    alert(`Gasto "${concepto}" añadido correctamente (mockup)`);
  };

  return (
    <div>
      {/* TÍTULO PRINCIPAL */}
      <h1 className="title">Añadir gasto</h1>

      {/* CARD DEL FORMULARIO (igual que el mockup original) */}
      <form className="form card" onSubmit={handleSubmit}>


        {/* Campo: concepto del gasto */}
        <label>Concepto</label>
        <input
          type="text"
          placeholder="Cena restaurante"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />

        {/* Campo: cantidad en euros */}
        <label>Cantidad (€)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0,00"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        {/* Select: quién pagó */}
        <label>Pagado por</label>
        <select value={pagadoPor} onChange={(e) => setPagadoPor(e.target.value)}>
          {participantesIniciales.map((nom) => (
            <option key={nom}>{nom}</option>
          ))}
        </select>

        {/* Checkboxes: participantes del gasto */}
        <label>Participantes</label>
        <div className="chips">
          {participantesIniciales.map((nombre) => (
            <label key={nombre}>
              {/* Checkbox individual */}
              <input
                type="checkbox"
                checked={participantes[nombre]}
                onChange={() => toggleParticipante(nombre)}
              />
              {" "}{nombre}
            </label>
          ))}
        </div>

        {/* Botón principal */}
        <button className="btn primary" type="submit">
          Guardar gasto
        </button>
      </form>
    </div>
  );
}
