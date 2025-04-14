import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAe3LW9dme23o1AGXqg4WkJ0",
  authDomain: "reservas-incuba.firebaseapp.com",
  projectId: "reservas-incuba",
  appId: "1:321837960358:web:65127a59a8aa4aae0d7867"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para esperar que Firebase termine de inicializar y verificar el estado del usuario
const verificarUsuario = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); // Resuelve si el usuario está autenticado
      } else {
        reject("Usuario no autenticado"); // Rechaza si no hay usuario autenticado
      }
      unsubscribe(); // Elimina el listener después de la verificación
    });
  });
};

// Llamamos a la función para verificar el estado de autenticación
verificarUsuario()
  .then((user) => {
    // Aquí sabemos que el usuario está autenticado
    console.log("Usuario autenticado:", user);

    // Verificamos que el tipo de usuario esté en localStorage
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (!tipoUsuario) {
      console.error("Tipo de usuario no encontrado en localStorage.");
      redirigirConAlerta("Tipo de usuario no definido. Redirigiendo al inicio.");
      return;
    }

    // Verificamos la página y redirigimos según el tipo de usuario
    const path = window.location.pathname;

    if (path.includes("horarios_docentes.html") && tipoUsuario !== "docente") {
      redirigirConAlerta("No tienes permiso para acceder como docente.");
    } else if (path.includes("horarios_participantes.html") && tipoUsuario !== "participante") {
      redirigirConAlerta("No tienes permiso para acceder como participante.");
    }

    // Si todo está bien, continuamos con la carga normal de la página
  })
  .catch((error) => {
    // Si Firebase no detecta un usuario autenticado, redirigimos al login
    console.error("Error de autenticación:", error);
    redirigirConAlerta("Debes iniciar sesión para acceder.");
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
