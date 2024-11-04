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
		  descripcion: "Ver valores de la Fibra Óptica (Datos)",
		  comando: `show gpon remote-onu interface pon gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
		},
		{
		  descripcion: "Visualizar si está en PPPoE o Bridge",
		  comando: `show onu running config gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
		},
		{
		  descripcion: "Visualizar la configuración de la interfaz ONU",
		  comando: `show running-config interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
		},
		{
		  descripcion: "Visualizar las Ethernet de la ONU",
		  comando: `show gpon remote-onu interface eth gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
		},
		{
		  descripcion: "Ver estado de la Telefonía",
		  comando: `show gpon remote-onu interface pots gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
		},
		{
		  descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		  comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`,
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
		{
		  descripcion: "Ver valores de la Fibra Óptica del puerto (Usar con Cuidado)",
		  comando: `show pon power onu-rx gpon-olt_1/${placa}/${puerto}`,
		},
		{
		  descripcion: "Visualizar el Digital Map (Telefonía) ",
		  comando: `show gpon onu profile dial-plan`,
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
	const numeroSerie =	document.getElementById("no-serie").value || "ZTEGCXXXXXXX"; // Agregar 'ZTEGCXXXXXXX' si está vacío
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
	const pots = document.getElementById("pots"); // Comprueba si el checkbox está marcado
	const numpots = pots.checked ? "2" : "1"; // Le asigna por defecto el valor a pots 1, si es true le asigna '2'
	const TV = document.getElementById("tv"); // Comprueba si el checkbox está marcado
	const tv = TV.checked ? "un" : ""; // Le asigna por defecto el valor "", si es true le asigna 'un' para que complete el comando de unlock
	const vlanInput = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const { vlan1, vlan2, vlan3, vlan4 } = separarVLANs(vlanInput); // Guardo los valores individuales para asignar vlans trunkeables en cada puerto.
	
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
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
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
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> vlan <span class="variable-highlight">${vlan}</span><br>
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
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
sn-bind enable sn\n
tcont 1 name 1 profile 1G\n
tcont 2 name 2 profile 1G\n
gemport 1 tcont 1\n
gemport 2 tcont 2\n
switchport mode hybrid vport 1\n
switchport mode hybrid vport 2\n
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\n
service-port 2 vport 2 user-vlan 141 vlan 141\n
dhcpv4-l2-relay-agent enable vport 2\n
pppoe-intermediate-agent enable vport 1\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
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

	// Comando para aprovisionar ONU con SÓLO TELEFONÍA Función: Visualizar
	const AprovisionarSoloTelefonoiaVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 2 name 2 profile 1G<br>
gemport 2 tcont 2<br>
switchport mode hybrid vport 2<br>
service-port 2 vport 2 user-vlan 141 vlan 141<br>
dhcpv4-l2-relay-agent enable vport 2<br>
pppoe-intermediate-agent enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service voip gemport 2 vlan 141<br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet<br>
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254<br>
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149<br>
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34<br>
ip-service-map 1 host 1<br><br>
exit<br>
exit<br>`;
  
	// Comando para aprovisionar ONU con SÓLO TELEFONÍA Función: copiar
	const AprovisionarSoloTelefonoiaCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n
exit\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
sn-bind enable sn\n
tcont 2 name 2 profile 1G\n
gemport 2 tcont 2\n
switchport mode hybrid vport 2\n
service-port 2 vport 2 user-vlan 141 vlan 141\n
dhcpv4-l2-relay-agent enable vport 2\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
service voip gemport 2 vlan 141\n
sip-service pots_0/${numpots} profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\n
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet\n
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254\n
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149\n
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34\n
ip-service-map 1 host 1\n
exit\n
exit\n`;


  
	// Comando para aprovisionar ONU en Trunk Función: Visualizar
	const AprovisionarenTrunkVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}<br></b>
tcont 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode trunk vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan1}</span> transparent<br>
service-port 2 vport 1 user-vlan <span class="variable-highlight">${vlan2}</span> transparent<br>
service-port 3 vport 1 user-vlan <span class="variable-highlight">${vlan3}</span> transparent<br>
service-port 4 vport 1 user-vlan <span class="variable-highlight">${vlan4}</span> transparent<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}</b><br>
service tag gemport 1 ethuni eth_0/1 vlan <span class="variable-highlight">${vlanInput}</span><br><br>
exit<br>
exit<br>`;
  
	// Comando para aprovisionar ONU en Trunk Función: copiar
	const AprovisionarenTrunkCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n
exit\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
tcont 1 profile 1G\n
gemport 1 tcont 1\n
switchport mode trunk vport 1\n
service-port 1 vport 1 user-vlan ${vlan1} transparent\n
service-port 2 vport 1 user-vlan ${vlan2} transparent\n
service-port 3 vport 1 user-vlan ${vlan3} transparent\n
service-port 4 vport 1 user-vlan ${vlan4} transparent\n
exit\n\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
service tag gemport 1 ethuni eth_0/1 vlan ${vlanInput}\n
exit\n
exit\n`;
  
	// Comando para aprovisionar la Telefonía Función: Visualizar
	const AprovisionarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`;
  
	// Comando para aprovisionar la Telefonía Función: Copiar
	const AprovisionarTelefoniaCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
sip-service pots_0/${numpots} profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\n
exit\n
exit\n`;
  
	const comandosAprovisionamiento = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`,
	  },
	  {
		descripcion: "Aprovisionar Telefonía",
		comando: AprovisionarTelefoniaVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: AprovisionarTelefoniaCopiar, // Usamos el copiarComando con \n para copiar
	  },
	  {
		descripcion: "Aprovisionar ONU con PPPoE",
		comando: AprovisionarPPPoEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: AprovisionarPPPoECopiar, // Usamos el copiarComando con \n para copiar
	  },
	  {
		descripcion: "Aprovisionar ONU en Bridge",
		comando: AprovisionarBridgeVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: AprovisionarBridgeCopiar, // Usamos el copiarComando con \n para copiar
	  },
	  {
		descripcion: "Aprovisionar ONU con SÓLO TELEFONÍA",
		comando: AprovisionarSoloTelefonoiaVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: AprovisionarSoloTelefonoiaCopiar, // Usamos el copiarComando con \n para copiar
	  },
	  {
		descripcion: "Aprovisionar ONU en Trunk",
		comando: AprovisionarenTrunkVisual,
		copiarComando: AprovisionarenTrunkCopiar,
	  },
	];
  
	mostrarComandos(comandosAprovisionamiento);
  }
  
  function modificaciones() {
	// Obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
	const tipoONU = document.getElementById("tipo-onu").value || "ZTEX-FXXX"; // Agregar 'ZTEX-FXXX' si está vacío
	const numeroSerie =	document.getElementById("no-serie").value || "ZTEGCXXXXXXX"; // Agregar 'ZTEGCXXXXXXX' si está vacío
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
	const pots = document.getElementById("pots"); // Comprueba si el checkbox está marcado
	const numpots = pots.checked ? "2" : "1"; // Le asigna por defecto el valor a pots 1, si es true le asigna '2'
	const TV = document.getElementById("tv"); // Comprueba si el checkbox está marcado
	const tv = TV.checked ? "un" : ""; // Le asigna por defecto el valor "", si es true le asigna 'un' para que complete el comando de unlock
  
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
reboot
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
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
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
service ppp gemport 1 iphost 1 vlan ${vlan}\n
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
no sip-service pots_0/<span class="variable-highlight">${numpots}</span><br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`;
  
	// Comando para cambiar la Telefonía Función: Copiar
	const CambiarTelefoniaCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
no sip-service pots_0/${numpots}\n
sip-service pots_0/${numpots} profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\n
exit\n
exit\n`;

 	//Comando para Activar/Desactivar TV Función: Visualizar
	const DesactivarRFVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
interface video video_0/1 state <span class="variable-highlight">${tv}lock</span><br>
exit<br>`;
	   
	// Comando para Activar/Desactivar TV Función: Copiar
	const DesactivarRFCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
interface video video_0/1 state ${tv}lock\n
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
		descripcion: "Activar/Desactivar TV",
		comando: DesactivarRFVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: DesactivarRFCopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Desactivar WiFi de la ONU (No funciona en todos los modelos)",
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