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

// Función para verificar el rol del usuario desde localStorage antes de hacer la autenticación
const obtenerRolUsuario = () => {
  return new Promise((resolve, reject) => {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (tipoUsuario) {
      resolve(tipoUsuario);
    } else {
      reject("Tipo de usuario no encontrado.");
    }
  });
};

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

// Primero obtenemos el rol del usuario desde localStorage
obtenerRolUsuario()
  .then((tipoUsuario) => {
    // Luego verificamos si el usuario está autenticado
    verificarUsuario()
      .then((user) => {
        console.log("Usuario autenticado:", user);

        const path = window.location.pathname;

        // Retrasamos la verificación de permisos para dar tiempo a la carga
        setTimeout(() => {
          if (path.includes("horarios_docentes.html") && tipoUsuario !== "docente") {
            redirigirConAlerta("No tienes permiso para acceder como docente.");
          } else if (path.includes("horarios_participantes.html") && tipoUsuario !== "participante") {
            redirigirConAlerta("No tienes permiso para acceder como participante.");
          }
        }, 3000); // Esperamos 3 segundos antes de redirigir

      })
      .catch((error) => {
        console.error("Error de autenticación:", error);
        redirigirConAlerta("Debes iniciar sesión para acceder.");
      });
  })
  .catch((error) => {
    console.error("Error al obtener rol:", error);
    redirigirConAlerta("Tipo de usuario no definido. Redirigiendo al inicio.");
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
