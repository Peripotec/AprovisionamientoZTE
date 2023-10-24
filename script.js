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
				<p style="flex: 1; text-align: left;">${cmd.descripcion}</p>
				<p style=" align-items: center;"><button class="comando btn-copy comando-texto" onclick="copiarComando(\`${cmd.copiarComando||cmd.comandos || cmd.comando}\`)">Copiar Comando</button></p>
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
	btns.forEach(btn => {
		btn.addEventListener('click', (event) => {
		event.preventDefault();
		});
	});
}

// Comandos FIJOS que no requieren modificación
	const comandosFijos = {
	descripcion: "Ver ONUs no provisionadas",
	comando: "show gpon onu uncfg"
	};


// Función para asignar característica y vlans de localidades
	function caracteristicaylocalidades() {
		let select = document.getElementById("localidad");
		let selectedOption = select.options[select.selectedIndex].value;
		let caracteristica;
		let vlan;
	
		switch (selectedOption) {
			case 'rafaela':
				caracteristica = "3492";
				vlan = "";
				break;
			case 'sunchales':
				caracteristica = "3493";
				vlan = "";
				break;
			case 'esperanza':
				caracteristica = "3496";
				vlan = "";
			case 'sanjorge':
				caracteristica = "3406"
				vlan = "";
			case 'susana':
				caracteristica = "";
				vlan = "147";
			case 'sancarlosnorte':
				caracteristica = "";
				vlan = "912";
			case 'santaclaradesaguier':
				caracteristica = "";
				vlan = "165";
			case 'sanjeronimonorte':
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
		const cuenta = document.getElementById('cuenta').value; // Obtener el valor del input cuenta
		const numeroCuenta = parseInt(cuenta);
		const longitud = cuenta.length;
		const longitudDeseada = 10;
	
		const cerosNecesarios = longitudDeseada - longitud - 3;
		const cerosInicio = '0'.repeat(cerosNecesarios);
		const cuentaFormateada = cerosInicio + cuenta + '0'.repeat(3);

		if ( cuentaFormateada == "0000000000") {
			const cuentaFormateada = "XXXXXXXXXX"
			return cuentaFormateada;
		}
		

	return cuentaFormateada;
	}
	
	// // Ejemplo de uso
	// document.getElementById('cuenta').addEventListener('change', function() {
	// 	const cuentaFormateada = formatearCuenta();
	// });
	


function comandos() {
  
	// Resto del código para obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || 'x'; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || 'x'; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || 'x'; // Agregar 'x' si está vacío
	const macInput = document.getElementById("mac").value;
	const mac = formatearDireccionMAC(macInput) || 'xxxx.xxxx.xxxx'; // Formatear la dirección MAC
	const numeroSerie = document.getElementById("no-serie").value || 'ZTEGCXXXXXXX'; // Agregar 'x' si está vacío
  
	// Función para formatear la dirección MAC
	function formatearDireccionMAC(mac) {
	  if (!mac || mac === 'xxxx.xxxx.xxxx') {
		return 'xxxx.xxxx.xxxx'; // Valor predeterminado si no se ingresa una MAC válida
	  }
  
	  // Eliminar los dos puntos y luego agrupar los caracteres
	  const macSinDosPuntos = mac.replace(/:/g, '');
	  const grupos = [];
	  for (let i = 0; i < macSinDosPuntos.length; i += 4) {
		grupos.push(macSinDosPuntos.slice(i, i + 4));
	  }
	  const macFormateada = grupos.join('.');
  
	  return macFormateada;
	}
  
	// Generar los nuevos comandos con sus descripciones
	const comandos = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Encontrar puerto lógico a partir del Nº de Serie (GPON SN)",
		comando: `show gpon onu by sn ${numeroSerie}`
	  },
	  {
		descripcion: "Encontrar puerto lógico a partir de la MAC",
		comando: `show mac ${mac}`
	  },
	  {
		descripcion: "Ver valores de la Fibra Óptica",
		comando: `show gpon remote-onu interface pon gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	  {
		descripcion: "Visualizar si está en PPPoE o Bridge",
		comando: `show onu running config gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	  {
		descripcion: "Visualizar las Ethernet de la ONU",
		comando: `show gpon remote-onu interface eth gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`
	  },
	  {
		descripcion: "Visualizar la configuración de la interfaz ONU",
		comando: `show running-config interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	  {
		descripcion: "Visualizar la información de la ONU",
		comando: `show gpon onu detail-info gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	  {
		descripcion: "Estados de ONUs",
		comando: `show gpon onu state gpon-olt_1/${placa}/${puerto}`
	  },
	  {
		descripcion: "Ver MACs aprendidas por el equipo",
		comando: `show mac gpon onu gpon-onu_1/${placa}/${puerto}:${puertoLogico}`
	  },
	];
  
	// // Construir la lista de descripciones y comandos con botones de copia
	// let descripcionYComandoText = "";
	// for (const cmd of comandos) {
	//   descripcionYComandoText += `
	// 	<div class="comando">
	// 	  <p>${cmd.descripcion}</p>
	// 	  <div>
	// 		<p class="comando-texto">${cmd.comando}</p>
	// 		<button class="comando btn-copy comando-texto" onclick="copiarComando('${cmd.comando}')">Copiar Comando</button>
	// 	  </div>
	// 	</div>
	//   `;
	// }
  
	// // Mostrar la lista de descripciones y comandos en el elemento HTML
	// const comandosContainer = document.getElementById("descripcion-y-comandos");
	// comandosContainer.innerHTML = descripcionYComandoText;
  
	// // Evitar el desplazamiento al principio de la página al copiar
	// const btns = document.querySelectorAll(".btn-copy");
	// btns.forEach(btn => {
	//   btn.addEventListener('click', (event) => {
	// 	event.preventDefault();
	//   });
	// });
	mostrarComandos(comandos);
}
  

  
function aprovisionamiento() {
    // Obtener los valores de los campos de entrada
    const placa = document.getElementById("placa").value || 'x'; // Agregar 'x' si está vacío
    const puerto = document.getElementById("puerto").value || 'x'; // Agregar 'x' si está vacío
    const puertoLogico = document.getElementById("puerto-logico").value || 'x'; // Agregar 'x' si está vacío
    const tipoONU = document.getElementById("tipo-onu").value || 'ZTEX-FXXX'; // Agregar 'ZTEX-FXXX' si está vacío
    const numeroSerie = document.getElementById("no-serie").value || 'ZTEGCXXXXXXX'; // Agregar 'ZTEGCXXXXXXX' si está vacío
	const {vlan} = caracteristicaylocalidades() // Asignar el valor VLAN
	const {caracteristica} = caracteristicaylocalidades() // Asignar el valor Caracterísitca
	const telefono = document.getElementById("telefono").value || 'XXXXXX'; // Agregar 'x' si está vacío
	const cuentaFormateada = formatearCuenta()
	const cuenta = document.getElementById("cuenta").value || 'cuenta'; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || 'cliente'; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || 'AAA000AA'; // Agregar 'AAA000AA' si está vacío
	const localidad = document.getElementById("localidad").value || 'Localidad'; // Agrega 'Localidad' si está vacío
	const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna ''



    // Comando para aprovisionar ONU con PPPoE Función: Visualizar
    const AprovisionarPPPoEVisual = `configure terminal<br>
<b>interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br></b>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile 1G<br>
tcont 2 name 2 profile 1G<br>
gemport 1 tcont 1<br>
gemport 2 tcont 2<br>
switchport mode hybrid vport 1<br>
switchport mode hybrid vport 2<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span>\n
service-port 2 vport 2 user-vlan 141 vlan 141<br>
dhcpv4-l2-relay-agent enable vport 2<br>
pppoe-intermediate-agent enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
service voip gemport 2 vlan 141<br>
voip protocol sip<br>
voip-ip mode dhcp vlan-profile vlan141 host 2<br>
weight tcont 1 queue 1 0<br>
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet<br>
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254<br>
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149<br>
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34<br><br>
ip-host 1 id ppp<br>
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span> password <span class="variable-highlight">${pppoe}</span><br>
ip-service-map 1 host 1<br><br>
exit<br>
exit<br>`;


    // Comando para aprovisionar ONU con PPPoE Función: copiar
	const AprovisionarPPPoECopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n
exit\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
sn-bind enable sn\n
tcont 1 name 1 profile 1G\n
tcont 2 name 2 profile 1G\n
gemport 1 tcont 1\n
gemport 2 tcont 2\n
switchport mode hybrid vport 1\n
switchport mode hybrid vport 2\n
service-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\n
service-port 2 vport 2 user-vlan 141 vlan 141\n
dhcpv4-l2-relay-agent enable vport 2\n
pppoe-intermediate-agent enable vport 1\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
service ppp gemport 1 iphost 1 vlan ${vlan}\n
service voip gemport 2 vlan 141\n
voip protocol sip\n
voip-ip mode dhcp vlan-profile vlan141 host 2\n
weight tcont 1 queue 1 0\n
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet\n
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254\n
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149\n
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34\n
ip-host 1 id ppp\n
pppoe 1 nat enable user ${cuenta}-${cliente}@${localidad}${esviejo} password ${pppoe}\n
ip-service-map 1 host 1\n
exit\n
exit\n`;

    // Comando para aprovisionar ONU en Bridge Función: Visualizar
    const AprovisionarBridgeVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile 1G<br>
tcont 2 name 2 profile 1G<br>
gemport 1 tcont 1<br>
gemport 2 tcont 2<br>
switchport mode hybrid vport 1<br>
switchport mode hybrid vport 2<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-vlan <span class="variable-highlight">${vlan}</span><br>
service-port 2 vport 2 user-vlan 141 vlan 141<br>
dhcpv4-l2-relay-agent enable vport 2<br>
pppoe-intermediate-agent enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet<br>
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254<br>
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149<br>
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34<br>
ip-service-map 1 host 1<br><br>
exit<br>
exit<br>`;


    // Comando para aprovisionar ONU en Bridge Función: copiar
	const AprovisionarBridgeCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n
exit\n
<b>interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n</b>
sn-bind enable sn\n
tcont 1 name 1 profile 1G\n
tcont 2 name 2 profile 1G\n
gemport 1 tcont 1\n
gemport 2 tcont 2\n
switchport mode hybrid vport 1\n
switchport mode hybrid vport 2\n
service-port 1 vport 1 user-vlan ${vlan} user-vlan ${vlan}\n
service-port 2 vport 2 user-vlan 141 vlan 141\n
dhcpv4-l2-relay-agent enable vport 2\n
pppoe-intermediate-agent enable vport 1\n
exit\n
<b>pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n</b>
service ppp gemport 1 iphost 1 vlan ${vlan}\n
vlan port eth_0/1 mode tag vlan ${vlan}\n
vlan port eth_0/2 mode tag vlan ${vlan}\n
vlan port eth_0/3 mode tag vlan ${vlan}\n
vlan port eth_0/4 mode tag vlan ${vlan}\n
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet\n
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254\n
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149\n
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34\n
ip-service-map 1 host 1\n
exit\n
exit\n`;

    // Comando para aprovisionar la Telefonía Función: Visualizar
    const AprovisionarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
sip-service pots_0/1 profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono} password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono}</span></span><br>
exit<br>
exit<br>`;

    // Comando para aprovisionar la Telefonía Función: Copiar
	const AprovisionarTelefoniaCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
sip-service pots_0/1 profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono}\n
exit\n
exit\n`;


    const comandosAprovisionamiento = [
		comandosFijos, // Comandos fijos que no se modifican y van al principio
		{
			descripcion: "Visualizar ONUs asignadas en una placa/puerto",
			comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`
		},
		{
            descripcion: "Aprovisionar Telefonía",
			comando: AprovisionarTelefoniaVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: AprovisionarTelefoniaCopiar // Usamos el copiarComando con \n para copiar
        },
        {
            descripcion: "Aprovisionar ONU con PPPoE",
            comando: AprovisionarPPPoEVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: AprovisionarPPPoECopiar // Usamos el copiarComando con \n para copiar
        },
        {
            descripcion: "Aprovisionar ONU en Bridge",
			comando: AprovisionarBridgeVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: AprovisionarBridgeCopiar // Usamos el copiarComando con \n para copiar
        },
        {
            descripcion: "Descripción 2 para Aprovisionamiento",
            copiarComando: "comando 2 para Aprovisionamiento"
        }
    ];

    mostrarComandos(comandosAprovisionamiento);
}


