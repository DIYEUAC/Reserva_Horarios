// authCheck.js
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

onAuthStateChanged(auth, (user) => {
  const tipo = localStorage.getItem('tipoUsuario');
  const path = window.location.pathname;

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

  if (!user) {
    redirigirConAlerta('Debes iniciar sesión para acceder.');
  } else {
    if (path.includes("main_docente.html") && tipo !== "docente") {
      redirigirConAlerta('No tienes permiso para acceder como docente.');
    }

    if (path.includes("main_participante.html") && tipo !== "participante") {
      redirigirConAlerta('No tienes permiso para acceder como participante.');
    }

    if (path.includes("acceso.html") && !tipo) {
      redirigirConAlerta('Tu acceso aún no ha sido validado.');
    }
  }
});
