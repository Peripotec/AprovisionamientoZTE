// Función para agregar opciones a un elemento select
function agregarOption(select, value, text, selectedValue) {
	var option = document.createElement("option");
	option.value = value;
	option.text = text;
  
	// Verifica si el valor actual es igual al valor seleccionado
	if (value === selectedValue) {
	  // Establece este elemento como seleccionado
	  option.selected = true;
	}
  
	select.add(option);
  }
  
document.addEventListener("DOMContentLoaded", function () {
	var tipoONU = document.getElementById("tipo-onu");
	var localidadSelect = document.getElementById("localidad");
	var loadedScript = null;
  
	function cargarScript() {
	  var tipoOnu = tipoONU.value;
	  var localidad = localidadSelect.value;
  
	  // Log para verificar el valor de tipoOnu
	  console.log("Tipo de ONU seleccionado:", tipoOnu);
  
	  // Si hay un script cargado, elimínalo
	  if (loadedScript !== null) {
		document.body.removeChild(loadedScript);
		loadedScript = null;
	  }
  
	  // Limpia el select de tipo de ONU
	  tipoONU.innerHTML = "";
  
	  // Agrega las opciones de tipo de ONU según la localidad seleccionada
if (localidad === "rafaela") {
	// Agrega todas las opciones
	agregarOption(tipoONU, "defaultZhone", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "zhone-2301", "2301", tipoOnu);
	agregarOption(tipoONU, "zhone-2424A", "2424A", tipoOnu);
	agregarOption(tipoONU, "zhone-2426", "2426A1", tipoOnu);
	agregarOption(tipoONU, "DM984-100B", "Datacom", tipoOnu);
  } 
  

	// Verifica si el valor de tipoOnu es diferente de "Seleccione" antes de cargar el script
	if (tipoOnu !== "Seleccione" && tipoOnu !== "defaultZhone") {
		// Log para verificar la URL del script
		console.log("URL del script:", "zhone/" + tipoOnu + ".js");
	
		// Carga el archivo JavaScript correspondiente al tipo de ONU seleccionado.
		// Carga el archivo commonZonhe.js siempre
		cargarCommonScript();
	
		// Carga el archivo específico del tipo de ONU
		cargarModeloScript(tipoOnu);
	  } else {
		// Si tipoOnu es "Seleccione" o "defaultZhone", carga el script defaultZhone.js
		cargarModeloScript("defaultZhone");
	  }
	}

	// Seleccionar automáticamente el archivo defaultZhone.js al inicio
	// tipoONU.value = "defaultZhone";
	cargarScript();
  
	function cargarCommonScript() {
	  // Verificar si el script ya está cargado
	  var commonScript = document.getElementById("common-script");
	  if (!commonScript) {
		commonScript = document.createElement("script");
		commonScript.id = "common-script";
		commonScript.src = "zhone/commonZhone.js";
		document.body.appendChild(commonScript);
	  }
	}
  

	function cargarModeloScript(tipoOnu) {
		var modeloScript;
	  
		// Verifica si el valor de tipoOnu es diferente de "Seleccione" antes de cargar el script
		if (tipoOnu !== "Seleccione") {
		  // Log para verificar la URL del script
		  console.log("URL del script:", "zhone/" + tipoOnu + ".js");
	  
		  // Carga el archivo JavaScript correspondiente al tipo de ONU seleccionado.
		  // Carga el archivo commonZonhe.js siempre
		  cargarCommonScript();
	  
		  // Carga el archivo específico del tipo de ONU
		  modeloScript = document.createElement("script");
		  modeloScript.src = "zhone/" + tipoOnu + ".js";
		  modeloScript.async = false; // Asegura que los scripts se carguen en orden
		  document.body.appendChild(modeloScript);
		  loadedScript = modeloScript;
	  
		  // Llama a cargarCommonScript después de cargar el script del modelo
		  modeloScript.onload = function () {
			cargarCommonScript();
		  };
		} else {
		  // Si tipoOnu es "Seleccione" o "defaultZhone", carga el script defaultZhone.js
		  modeloScript = document.createElement("script");
		  modeloScript.src = "zhone/defaultZhone.js";
		  modeloScript.async = false; // Asegura que los scripts se carguen en orden
		  document.body.appendChild(modeloScript);
		  loadedScript = modeloScript;
	  
		  // Llama a cargarCommonScript después de cargar el script del modelo
		  modeloScript.onload = function () {
			cargarCommonScript();
		  };
		}
	  }
	

  
	function ejecutarAccion(accion) {
	  // Ejecuta la función correspondiente al tipo de ONU seleccionado.
	  if (tipoONU.value !== "Seleccione") {
		// Utiliza el nombre de la función que proporcionaste.
		window[accion]();
	  }
	}
  
	// Asigna los manejadores de eventos
	if (tipoONU) {
	  tipoONU.addEventListener("input", cargarScript);
	}
  
	if (localidadSelect) {
	  localidadSelect.addEventListener("input", cargarScript);
	}
  
	// Event listeners para botones
	var btnComandos = document.getElementById("btn-comandos");
	if (btnComandos) {
	  btnComandos.addEventListener("click", function () {
		ejecutarAccion("comandos");
	  });
	}
  
	var btnAprovisionamiento = document.getElementById("btn-aprovisionamiento");
	if (btnAprovisionamiento) {
	  btnAprovisionamiento.addEventListener("click", function () {
		ejecutarAccion("aprovisionamiento");
	  });
	}
  
	var btnModificaciones = document.getElementById("btn-modificaciones");
	if (btnModificaciones) {
	  btnModificaciones.addEventListener("click", function () {
		ejecutarAccion("modificaciones");
	  });
	}
  
	// Otros event listeners...
  
	// Seleccionar automáticamente el archivo defaultZhone.js al inicio
	// tipoOnu.value = "defaultZhone";
	// tipoONU.value = "defaultZhone";
	// cargarScript();
  });
  

