import { modelos, organizacion, etiquetasEspeciales } from './ConfigZTE.js';

// Función para agregar opciones a un elemento select
function agregarOption(select, value, text, selectedValue) {
	var option = document.createElement("option");
	option.value = value;
	option.text = text;

	if (value === selectedValue) {
		option.selected = true;
	}

	select.add(option);
}

document.addEventListener("DOMContentLoaded", function () {
	var tipoONU = document.getElementById("tipo-onu");
	var localidadSelect = document.getElementById("localidad");
	var loadedScript = null;

	// Inicializar Select de Localidades desde Config
	// Limpiamos opciones harcodeadas (manteniendo optgroups si queremos, o generandolos)
	if (localidadSelect) {
		// Guardamos valor previo si existe (para recargas)
		const prevValue = localidadSelect.value;
		localidadSelect.innerHTML = ""; // Limpiar todo

		// Opción inicial
		agregarOption(localidadSelect, "Seleccione", "Seleccione");

		// Iterar sobre grupos (Wiltel, Socios)
		for (const [grupo, locs] of Object.entries(organizacion)) {
			const optgroup = document.createElement("optgroup");
			optgroup.label = grupo;

			// locs es un objeto  { "rafaela": [...], ... }
			for (const key of Object.keys(locs)) {
				// Capitalizar primera letra para el texto (simple)
				const text = key.charAt(0).toUpperCase() + key.slice(1);
				// Crear opción
				const option = document.createElement("option");
				option.value = key;
				option.text = text; // Podríamos tener un mapa de textos bonitos si quisieramos
				if (key === "humbertoprimo") option.text = "Humberto"; // Excepción manual o configurada
				if (key === "sancarloscentro") option.text = "San Carlos Centro";
				if (key === "sancarlossud") option.text = "San Carlos Sur";
				if (key === "sancarlosnorte") option.text = "San Carlos Norte";
				if (key === "sanjeronimonorte") option.text = "San Jerónimo Norte";
				if (key === "santaclaradesaguier") option.text = "Santa Clara de Saguier";
				if (key === "bellaitalia") option.text = "Bella Italia";
				if (key === "sanjorge") option.text = "San Jorge";
				if (key === "sastre") option.text = "Sastre";

				optgroup.appendChild(option);
			}
			localidadSelect.appendChild(optgroup);
		}

		// Restaurar selección si es válida, o default
		if (prevValue && prevValue !== "Seleccione") {
			localidadSelect.value = prevValue;
		}
	}

	function cargarScript() {
		var tipoOnu = tipoONU.value;
		var localidad = localidadSelect.value;

		console.log("Tipo de ONU seleccionado:", tipoOnu);

		if (loadedScript !== null) {
			document.body.removeChild(loadedScript);
			loadedScript = null;
		}

		// Limpiar select
		tipoONU.innerHTML = "";

		// Lógica dinámica para poblar modelos
		let listaModelos = [];

		// Buscar la localidad en cualquier grupo
		let encontrada = false;
		for (const grupoValues of Object.values(organizacion)) {
			if (grupoValues[localidad]) {
				listaModelos = grupoValues[localidad];
				encontrada = true;
				break;
			}
		}

		if (encontrada) {
			listaModelos.forEach(modeloKey => {
				let nombreVisible = modelos[modeloKey];

				// Verificar si hay overrides de etiquetas para esta localidad
				if (etiquetasEspeciales[localidad] && etiquetasEspeciales[localidad][modeloKey]) {
					nombreVisible = etiquetasEspeciales[localidad][modeloKey];
				}

				agregarOption(tipoONU, modeloKey, nombreVisible || modeloKey, tipoOnu);
			});
		} else {
			// Fallback o "Seleccione"
			agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
		}

		// Carga de scripts (Lógica intocada, solo simplificada)
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


