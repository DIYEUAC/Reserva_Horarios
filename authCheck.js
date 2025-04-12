import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAe3LW9dme23o1AGXqg4WkJ0",
  authDomain: "reservas-incuba.firebaseapp.com",
  projectId: "reservas-incuba",
  appId: "1:321837960358:web:65127a59a8aa4aae0d7867"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Asegurarse de que la autenticación esté completamente cargada
onAuthStateChanged(auth, (user) => {
  if (!user) {
    redirigirConAlerta('Debes iniciar sesión para acceder.');
    return; // Detiene la ejecución si el usuario no está logueado
  }

  const tipo = localStorage.getItem('tipoUsuario');
  console.log("Tipo de usuario:", tipo);

  if (tipo === null) {
    redirigirConAlerta('Tipo de usuario no definido.');
    return; // Detiene si no hay tipo de usuario
  }

  const path = window.location.pathname;

  // Comprobar si el tipo de usuario tiene acceso a la página
  if (path.includes("horarios_docentes.html") && tipo !== "docente") {
    redirigirConAlerta('No tienes permiso para acceder como docente.');
  } else if (path.includes("horarios_participantes.html") && tipo !== "participante") {
    redirigirConAlerta('No tienes permiso para acceder como participante.');
  } else if (path.includes("acceso.html") && !tipo) {
    redirigirConAlerta('Tu acceso aún no ha sido validado.');
  }
});

const redirigirConAlerta = (mensaje) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso restringido',
      text: mensaje,
      confirmButtonColor: '#003366',
      confirmButtonText: 'Volver al inicio'
    }).then(() => {
      window.location.href = "index.html";
    });
  } else {
    alert(mensaje);
    window.location.href = "index.html";
  }
};
