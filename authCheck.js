// authCheck.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAe3LW9dme23o1AGXqg4WkJ0",
  authDomain: "reservas-incuba.firebaseapp.com",
  projectId: "reservas-incuba",
  appId: "1:321837960358:web:65127a59a8aa4aae0d7867"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // Si no está logueado, redirigir
    window.location.href = "index.html";
  } else {
    const tipo = localStorage.getItem('tipoUsuario');

    const path = window.location.pathname;

    // Protege main_docente.html
    if (path.includes("main_docente.html") && tipo !== "docente") {
      window.location.href = "index.html";
    }

    // Protege main_participante.html
    if (path.includes("main_participante.html") && tipo !== "participante") {
      window.location.href = "index.html";
    }

    // Protege acceso.html (si no tiene tipo registrado)
    if (path.includes("acceso.html") && !tipo) {
      window.location.href = "index.html";
    }
  }
});
