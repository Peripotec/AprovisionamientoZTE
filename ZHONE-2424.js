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

export function ZHONE_2424() {
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
interface gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
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
pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
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
interface gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
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
pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
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
  
	// Comando para aprovisionar ONU en Trunk Función: Visualizar
	const AprovisionarenTrunkVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/${placa}/${puerto}/${puertoLogico}<br></b>
no service ppp<br>
tcont 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode trunk vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan1}</span> transparent<br>
service-port 2 vport 1 user-vlan <span class="variable-highlight">${vlan2}</span> transparent<br>
service-port 3 vport 1 user-vlan <span class="variable-highlight">${vlan3}</span> transparent<br>
service-port 4 vport 1 user-vlan <span class="variable-highlight">${vlan4}</span> transparent<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}</b><br>
service tag gemport 1 ethuni eth_0/1 <span class="variable-highlight">${vlanInput}</span><br><br>
exit<br>
exit<br>`;
  
	// Comando para aprovisionar ONU en Trunk Función: copiar
	const AprovisionarenTrunkCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n
exit\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
no service ppp\n
tcont 1 profile 1G\n
gemport 1 tcont 1\n
switchport mode trunk vport 1\n
service-port 1 vport 1 user-vlan ${vlan1} transparent\n
service-port 2 vport 1 user-vlan ${vlan2} transparent\n
service-port 3 vport 1 user-vlan ${vlan3} transparent\n
service-port 4 vport 1 user-vlan ${vlan4} transparent\n
exit\n\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
service tag gemport 1 ethuni eth_0/1 ${vlanInput}\n
exit\n
exit\n`;
  
	// Comando para aprovisionar la Telefonía Función: Visualizar
	const AprovisionarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
sip-service pots_0/1 profile denwaSIP userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono} password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono} media-profile wiltelMEDIA</span></span><br>
exit<br>
exit<br>`;
  
	// Comando para aprovisionar la Telefonía Función: Copiar
	const AprovisionarTelefoniaCopiar = `configure terminal\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}/${puertoLogico}\n
sip-service pots_0/1 profile denwaSIP userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\n
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
		descripcion: "Aprovisionar ONU en Trunk",
		comando: AprovisionarenTrunkVisual,
		copiarComando: AprovisionarenTrunkCopiar,
	  },
	];
  
	mostrarComandos(comandosAprovisionamiento);
  }
