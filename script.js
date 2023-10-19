
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
            <div class="comando">
                <p>${cmd.descripcion}</p>
            </div>
			<button class="comando btn-copy comando-texto" onclick="copiarComando(\`${cmd.copiarComando||cmd.comandos || cmd.comando}\`)">Copiar Comando</button>
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

// Comando adicional "Ver ONUs no provisionadas"
const comandosFijos = {
	descripcion: "Ver ONUs no provisionadas",
	comando: "show gpon onu uncfg"
	};
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
	const vlan = document.getElementById("vlan").value || 'XXX'; // Agregar 'xxx' si está vacío
	const cuenta = document.getElementById("cuenta").value || 'CUENTA'; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || 'CLIENTE'; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || 'AAA000AA'; // Agregar 'AAA000AA' si está vacío

    // Comando para aprovisionar ONU con PPPoE Función: Visualizar
    const AprovisionarPPPoEVisual = `configure terminal<br>
interface gpon-olt_1/${placa}/${puerto}<br>
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}<br>
exit<br><br>
<b>interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br></b>
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
<b>pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br></b>
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
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@rafaela-wilnet</span> password <span class="variable-highlight">${pppoe}</span><br>
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
pppoe 1 nat enable user ${cuenta}-${cliente}@rafaela-wilnet password ${pppoe}\n
ip-service-map 1 host 1\n
exit\n
exit\n`;

    // Comando para aprovisionar ONU en Bridge Función: Visualizar
    const AprovisionarBridgeVisual = `configure terminal<br>
interface gpon-olt_1/${placa}/${puerto}<br>
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}<br>
exit<br><br>
<b>interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br></b>
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
<b>pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br></b>
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



    const comandosAprovisionamiento = [
		comandosFijos, // Comandos fijos que no se modifican y van al principio
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
	const vlan = document.getElementById("vlan").value || 'XXX'; // Agregar 'xxx' si está vacío
	const cuenta = document.getElementById("cuenta").value || 'CUENTA'; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || 'CLIENTE'; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || 'AAA000AA'; // Agregar 'AAA000AA' si está vacío
    
	// Comando para Eliminar ONU Función: Visualizar
    const EliminarONUVisual = `configure terminal<br>
interface gpon-olt_1/${placa}/${puerto}<br>
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
interface gpon-olt_1/${placa}/${puerto}:${puertoLogico}<br>
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
interface gpon-olt_1/${placa}/${puerto}:${puertoLogico}<br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br>
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


    const comandosAprovisionamiento = [
        {
            descripcion: "Reiniciar ONU",
            comando: ReiniciarONUVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: ReiniciarONUCopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar VLAN (ONU con PPPoE)",
            comando: CambiarVLANconPPPoEVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: CambiarVLANconPPPoECopiar // Usamos el comando con \n para copiar
        },
		{
            descripcion: "Cambiar VLAN (ONU en Bridge)",
            comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: EliminarONUCopiar // Usamos el comando con \n para copiar
        },
        {
            descripcion: "Eliminar ONU",
            comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
            copiarComando: EliminarONUCopiar // Usamos el comando con \n para copiar
        }
    ];

    mostrarComandos(comandosAprovisionamiento);
}

// Comando para mostrar el bloc de notas de la carpeta raíz
function mostrarContenido() {
    fetch('vlans.txt')
  .then(response => response.text())
  .then(data => {
    // Aquí puedes manejar los datos, por ejemplo, puedes insertar el texto en un elemento HTML.
    document.getElementById('contenido-archivo').innerText = data;
  })
  .catch(error => console.error('Se ha producido un error:', error));
  
}






