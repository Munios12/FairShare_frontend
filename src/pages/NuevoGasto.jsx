import { useState, useEffect } from "react";
import useGroups from "../hooks/useGroups";
import useExpenses from "../hooks/useExpenses";

export default function NuevoGasto() {
  
  const [concepto, setConcepto] = useState("");
  const [grupo, setGrupo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [pagadoPor, setPagadoPor] = useState("");

  // Listado BASE para que la UI no se rompa
  const participantesBase = ["Juan", "Luismi", "Alex", "Jesús"];

  const { groups } = useGroups();
  const { addExpense } = useExpenses();

  const [participantes, setParticipantes] = useState(
    participantesBase.reduce((acc, p) => {
      acc[p] = true;
      return acc;
    }, {})
  );

  // CUANDO SE ESCRIBE UN GRUPO 
  useEffect(() => {
    if (!grupo.trim()) {
      // restaurar lista base si el campo está vacío
      const base = {};
      participantesBase.forEach((p) => (base[p] = true));
      setParticipantes(base);
      setPagadoPor(participantesBase[0]);
      return;
    }

    const g = groups.find(
      (gr) => gr.name.toLowerCase() === grupo.toLowerCase()
    );

    if (g) {
      const inicial = {};
      g.miembros.forEach((m) => (inicial[m] = true));

      setParticipantes(inicial);
      setPagadoPor(g.miembros[0] || "");
    }
  }, [grupo, groups]);

  // Toggle
  const toggleParticipante = (nombre) => {
    setParticipantes((prev) => ({
      ...prev,
      [nombre]: !prev[nombre],
    }));
  };

  // SUBMIT 
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!concepto.trim() || !cantidad.trim() || !grupo.trim()) {
      alert("Por favor, completa concepto, cantidad y grupo.");
      return;
    }

    const g = groups.find(
      (gr) => gr.name.toLowerCase() === grupo.toLowerCase()
    );

    if (!g) {
      alert("El grupo indicado no existe.");
      return;
    }

    const participantesFinal = Object.keys(participantes).filter(
      (p) => participantes[p]
    );

    if (participantesFinal.length === 0) {
      alert("Debe participar al menos 1 miembro.");
      return;
    }

    addExpense({
      concepto,
      amount: parseFloat(cantidad),
      groupId: g.id,
      paidBy: pagadoPor,
      participants: participantesFinal,
    });

    alert(`Gasto "${concepto}" añadido correctamente ✔`);

    setConcepto("");
    setGrupo("");
    setCantidad("");

    // lista base
    const base = {};
    participantesBase.forEach((p) => (base[p] = true));
    setParticipantes(base);
    setPagadoPor(participantesBase[0]);
  };

  return (
    <div>
      <h1 className="title">Añadir gasto personal</h1>

      <form className="form card" onSubmit={handleSubmit}>

        <label>Concepto</label>
        <input
          type="text"
          placeholder="Cena restaurante"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />

        <label>Grupo</label>
        <input
          type="text"
          placeholder="Añadir a grupo"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        />

        <label>Cantidad (€)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0,00"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        {/* PAGADO POR  */}
        <label>Pagado por</label>
        <select
          value={pagadoPor}
          onChange={(e) => setPagadoPor(e.target.value)}
        >
          {Object.keys(participantes).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {/* PARTICIPANTES */}
        <label>Participantes</label>
        <div className="chips">
          {Object.keys(participantes).map((nombre) => (
            <label key={nombre}>
              <input
                type="checkbox"
                checked={participantes[nombre]}
                onChange={() => toggleParticipante(nombre)}
              />
              {" "}{nombre}
            </label>
          ))}
        </div>

        <button className="btn primary" type="submit">
          Guardar gasto
        </button>
      </form>
    </div>
  );
}
