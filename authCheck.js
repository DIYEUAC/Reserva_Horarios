import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAe3LW9dme23o1AGXqg4WkJ0-hrqRxx8h4",
  authDomain: "reservas-incuba.firebaseapp.com",
  projectId: "reservas-incuba",
  storageBucket: "reservas-incuba.appspot.com",
  messagingSenderId: "321837960358",
  appId: "1:321837960358:web:65127a59a8aa4aae0d7867",
  measurementId: "G-ERQ0CQWYWG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function redirigirConAlerta(mensaje) {
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
}

// Este código espera a que Firebase determine el usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const path = window.location.pathname;

    // Esperamos un poco por seguridad (500 ms)
    setTimeout(() => {
      console.log('Autenticado como:', user.email);
      console.log('Tipo de usuario:', tipoUsuario);

      if (path.includes("horarios_docentes.html") && tipoUsuario !== "docente") {
        redirigirConAlerta("No tienes permiso para acceder como docente.");
      } else if (path.includes("horarios_participantes.html") && tipoUsuario !== "participante") {
        redirigirConAlerta("No tienes permiso para acceder como participante.");
      }
    }, 500); // medio segundo
  } else {
    console.warn("Usuario no autenticado");
    redirigirConAlerta("Debes iniciar sesión para acceder.");
  }
});
