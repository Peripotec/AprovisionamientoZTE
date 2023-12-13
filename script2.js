// Importar las constantes del archivo ZTEG-F660.js
import {
	AprovisionarPPPoEVisual,
	AprovisionarPPPoECopiar,
	AprovisionarBridgeVisual,
	AprovisionarBridgeCopiar,
	AprovisionarSoloTelefonoiaVisual,
	AprovisionarSoloTelefonoiaCopiar,
	AprovisionarenTrunkVisual,
	AprovisionarenTrunkCopiar,
	AprovisionarTelefoniaVisual,
	AprovisionarTelefoniaCopiar,
	} from './js/ZTEG-F660.js';

//Función que permite copiar los comandos modificados.
function copiarComando(comando) {
	const tempTextArea = document.createElement("textarea");
	tempTextArea.value = comando;
	document.body.appendChild(tempTextArea);
	tempTextArea.select();
	document.execCommand("copy");
	document.body.removeChild(tempTextArea);
  
	// Mostrar el mensaje de copiado en el centro inferior
	const mensajeCopiado = document.createElement("div");
	mensajeCopiado.className = "copiado-mensaje";
	mensajeCopiado.textContent = "Comando copiado";
	document.body.appendChild(mensajeCopiado);
  
	// Difuminar el mensaje gradualmente
	setTimeout(() => {
	  let opacity = 1;
	  const fadeOutInterval = setInterval(() => {
		if (opacity <= 0) {
		  clearInterval(fadeOutInterval);
		  mensajeCopiado.remove(); // Eliminar el mensaje después de la animación de desvanecimiento
		} else {
		  opacity -= 0.1;
		  mensajeCopiado.style.opacity = opacity;
		}
	  }, 100); // Difuminar gradualmente durante 1 segundo
	}, 500); // Mostrar el mensaje durante 0.5 segundo
  }
  
  // Función para mostrar los comandos en la página.
  function mostrarComandos(comandos) {
	let descripcionYComandoText = "";
	for (const cmd of comandos) {
	descripcionYComandoText += `
		<div class="descripcion-container"> <!-- Aquí agregamos el contenedor -->
		<div class="comando" style="display: flex; align-items: center; justify-content: space-between;"> <!-- Estilos para alinear y justificar el contenido -->
				<p style=" align-items: center;"><button class="comando btn-copy comando-texto" onclick="copiarComando(\`${
			cmd.copiarComando || cmd.comandos || cmd.comando
		  }\`)">Copiar Comando</button></p>
				<p style="flex: 1; text-align: left;">${cmd.descripcion}</p>
			</div>
			<div class="comando">
				<p class="comando-texto">${cmd.comando || cmd.copiarComando}</p>
			</div>
		</div>
		  `;
	}
  
	const comandosContainer = document.getElementById("descripcion-y-comandos");
	comandosContainer.innerHTML = descripcionYComandoText;
  
	// Evitar el desplazamiento al principio de la página al copiar
	const btns = document.querySelectorAll(".btn-copy");
	btns.forEach((btn) => {
	  btn.addEventListener("click", (event) => {
		event.preventDefault();
	  });
	});
  }
  