function modificaciones() {
    // Obtener los valores de los campos de entrada
    const placa = document.getElementById("placa").value || 'x'; // Agregar 'x' si está vacío
    const puerto = document.getElementById("puerto").value || 'x'; // Agregar 'x' si está vacío
    const puertoLogico = document.getElementById("puerto-logico").value || 'x'; // Agregar 'x' si está vacío
    const tipoONU = document.getElementById("tipo-onu").value || 'ZTEX-FXXX'; // Agregar 'ZTEX-FXXX' si está vacío
    const numeroSerie = document.getElementById("no-serie").value || 'ZTEGCXXXXXXX'; // Agregar 'ZTEGCXXXXXXX' si está vacío
	const {vlan} = caracteristicaylocalidades() // Asignar el valor VLAN
	const {caracteristica} = caracteristicaylocalidades() // Asignar el valor Caracterísitca
	const telefono = document.getElementById("telefono").value || 'XXXXXX'; // Agregar 'x' si está vacío
	const cuentaFormateada = formatearCuenta()
	const cuenta = document.getElementById("cuenta").value || 'cuenta'; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || 'cliente'; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || 'AAA000AA'; // Agregar 'AAA000AA' si está vacío
	const localidad = document.getElementById("localidad").value || 'Localidad'; // Agrega 'Localidad' si está vacío
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
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
reboot<br>
yes<br>
exit<br>
exit<br>`;


    // Comando para Reiniciar ONU Función: Copiar
	const ReiniciarONUCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}:${puertoLogico}\n
reboot\n
yes\n
exit\n
exit\n`;

	// Comando para cambiar la VLAN (ONU con PPPoE) Función: Visualizar
    const CambiarVLANconPPPoEVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service ppp<br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>`;


    // Comando para cambiar la VLAN (ONU con PPPoE) Función: Copiar
	const CambiarVLANconPPPoECopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}:${puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service ppp\n
service ppp gemport 1 iphost 1 vlan ${vlan}\n
exit\n`;

	// Comando para cambiar la VLAN (ONU en Bridge) Función: Visualizar
    const CambiarVLANenBRIDGEVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service ppp<br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
exit<br>`;


    // Comando para cambiar la VLAN (ONU en Bridge) Función: Copiar
	const CambiarVLANenBRIDGECopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}:${puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${vlan} user-vlan ${vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no service ppp\n
vlan port eth_0/1 mode tag vlan ${vlan}\n
vlan port eth_0/2 mode tag vlan ${vlan}\n
vlan port eth_0/3 mode tag vlan ${vlan}\n
vlan port eth_0/4 mode tag vlan ${vlan}\n
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
            copiarComando: ReiniciarONUCopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar PPPoE en ONU",
            comando: CambiarPPPoEVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: CambiarPPPoECopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar Telefonía en ONU",
            comando: CambiarTelefoniaVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: CambiarTelefoniaCopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar VLAN (ONU en Bridge)",
            comando: CambiarVLANenBRIDGEVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: CambiarVLANenBRIDGECopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar VLAN (ONU con PPPoE)",
            comando: CambiarVLANconPPPoEVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: CambiarVLANconPPPoECopiar // Usamos el comando con \n para copiar
        },
        {
            descripcion: "Eliminar ONU",
            comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: EliminarONUCopiar // Usamos el comando con \n para copiar
        }
    ];

    mostrarComandos(comandosModificaciones);
}

// Variable para almacenar el contenido original del archivo recuperado de GitHub
let contenidoOriginal = "";
// Comando para mostrar el bloc de notas de la carpeta raíz
const url = 'https://raw.githubusercontent.com/Peripotec/AprovisionamientoZTE/main/vlans.txt';
function mostrarContenido() {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const textarea = document.getElementById('contenido-archivo');
            contenidoOriginal = data;
            textarea.value = data;
            textarea.readOnly = true;
        })
        .catch(error => console.error('Se ha producido un error:', error));
}

// Función para habilitar la edición
function habilitarEdicion() {
    const textarea = document.getElementById('contenido-archivo');
    textarea.readOnly = false;
}

// Función para guardar los cambios utilizando la API de GitHub
async function guardarCambios() {
    if (confirm("¿Estás seguro de que deseas guardar los cambios en GitHub?")) {
        if (confirm("Entiendo que estoy modificando información sensible")) {
            const contenido = document.getElementById('contenido-archivo').value;
            const url = 'https://api.github.com/repos/Peripotec/AprovisionamientoZTE/contents/vlans.txt';
            const token = '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'; // Reemplaza con tu propio token de autorización de GitHub
            const branch = 'main'; // Reemplaza con el nombre de tu rama

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                const sha = data.sha;

                const body = {
                    message: 'Actualización del TXT',
                    content: btoa(contenido),
                    sha: sha,
                    branch: branch,
                };

                const putResponse = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                const putData = await putResponse.json();
                console.log('Cambios guardados en GitHub:', putData);
                contenidoOriginal = contenido;
                document.getElementById('contenido-archivo').readOnly = true;
                alert('Los cambios se guardaron exitosamente en GitHub.');
            } catch (error) {
                console.error('Se ha producido un error al guardar en GitHub:', error);
                alert('Se ha producido un error al intentar guardar en GitHub. Consulta la consola para obtener más detalles.');
            }
        }else {
            alert('No se han guardado los cambios.');
        }
    }else {
		alert('No se han guardado los cambios.');
	}
}
