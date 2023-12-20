document.addEventListener("DOMContentLoaded", function () {
	var tipoONU = document.getElementById("tipo-onu");
	var loadedScript = null; // Variable para almacenar el script cargado actualmente
  
	function cargarScript() {
	  var tipoOnu = tipoONU.value;
  
	  // Si hay un script cargado, elimínalo
	  if (loadedScript !== null) {
		document.body.removeChild(loadedScript);
		loadedScript = null;
	  }
  
	  // Carga el archivo JavaScript correspondiente al tipo de ONU seleccionado.
	  if (tipoOnu !== "default") {
		// Carga el archivo common.js siempre
		cargarCommonScript();
  
		// Carga el archivo específico del tipo de ONU
		cargarModeloScript(tipoOnu);
	  }
	}
  
	function cargarCommonScript() {
	  // Verificar si el script ya está cargado
	  var commonScript = document.getElementById("common-script");
	  if (!commonScript) {
		commonScript = document.createElement("script");
		commonScript.id = "common-script";
		commonScript.src = "js/common.js";
		document.body.appendChild(commonScript);
	  }
	}
  
	function cargarModeloScript(tipoOnu) {
	  var modeloScript = document.createElement("script");
	  modeloScript.src = "js/" + tipoOnu + ".js";
	  document.body.appendChild(modeloScript);
	  loadedScript = modeloScript;
	}
  
	function ejecutarAccion(accion) {
	  // Ejecuta la función correspondiente al tipo de ONU seleccionado.
	  if (tipoONU.value !== "default") {
		// Utiliza el nombre de la función que proporcionaste.
		window[accion]();
	  }
	}
  
	// Asigna los manejadores de eventos
	if (tipoONU) {
	  tipoONU.addEventListener("change", cargarScript);
	}
  
	// Event listeners para botones
	var btnComandos = document.getElementById("btn-comandos");
	if (btnComandos) {
	  btnComandos.addEventListener("click", function () {
		ejecutarAccion("comandos");
	  });
	}
  
	var btnComandos = document.getElementById("btn-aprovisionamiento");
	if (btnComandos) {
	  btnComandos.addEventListener("click", function () {
		ejecutarAccion("aprovisionamiento");
	  });
	}
  
	var btnComandos = document.getElementById("btn-modificaciones");
	if (btnComandos) {
	  btnComandos.addEventListener("click", function () {
		ejecutarAccion("modificaciones");
	  });
	}
  
	// Otros event listeners...
  
	// Seleccionar automáticamente el archivo default.js al inicio
	tipoONU.value = "Seleccione";
	cargarScript();
  });
  