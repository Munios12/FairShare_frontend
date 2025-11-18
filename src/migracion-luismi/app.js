// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
const screens = ["login", "register", "dashboard", "grupos", "nuevo", "balance", "config"];

function show(id) {
  screens.forEach(s => {
    document.getElementById(s)?.classList.remove("visible");
  });
  document.getElementById(id)?.classList.add("visible");
  document.querySelectorAll(".nav-item").forEach(b =>
    b.classList.toggle("active", b.dataset.nav === id)
  );
}

// Bloqueo de navegación hasta login
let isLogged = false;
document.querySelectorAll("[data-nav]").forEach(el => {
  el.addEventListener("click", e => {
    const target = e.currentTarget.dataset.nav;
    if (!isLogged && target !== "login" && target !== "register") {
      alert("Inicia sesión para continuar.");
      show("login");
      return;
    }
    show(target);
  });
});

// Mostrar el Login al iniciar
show("login");

// ==================== DATOS SIMULADOS ====================
let usuarioActivo = "—";
let grupos = ["Piso compartido", "Viaje a Barcelona"];
let gastos = [];

// ==================== REFERENCIAS DEL DOM ====================
const formNuevo = document.querySelector("#nuevo .form");
const dashboardList = document.querySelector("#dashboard .list");
const balanceTable = document.querySelector("#balance tbody");
const gruposList = document.querySelector("#grupos .list");
const nombreUsuario = document.querySelector(".user-name");

// ==================== REGISTRO DE USUARIO (CP-002) ====================
const btnRegister = document.getElementById("btnRegister");
const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

goRegister?.addEventListener("click", e => {
  e.preventDefault();
  show("register");
});

goLogin?.addEventListener("click", e => {
  e.preventDefault();
  show("login");
});

btnRegister?.addEventListener("click", e => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const msgBox = document.getElementById("msgRegister");

  // Limpia mensaje previo
  msgBox.textContent = "";
  msgBox.className = "msg";

  //  Validar campos vacíos
  if (!name || !email || !pass) {
    msgBox.textContent = "Por favor, completa todos los campos (correo, nombre y contraseña).";
    msgBox.classList.add("error");
    return;
  }

  //  Validar longitud mínima de contraseña
  if (pass.length < 6) {
    msgBox.textContent = "La contraseña debe tener al menos 6 caracteres.";
    msgBox.classList.add("error");
    return;
  }

  //  Validar espacios
  if (/^\s+$/.test(pass)) {
    msgBox.textContent = "La contraseña no puede estar compuesta solo por espacios.";
    msgBox.classList.add("error");
    return;
  }

  // Guardamos datos (simula base de datos)
  localStorage.setItem("fairshare_user", JSON.stringify({ name, email, pass }));

  // 4️⃣ Mensaje de éxito
  msgBox.textContent = "Cuenta creada correctamente ✅ Tu usuario ha sido registrado.";
  msgBox.classList.add("success");

  // Autocompleta el login y cambia de pantalla tras un pequeño retraso
  document.getElementById("email").value = email;
  setTimeout(() => {
    msgBox.textContent = "";
    show("login");
  }, 1500);
});

// ==================== LOGIN (CP-010) ====================
const btnLogin = document.getElementById("btnLogin");
const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");

btnLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = (emailEl?.value || "").trim();
  const pass = (passEl?.value || "").trim();

  const userData = JSON.parse(localStorage.getItem("fairshare_user"));

  // Comprobamos usuario demo o registrado
  if (
    (email === "juan@email.com" && pass === "1234") ||
    (userData && userData.email === email && userData.pass === pass)
  ) {
    isLogged = true;
    usuarioActivo = userData?.name || "Juan Díaz";
    if (nombreUsuario) nombreUsuario.textContent = usuarioActivo;
    show("dashboard"); // CP-010: aparece el dashboard con nombre visible
  } else {
    alert("Credenciales incorrectas. Intenta nuevamente.");
  }
});

// ==================== GESTIÓN DE GRUPOS (CP-007) ====================
function cargarGrupos() {
  if (!gruposList) return;
  gruposList.innerHTML = "";
  grupos.forEach(g => {
    const li = document.createElement("li");
    li.textContent = g;
    gruposList.appendChild(li);
  });
}
cargarGrupos();

const nuevoGrupoBtn = document.querySelector("#nuevo-grupo-btn");
nuevoGrupoBtn?.addEventListener("click", () => {
  const nombre = prompt("Introduce el nombre del nuevo grupo:");
  if (nombre) {
    grupos.push(nombre);
    cargarGrupos();
    alert("Grupo creado correctamente ✅");
    show("grupos");
  }
});

// ==================== AÑADIR NUEVO GASTO (CP-014) ====================
if (formNuevo) {
  const btnGuardar = formNuevo.querySelector(".btn.primary");
  btnGuardar?.addEventListener("click", e => {
    e.preventDefault();

    const concepto = formNuevo.querySelector("input[type=text]").value;
    const cantidad = parseFloat(formNuevo.querySelector("input[type=number]").value);
    const pagadoPor = formNuevo.querySelector("select")?.value || usuarioActivo;
    const participantes = Array.from(
      formNuevo.querySelectorAll(".chips input:checked")
    ).map(c => c.parentElement.textContent.trim());

    if (!concepto || isNaN(cantidad)) {
      alert("Por favor, completa el concepto y la cantidad.");
      return;
    }

    const gasto = { concepto, cantidad, pagadoPor, participantes };
    gastos.push(gasto);
    actualizarDashboard();
    actualizarBalance();
    alert(`Gasto "${concepto}" añadido correctamente ✅`);
    show("dashboard");
  });
}

// ==================== DASHBOARD (CP-013) ====================
function actualizarDashboard() {
  if (!dashboardList) return;
  dashboardList.innerHTML = "";

  if (gastos.length === 0) {
    dashboardList.innerHTML = "<li>No hay gastos registrados todavía.</li>";
    return;
  }

  gastos.slice(-3).reverse().forEach(g => {
    const li = document.createElement("li");
    li.textContent = `${g.concepto} – €${g.cantidad.toFixed(2)}`;
    dashboardList.appendChild(li);
  });
}

// ==================== BALANCE (CP-007 / CP-013) ====================
function actualizarBalance() {
  if (!balanceTable) return;

  const usuarios = ["Juan", "Luismi", "Alex", "Jesús"];
  const balance = {};
  usuarios.forEach(u => (balance[u] = { debe: 0, recibe: 0 }));

  gastos.forEach(g => {
    const totalPorPersona = g.cantidad / g.participantes.length;
    g.participantes.forEach(p => {
      if (p !== g.pagadoPor) balance[p].debe += totalPorPersona;
    });
    balance[g.pagadoPor].recibe += g.cantidad - totalPorPersona;
  });

  balanceTable.innerHTML = "";
  usuarios.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u}</td>
      <td class="neg">€${balance[u].debe.toFixed(2)}</td>
      <td class="pos">€${balance[u].recibe.toFixed(2)}</td>
    `;
    balanceTable.appendChild(tr);
  });
}

// ==================== CONFIGURACIÓN (CP-015) ====================
const btnGuardarConfig = document.querySelector("#config .btn.primary");
btnGuardarConfig?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Configuración actualizada correctamente ✅");
});

// ==================== INICIALIZACIÓN ====================
actualizarDashboard();
actualizarBalance();
