import { aprovisionamiento } from './ZTEG-F660.js';



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
  

  function ejecutarAprovisionamiento() {
    // Obtener el valor seleccionado del select
    var tipoONUSelect = document.getElementById("tipo-onu");
    var tipoONUValor = tipoONUSelect.options[tipoONUSelect.selectedIndex].value;

    // Verificar si el valor es "ZTEG-F660" y ejecutar aprovisionamiento() del archivo JavaScript correspondiente
    if (tipoONUValor === "ZTEG-F660") {
      aprovisionamiento();
    }
  }
  
  function modificaciones() {
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
	
	// Comando para Eliminar ONU Función: Visualizar
	const EliminarONUVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
no onu ${puertoLogico}<br>
exit<br>
exit<br>`;
  
	// Comando para Eliminar ONU Función: Copiar
	const EliminarONUCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
no onu ${puertoLogico}\n
exit\n
exit\n`;
  
	// Comando para Reiniciar ONU Función: Visualizar
	const ReiniciarONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
reboot<br>
yes<br>
exit<br>
exit<br>`;
  
	// Comando para Reiniciar ONU Función: Copiar
	const ReiniciarONUCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
reboot\n
yes\n
exit\n
exit\n`;

  	// Comando para Resetear de fábrica ONU Función: Visualizar
	const ResetearONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
restore factory<br>
exit<br>
exit<br>`;
  
  	// Comando para Resetear de fábrica ONU Función: Copiar
	const ResetearONUCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
restore factory\n
exit\n
exit\n`;

    	// Comando para desactivar el WiFi de la ONU Función: Visualizar
	const NoWiFiONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
wifi disable<br>
exit<br>
exit<br>`;
	
		// Comando para desactivar el WiFi de la ONU Función: Copiar
	  const NoWiFiONUCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
wifi disable\n
exit\n
exit\n`;
  
	// Comando para cambiar la VLAN (ONU con PPPoE) Función: Visualizar
	const CambiarVLANconPPPoEVisual = `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service ppp<br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
exit<br>`;
  
	// Comando para cambiar la VLAN (ONU con PPPoE) Función: Copiar
	const CambiarVLANconPPPoECopiar = `configure terminal\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service ppp\n
service ppp gemport 1 iphost 1 vlan ${vlan}\n
exit\n
exit\n`;
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Visualizar
	const CambiarVLANenBRIDGEVisual = `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service ppp<br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
exit<br>
exit<br>`;
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Copiar
	const CambiarVLANenBRIDGECopiar = `configure terminal\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${vlan} user-vlan ${vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service ppp\n
vlan port eth_0/1 mode tag vlan ${vlan}\n
vlan port eth_0/2 mode tag vlan ${vlan}\n
vlan port eth_0/3 mode tag vlan ${vlan}\n
vlan port eth_0/4 mode tag vlan ${vlan}\n
exit\n
exit\n`;
  
	// Comando para cambiar el PPPoE Función: Visualizar
	const CambiarPPPoEVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no pppoe<br>
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span> password <span class="variable-highlight">${pppoe}</span><br>
exit<br>
exit<br>`;
  
	// Comando para cambiar el PPPoE Función: Copiar
	const CambiarPPPoECopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no pppoe\n
pppoe 1 nat enable user ${cuenta}-${cliente}@${localidad}${esviejo} password ${pppoe}\n
exit\n
exit\n`;
 
	// Comando para cambiar la Telefonía Función: Visualizar
	const CambiarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no sip-service pots_0/1<br>
sip-service pots_0/1 profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono} password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono}</span></span><br>
exit<br>
exit<br>`;
  
	// Comando para cambiar la Telefonía Función: Copiar
	const CambiarTelefoniaCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no sip-service pots_0/1\n
sip-service pots_0/1 profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono}\n
exit\n
exit\n`;
  
	const comandosModificaciones = [
	  {
		descripcion: "Reiniciar ONU",
		comando: ReiniciarONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: ReiniciarONUCopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Resetear de fábrica ONU",
		comando: ResetearONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: ResetearONUCopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Cambiar PPPoE en ONU",
		comando: CambiarPPPoEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarPPPoECopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Cambiar Telefonía en ONU",
		comando: CambiarTelefoniaVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarTelefoniaCopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Cambiar VLAN (ONU en Bridge)",
		comando: CambiarVLANenBRIDGEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarVLANenBRIDGECopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Cambiar VLAN (ONU con PPPoE)",
		comando: CambiarVLANconPPPoEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarVLANconPPPoECopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Desactivar WiFi de la ONU",
		comando: NoWiFiONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: NoWiFiONUCopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Eliminar ONU",
		comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: EliminarONUCopiar, // Usamos el comando con \n para copiar
	  },
	  
	];
  
	mostrarComandos(comandosModificaciones);
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
  
  // Función para guardar los cambios utilizando la API de GitHub
  async function guardarCambios() {
	if (confirm("¿Estás seguro de que deseas guardar los cambios en GitHub?")) {
	if (confirm("Entiendo que estoy modificando información sensible")) {
		const contenido = document.getElementById("contenido-archivo").value;
		const url =
		  "https://api.github.com/repos/Peripotec/AprovisionamientoZTE/contents/vlans.txt";
		const token = "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"; // Token de autorización de GitHub
		const branch = "main"; // Nombre de la rama de GitHub
  
		try {
		  const response = await fetch(url, {
			method: "GET",
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		  });
  
		  const data = await response.json();
		  const sha = data.sha;
  
		  const body = {
			message: "Actualización del TXT",
			content: btoa(contenido),
			sha: sha,
			branch: branch,
		  };
  
		  const putResponse = await fetch(url, {
			method: "PUT",
			headers: {
			  Authorization: `Bearer ${token}`,
			  "Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		  });
		  const putData = await putResponse.json();
		  console.log("Cambios guardados en GitHub:", putData);
		  contenidoOriginal = contenido;
		document.getElementById("contenido-archivo").readOnly = true;
		  alert("Los cambios se guardaron exitosamente en GitHub.");
		} catch (error) {
		  console.error("Se ha producido un error al guardar en GitHub:", error);
		  alert(
			"Se ha producido un error al intentar guardar en GitHub. Consulta la consola para obtener más detalles.",
		  );
		}
	  } else {
		alert("No se han guardado los cambios.");
	  }
	} else {
	  alert("No se han guardado los cambios.");
	}
  }
  
