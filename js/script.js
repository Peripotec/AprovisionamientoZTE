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
if (localidad === "Seleccione") {
	// Agrega todas las opciones
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F625", "ZTE 625", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTE-F609V5.2", "ZTE F609 v5.25", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Oggier", "ZTE-F601 Oggier", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Perino", "ZTE-F601 Perino", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.sanjeronimonorte", "ZTE-F601 San Jeronimo Norte", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.sanmartindelasescobas", "ZTE-F601 San Martin de las Escobas", tipoOnu);
  } else if (localidad === "rafaela") {
	// Agrega opciones para Rafaela
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
  } else if (localidad === "sunchales") {
	// Agrega opciones para Sunchales
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
  } else if (localidad === "humboldt") {
	// Agrega opciones para Humboldt
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
	agregarOption(tipoONU, "ZTE-F609V5.2", "ZTE F609 v5.25", tipoOnu);
  } else if (localidad === "esperanza") {
	// Agrega opciones para Esperanza
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
  } else if (localidad === "sancarlossur") {
	// Agrega opciones para San Carlos Sur
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
  } else if (localidad === "sancarloscentro") {
	// Agrega opciones para San Carlos Centro
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
  } else if (localidad === "sanjorge") {
	// Agrega opciones para San Jorge
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
	agregarOption(tipoONU, "ZXHN-F660", "ZXHN F660", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F668", "ZTEG F668", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660V8.0", "ZTE F660 v8.0", tipoOnu);
  } else if (localidad === "susana") {
	// Agrega opciones para Susana
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE-F601 Perino", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F660.Perino", "ZTEG-F660 Perino", tipoOnu);
  } else if (localidad === "sancarlosnorte") {
	// Agrega opciones para San Carlos Norte
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE F601", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F670.Oggier", "ZTEG-F670 Oggier", tipoOnu);
  } else if (localidad === "nuevotorino") {
	// Agrega opciones para Nuevo Torino
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE F601", tipoOnu);
  } else if (localidad === "sanjeronimonorte") {
	// Agrega opciones para San Jeronimo Norte
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE-F601 San Jeronimo Norte", tipoOnu);
	agregarOption(tipoONU, "ZTEG-F670.Oggier", "ZTEG-F670 Oggier", tipoOnu);
  }  else if (localidad === "santaclaradesaguier") {
	// Agrega opciones para Santa Clara de Saguier
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE F601", tipoOnu);
  } else if (localidad === "sanmartindelasescobas") {
	// Agrega opciones para San Martin de las Escobas
	agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
	agregarOption(tipoONU, "ZTE-F601.Socio", "ZTE-F601 San Martin de las Escobas", tipoOnu);
  } // Agrega más condiciones para otras localidades
  

	// Verifica si el valor de tipoOnu es diferente de "Seleccione" antes de cargar el script
	if (tipoOnu !== "Seleccione" && tipoOnu !== "default") {
		// Log para verificar la URL del script
		console.log("URL del script:", "js/" + tipoOnu + ".js");
	
		// Carga el archivo JavaScript correspondiente al tipo de ONU seleccionado.
		// Carga el archivo common.js siempre
		cargarCommonScript();
	
		// Carga el archivo específico del tipo de ONU
		cargarModeloScript(tipoOnu);
	  } else {
		// Si tipoOnu es "Seleccione" o "default", carga el script default.js
		cargarModeloScript("default");
	  }
	}

	// Seleccionar automáticamente el archivo default.js al inicio
	// tipoONU.value = "default";
	cargarScript();
  
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
		var modeloScript;
	  
		// Verifica si el valor de tipoOnu es diferente de "Seleccione" antes de cargar el script
		if (tipoOnu !== "Seleccione") {
		  // Log para verificar la URL del script
		  console.log("URL del script:", "js/" + tipoOnu + ".js");
	  
		  // Carga el archivo JavaScript correspondiente al tipo de ONU seleccionado.
		  // Carga el archivo common.js siempre
		  cargarCommonScript();
	  
		  // Carga el archivo específico del tipo de ONU
		  modeloScript = document.createElement("script");
		  modeloScript.src = "js/" + tipoOnu + ".js";
		  modeloScript.async = false; // Asegura que los scripts se carguen en orden
		  document.body.appendChild(modeloScript);
		  loadedScript = modeloScript;
	  
		  // Llama a cargarCommonScript después de cargar el script del modelo
		  modeloScript.onload = function () {
			cargarCommonScript();
		  };
		} else {
		  // Si tipoOnu es "Seleccione" o "default", carga el script default.js
		  modeloScript = document.createElement("script");
		  modeloScript.src = "js/default.js";
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
  
	// Seleccionar automáticamente el archivo default.js al inicio
	// tipoOnu.value = "default";
	// tipoONU.value = "default";
	// cargarScript();
  });
  

