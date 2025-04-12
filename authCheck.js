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

// Función para esperar a que Firebase esté completamente inicializado y obtener el estado de autenticación
const esperarAuthListo = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); // Resuelve si hay un usuario
      } else {
        reject("Usuario no autenticado"); // Rechaza si no hay usuario
      }
      unsubscribe(); // Limpia el listener después de que se resuelva
    });
  });
};

// Usar la promesa para esperar el estado de autenticación
esperarAuthListo()
  .then((user) => {
    // Se asegura de que el user está autenticado y se ejecuta la lógica después de la carga
    console.log("Usuario autenticado:", user);

    const tipo = localStorage.getItem('tipoUsuario');
    console.log("Tipo de usuario:", tipo);

    const path = window.location.pathname;
    if (tipo === null) {
      redirigirConAlerta('Tipo de usuario no definido.');
      return;
    }

    if (path.includes("horarios_docentes.html") && tipo !== "docente") {
      redirigirConAlerta('No tienes permiso para acceder como docente.');
    } else if (path.includes("horarios_participantes.html") && tipo !== "participante") {
      redirigirConAlerta('No tienes permiso para acceder como participante.');
    } else if (path.includes("acceso.html") && !tipo) {
      redirigirConAlerta('Tu acceso aún no ha sido validado.');
    }
  })
  .catch((error) => {
    // Si el usuario no está autenticado, redirige al login
    console.log(error);
    redirigirConAlerta('Debes iniciar sesión para acceder.');
  });

// Función para redirigir con alerta
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