// Comandos FIJOS que no requieren modificación
const comandosFijos = {
	descripcion: "Ver ONUs no provisionadas",
	comando: "show gpon onu uncfg"
	};
  
  // Función para obtener las VLANS para aprovisionar en Trunk
  function separarVLANs(vlanInput) {
	let vlans;
	if (vlanInput && vlanInput.includes(",")) {
	vlans = vlanInput.split(",");
	} else {
	vlans = [vlanInput];
	}
	const vlan1 = vlans[0] ? `${vlans[0]}` : "XXX";
	const vlan2 = vlans[1] ? `${vlans[1]}` : "XXX";
	const vlan3 = vlans[2] ? `${vlans[2]}` : "XXX";
	const vlan4 = vlans[3] ? `${vlans[3]}` : "XXX";
	return { vlan1, vlan2, vlan3, vlan4 };
  }
  
  // Función para asignar característica y vlans de localidades
  function caracteristicaylocalidades() {
	let select = document.getElementById("localidad");
	let selectedOption = select.options[select.selectedIndex].value;
	let caracteristica;
	let vlan;
  
	switch (selectedOption) {
	  case "rafaela":
		caracteristica = "3492";
		vlan = "";
		break;
	  case "sunchales":
		caracteristica = "3493";
		vlan = "";
		break;
	  case "esperanza":
		caracteristica = "3496";
		vlan = "";
	  case "sanjorge":
		caracteristica = "3406";
		vlan = "";
	  case "susana":
		caracteristica = "";
		vlan = "147";
	  case "sancarlosnorte":
		caracteristica = "";
		vlan = "912";
	  case "santaclaradesaguier":
		caracteristica = "";
		vlan = "165";
	  case "sanjeronimonorte":
		caracteristica = "";
		vlan = "911";
		break;
	  // Añade casos para otras localidades si es necesario
	default:
		caracteristica = "0000";
		vlan = "XXX";
	}
  
	const inputVLAN = document.getElementById("vlan").value;
  
	if (inputVLAN != "") {
	vlan = inputVLAN;
	}
	if (vlan == "") {
	vlan = "XXX";
	}
	if (caracteristica == "") {
	  caracteristica = "XXXX";
	}
	return { caracteristica, vlan };
  }
  
  // Función para formatear la cuenta (para levantar telefonía)
  function formatearCuenta() {
	const cuenta = document.getElementById("cuenta").value; // Obtener el valor del input cuenta
	const numeroCuenta = parseInt(cuenta);
	const longitud = cuenta.length;
	const longitudDeseada = 10;
  
	const cerosNecesarios = longitudDeseada - longitud - 3;
	const cerosInicio = "0".repeat(cerosNecesarios);
	const cuentaFormateada = cerosInicio + cuenta + "0".repeat(3);
  
	if (cuentaFormateada == "0000000000") {
	  const cuentaFormateada = "XXXXXXXXXX";
	return cuentaFormateada;
	}
  
	return cuentaFormateada;
  }
  
  function comandos() {
	// Resto del código para obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
	const macInput = document.getElementById("mac").value;
	const mac = formatearDireccionMAC(macInput) || "xxxx.xxxx.xxxx"; // Formatear la dirección MAC
	const numeroSerie =
	document.getElementById("no-serie").value || "ZTEGCXXXXXXX"; // Agregar 'x' si está vacío
  
	// Función para formatear la dirección MAC
	function formatearDireccionMAC(mac) {
	if (!mac || mac === "xxxx.xxxx.xxxx") {
		return "xxxx.xxxx.xxxx"; // Valor predeterminado si no se ingresa una MAC válida
	  }
  
	  // Eliminar los dos puntos y luego agrupar los caracteres
	  const macSinDosPuntos = mac.replace(/:/g, "");
	  const grupos = [];
	  for (let i = 0; i < macSinDosPuntos.length; i += 4) {
		grupos.push(macSinDosPuntos.slice(i, i + 4));
	  }
	  const macFormateada = grupos.join(".");
  
	return macFormateada;
	}
  
	// Generar los nuevos comandos con sus descripciones
	const comandos = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Encontrar puerto lógico a partir del Nº de Serie (GPON SN)",
		comando: `show gpon onu by sn ${numeroSerie}`,
	  },
	  {
		descripcion: "Encontrar puerto lógico a partir de la MAC",
		comando: `show mac ${mac}`,
	  },
	  {
		descripcion: "Ver valores de la Fibra Óptica",
		comando: `show gpon remote-onu interface pon gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar si está en PPPoE o Bridge",
		comando: `show onu running config gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar las Ethernet de la ONU",
		comando: `show gpon remote-onu interface eth gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`,
	  },
	  {
		descripcion: "Visualizar la configuración de la interfaz ONU",
		comando: `show running-config interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar la información de la ONU",
		comando: `show gpon onu detail-info gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	  {
		descripcion: "Estados de ONUs",
		comando: `show gpon onu state gpon-olt_1/${placa}/${puerto}`,
	  },
	  {
		descripcion: "Ver MACs aprendidas por el equipo",
		comando: `show mac gpon onu gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
	  },
	];
  
	mostrarComandos(comandos);
  }
  
  function aprovisionamiento() {
		// Obtener los valores de los campos de entrada
		const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
		const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
		const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
		const tipoONU = document.getElementById("tipo-onu").value || "ZTEX-FXXX"; // Agregar 'ZTEX-FXXX' si está vacío
		const numeroSerie =
		document.getElementById("no-serie").value || "ZTEGCXXXXXXX"; // Agregar 'ZTEGCXXXXXXX' si está vacío
		const { vlan } = caracteristicaylocalidades(); // Asignar el valor VLAN
		const { caracteristica } = caracteristicaylocalidades(); // Asignar el valor Caracterísitca
		const telefono = document.getElementById("telefono").value || "XXXXXX"; // Agregar 'x' si está vacío
		const cuentaFormateada = formatearCuenta();
		const cuenta = document.getElementById("cuenta").value || "cuenta"; // Agregar 'CUENTA' si está vacío
		const cliente = document.getElementById("cliente").value || "cliente"; // Agregar 'CLIENTE' si está vacío
		const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA"; // Agregar 'AAA000AA' si está vacío
		const localidad = document.getElementById("localidad").value || "Localidad"; // Agrega 'Localidad' si está vacío
		const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
		const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna ''
		const vlanInput = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
		const { vlan1, vlan2, vlan3, vlan4 } = separarVLANs(vlanInput); // Guardo los valores individuales para asignar vlans trunkeables en cada puerto.
	
		// ... (resto de tu función)
	  
		// Utilizar las constantes según el valor del select Tipo de ONU
		switch (tipoONU) {
		  case "ZTEG-F660":
			// Utilizar las constantes de ZTEG-F660
			mostrarComandos([
			  comandosFijos,
			  // ... (otros comandos)
			  {
				descripcion: "Aprovisionar ONU con PPPoE",
				comando: AprovisionarPPPoEVisual,
				copiarComando: AprovisionarPPPoECopiar,
			  },
			  // ... (otros comandos)
			]);
			break;
	  
		  // Agregar otros casos según sea necesario
	  
		  default:
			// Tipo de ONU no reconocido
			alert("Tipo de ONU no reconocido");
			break;
		}
	  }
  
  // Variable para almacenar el contenido original del archivo recuperado de GitHub
  let contenidoOriginal = "";
  // Comando para mostrar el bloc de notas de la carpeta raíz
  const url =
	"https://raw.githubusercontent.com/Peripotec/AprovisionamientoZTE/main/vlans.txt";
  function mostrarContenido() {
	fetch(url)
	  .then((response) => response.text())
	  .then((data) => {
		const textarea = document.getElementById("contenido-archivo");
		contenidoOriginal = data;
		textarea.value = data;
		textarea.readOnly = true;
	  })
	  .catch((error) => console.error("Se ha producido un error:", error));
  }
  
  // Función para habilitar la edición
  function habilitarEdicion() {
	const textarea = document.getElementById("contenido-archivo");
	textarea.readOnly = false;
  }