// authCheck.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID"
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
