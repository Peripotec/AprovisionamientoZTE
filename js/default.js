function comandos() {
	const placa = document.getElementById("placa").value || "x";
	const puerto = document.getElementById("puerto").value || "x";
	const puertoLogico = document.getElementById("puerto-logico").value || "x";
	const macInput = document.getElementById("mac").value;
	
	function formatearDireccionMAC(mac) {
		if (!mac || mac === "xxxx.xxxx.xxxx") return "xxxx.xxxx.xxxx";
		const macSinDosPuntos = mac.replace(/:/g, "");
		const grupos = [];
		for (let i = 0; i < macSinDosPuntos.length; i += 4) {
			grupos.push(macSinDosPuntos.slice(i, i + 4));
		}
		return grupos.join(".");
	}
	
	const mac = formatearDireccionMAC(macInput);
	const numeroSerie = document.getElementById("no-serie").value || "ZTEGCXXXXXXX";

	const comandosList = [
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
		descripcion: "Ver valores de la Fibra Óptica (TV)",
		comando: `show gpon remote-onu interface video-ani gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
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
		comando: `show gpon remote-onu voip-linestatus gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
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

	if (typeof window.CommandGenerator !== 'undefined') {
		const generator = new CommandGenerator();
		const result = generator.render(comandosList, { includeFixed: true });
		mostrarComandos(result);
	} else {
		mostrarComandos(comandosList);
	}
}

function aprovisionamiento() {
	const placa = document.getElementById("placa").value || "x";
	const puerto = document.getElementById("puerto").value || "x";
	const puertoLogico = document.getElementById("puerto-logico").value || "x";
	const tipoONU = document.getElementById("tipo-onu").value || "ZTEX-FXXX";
	const numeroSerie = document.getElementById("no-serie").value || "ZTEGCXXXXXXX";
	const { vlan } = typeof caracteristicaylocalidades === 'function' ? caracteristicaylocalidades() : { vlan: "XXX", caracteristica: "XXXX" };
	const { caracteristica } = typeof caracteristicaylocalidades === 'function' ? caracteristicaylocalidades() : { vlan: "XXX", caracteristica: "XXXX" };
	const telefono = document.getElementById("telefono").value || "XXXXXX";
	
	function formatearCuenta() {
		const cuentaOriginal = document.getElementById("cuenta").value;
		if (!cuentaOriginal) return "XXXXXXXXXX";
		if (cuentaOriginal.length === 10 && cuentaOriginal.slice(-3) === "000") return cuentaOriginal;
		if (cuentaOriginal.length !== 10 && cuentaOriginal.slice(-3) !== "000") {
			const longitudDeseada = 10;
			const cerosNecesarios = longitudDeseada - cuentaOriginal.length - 3;
			const cerosInicio = "0".repeat(Math.max(cerosNecesarios, 0));
			return cerosInicio + cuentaOriginal + "0".repeat(3);
		}
		return "XXXXXXXXXX";
	}
	
	const cuentaFormateada = formatearCuenta();
	const cuenta = document.getElementById("cuenta").value || "cuenta";
	const cliente = document.getElementById("cliente").value || "cliente";
	const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA";
	const localidad = document.getElementById("localidad").value || "Localidad";
	const esviejoCheckbox = document.getElementById("esviejo");
	const esviejo = esviejoCheckbox ? (esviejoCheckbox.checked ? "-wilnet" : "") : "";
	const pots = document.getElementById("pots");
	const numpots = pots ? (pots.checked ? "2" : "1") : "1";
	const TV = document.getElementById("tv");
	const tv = TV ? (TV.checked ? "un" : "") : "";

	const SetearOnuVisual = `configure terminal<br>
<b>interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br></b>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">${tipoONU}</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br>
<br><b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet<br>
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254<br>
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149<br>
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34<br><br>
exit<br>
exit<br>`;

	const SetearOnuCopiar = `configure terminal\ninterface gpon-olt_1/${placa}/${puerto}\nonu ${puertoLogico} type ${tipoONU} sn ${numeroSerie}\n\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nsecurity-mgmt 1 state enable ingress-type lan protocol web ftp telnet\nsecurity-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254\nsecurity-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web\nsecurity-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149\nsecurity-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web\nsecurity-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34\nexit\nexit\n`;

	const AprovisionarTelefoniaVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
gemport 2 tcont 1<br>
gemport 2 traffic-limit upstream VOIP downstream VOIP<br>
service-port 2 vport 2 user-vlan 141 vlan 141<br>
dhcpv4-l2-relay-agent enable vport 2<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service voip gemport 2 vlan 141<br>
voip protocol sip<br>
voip-ip mode dhcp vlan-profile vlan141 host 2<br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile wiltelvoip userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`;

	const AprovisionarTelefoniaCopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\ngemport 2 tcont 1\ngemport 2 traffic-limit upstream VOIP downstream VOIP\nservice-port 2 vport 2 user-vlan 141 vlan 141\ndhcpv4-l2-relay-agent enable vport 2\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nservice voip gemport 2 vlan 141\nvoip protocol sip\nvoip-ip mode dhcp vlan-profile vlan141 host 2\nsip-service pots_0/${numpots} profile wiltelvoip userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\nexit\nexit\n`;

	const AprovisionarPPPoEVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile <span class="variable-highlight">35UP</span><br>
gemport 1 tcont 1<br>
gemport 1 traffic-limit downstream <span class="variable-highlight">300DOWN</span><br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
pppoe-intermediate-agent enable vport 1<br>
traffic-profile <span class="variable-highlight">35MUP</span> vport 1 direction ingress<br>
traffic-profile <span class="variable-highlight">300MDW</span> vport 1 direction egress<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
weight tcont 1 queue 1 0<br>
ip-host 1 id ppp<br>
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span> password <span class="variable-highlight">${pppoe}</span><br>
ip-service-map 1 host 1<br><br>
exit<br>
exit<br>`;

	const AprovisionarPPPoECopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nsn-bind enable sn\ntcont 1 name 1 profile 35UP\ngemport 1 tcont 1\ngemport 1 traffic-limit downstream 300DOWN\nswitchport mode hybrid vport 1\nservice-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\npppoe-intermediate-agent enable vport 1\ntraffic-profile 35MUP vport 1 direction ingress\ntraffic-profile 300MDW vport 1 direction egress\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nservice ppp gemport 1 iphost 1 vlan ${vlan}\nweight tcont 1 queue 1 0\nip-host 1 id ppp\npppoe 1 nat enable user ${cuenta}-${cliente}@${localidad}${esviejo} password ${pppoe}\nip-service-map 1 host 1\nexit\nexit\n`;

	const AprovisionarBridgeVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile <span class="variable-highlight">35UP</span><br>
gemport 1 tcont 1<br>
gemport 1 traffic-limit downstream <span class="variable-highlight">300DOWN</span><br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> vlan <span class="variable-highlight">${vlan}</span><br>
pppoe-intermediate-agent enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
exit<br>
exit<br>`;

	const AprovisionarBridgeCopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nsn-bind enable sn\ntcont 1 name 1 profile 35UP\ngemport 1 tcont 1\ngemport 1 traffic-limit downstream 300DOWN\nswitchport mode hybrid vport 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\npppoe-intermediate-agent enable vport 1\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nservice ppp gemport 1 iphost 1 vlan ${vlan}\nvlan port eth_0/1 mode tag vlan ${vlan}\nvlan port eth_0/2 mode tag vlan ${vlan}\nvlan port eth_0/3 mode tag vlan ${vlan}\nvlan port eth_0/4 mode tag vlan ${vlan}\nexit\nexit\n`;

	const comandosAprovisionamiento = [
		{
			descripcion: "Setear ONU en la OLT",
			comando: SetearOnuVisual,
			copiarComando: SetearOnuCopiar,
		},
		{
			descripcion: "Configurar ONU con PPPoE",
			comando: AprovisionarPPPoEVisual,
			copiarComando: AprovisionarPPPoECopiar,
		},
		{
			descripcion: "Configurar Telefonía",
			comando: AprovisionarTelefoniaVisual,
			copiarComando: AprovisionarTelefoniaCopiar,
		},
		{
			descripcion: "Configurar ONU en Bridge",
			comando: AprovisionarBridgeVisual,
			copiarComando: AprovisionarBridgeCopiar,
		},
	];

	if (typeof window.CommandGenerator !== 'undefined') {
		const generator = new CommandGenerator();
		const result = generator.render(comandosAprovisionamiento);
		mostrarComandos(result);
	} else {
		mostrarComandos(comandosAprovisionamiento);
	}
}

function modificaciones() {
	const placa = document.getElementById("placa").value || "x";
	const puerto = document.getElementById("puerto").value || "x";
	const puertoLogico = document.getElementById("puerto-logico").value || "x";
	const { vlan } = typeof caracteristicaylocalidades === 'function' ? caracteristicaylocalidades() : { vlan: "XXX", caracteristica: "XXXX" };
	const { caracteristica } = typeof caracteristicaylocalidades === 'function' ? caracteristicaylocalidades() : { vlan: "XXX", caracteristica: "XXXX" };
	const telefono = document.getElementById("telefono").value || "XXXXXX";
	
	function formatearCuenta() {
		const cuentaOriginal = document.getElementById("cuenta").value;
		if (!cuentaOriginal) return "XXXXXXXXXX";
		if (cuentaOriginal.length === 10 && cuentaOriginal.slice(-3) === "000") return cuentaOriginal;
		if (cuentaOriginal.length !== 10 && cuentaOriginal.slice(-3) !== "000") {
			const longitudDeseada = 10;
			const cerosNecesarios = longitudDeseada - cuentaOriginal.length - 3;
			const cerosInicio = "0".repeat(Math.max(cerosNecesarios, 0));
			return cerosInicio + cuentaOriginal + "0".repeat(3);
		}
		return "XXXXXXXXXX";
	}
	
	const cuentaFormateada = formatearCuenta();
	const cuenta = document.getElementById("cuenta").value || "cuenta";
	const cliente = document.getElementById("cliente").value || "cliente";
	const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA";
	const localidad = document.getElementById("localidad").value || "Localidad";
	const esviejoCheckbox = document.getElementById("esviejo");
	const esviejo = esviejoCheckbox ? (esviejoCheckbox.checked ? "-wilnet" : "") : "";
	const pots = document.getElementById("pots");
	const numpots = pots ? (pots.checked ? "2" : "1") : "1";
	const TV = document.getElementById("tv");
	const tv = TV ? (TV.checked ? "un" : "") : "";

	const EliminarONUVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
no onu ${puertoLogico}<br>
exit<br>
exit<br>`;
  
	const EliminarONUCopiar = `configure terminal\ninterface gpon-olt_1/${placa}/${puerto}\nno onu ${puertoLogico}\nexit\nexit\n`;
  
	const ReiniciarONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
reboot<br>
yes<br>
exit<br>
exit<br>`;
  
	const ReiniciarONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nreboot\nyes\nexit\nexit\n`;

	const ResetearONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
restore factory<br>
exit<br>
exit<br>`;
  
	const ResetearONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nrestore factory\nexit\nexit\n`;

	const CambiarPerfilNavegableVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
tcont 1 name 1 profile <span class="variable-highlight">35UP</span><br>
gemport 1 traffic-limit downstream <span class="variable-highlight">300DOWN</span><br>
traffic-profile <span class="variable-highlight">35MUP</span> vport 1 direction ingress<br>
traffic-profile <span class="variable-highlight">300MDW</span> vport 1 direction egress<br>
exit<br>
exit<br>`;

	const CambiarPerfilNavegableCopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\ntcont 1 name 1 profile 35UP\ngemport 1 traffic-limit downstream 300DOWN\ntraffic-profile 35MUP vport 1 direction ingress\ntraffic-profile 300MDW vport 1 direction egress\nexit\nexit\n`;

	const NoWiFiONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
wifi disable<br>
exit<br>
exit<br>`;
	
	const NoWiFiONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nwifi disable\nexit\nexit\n`;
  
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
  
	const CambiarVLANconPPPoECopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno service-port 1\nservice-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno service ppp\nservice ppp gemport 1 iphost 1 vlan ${vlan}\nexit\nexit\n`;
  
	const CambiarVLANenBRIDGEVisual = `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
exit<br>
exit<br>`;
  
	const CambiarVLANenBRIDGECopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno service-port 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\nexit\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nservice ppp gemport 1 iphost 1 vlan ${vlan}\nvlan port eth_0/1 mode tag vlan ${vlan}\nvlan port eth_0/2 mode tag vlan ${vlan}\nvlan port eth_0/3 mode tag vlan ${vlan}\nvlan port eth_0/4 mode tag vlan ${vlan}\nexit\nexit\n`;
  
	const CambiarPPPoEVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no pppoe<br>
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span> password <span class="variable-highlight">${pppoe}</span><br>
exit<br>
exit<br>`;
  
	const CambiarPPPoECopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno pppoe\npppoe 1 nat enable user ${cuenta}-${cliente}@${localidad}${esviejo} password ${pppoe}\nexit\nexit\n`;
 
	const CambiarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no sip-service pots_0/<span class="variable-highlight">${numpots}</span><br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile wiltelvoip userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`;
  
	const CambiarTelefoniaCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno sip-service pots_0/${numpots}\nsip-service pots_0/${numpots} profile wiltelvoip userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\nexit\nexit\n`;

	const DesactivarRFVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
interface video video_0/1 state <span class="variable-highlight">${tv}lock</span><br>
exit<br>
exit<br>`;
			
	const DesactivarRFCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\ninterface video video_0/1 state ${tv}lock\nexit\nexit\n`;

	const comandosModificaciones = [
		{
			descripcion: "Reiniciar ONU",
			comando: ReiniciarONUVisual,
			copiarComando: ReiniciarONUCopiar,
		},
		{
			descripcion: "Resetear de fábrica ONU",
			comando: ResetearONUVisual,
			copiarComando: ResetearONUCopiar,
		},
		{
			descripcion: "Cambiar perfil navegable",
			comando: CambiarPerfilNavegableVisual,
			copiarComando: CambiarPerfilNavegableCopiar,
		},
		{
			descripcion: "Cambiar PPPoE en ONU",
			comando: CambiarPPPoEVisual,
			copiarComando: CambiarPPPoECopiar,
		},
		{
			descripcion: "Cambiar Telefonía en ONU",
			comando: CambiarTelefoniaVisual,
			copiarComando: CambiarTelefoniaCopiar,
		},
		{
			descripcion: "Cambiar VLAN (ONU en Bridge)",
			comando: CambiarVLANenBRIDGEVisual,
			copiarComando: CambiarVLANenBRIDGECopiar,
		},
		{
			descripcion: "Cambiar VLAN (ONU con PPPoE)",
			comando: CambiarVLANconPPPoEVisual,
			copiarComando: CambiarVLANconPPPoECopiar,
		},
		{
			descripcion: "Activar/Desactivar TV",
			comando: DesactivarRFVisual,
			copiarComando: DesactivarRFCopiar,
		},
		{
			descripcion: "Desactivar WiFi de la ONU (No funciona en todos los modelos)",
			comando: NoWiFiONUVisual,
			copiarComando: NoWiFiONUCopiar,
		},
		{
			descripcion: "Eliminar ONU",
			comando: EliminarONUVisual,
			copiarComando: EliminarONUCopiar,
		},
	];

	if (typeof window.CommandGenerator !== 'undefined') {
		const generator = new CommandGenerator();
		const result = generator.render(comandosModificaciones);
		mostrarComandos(result);
	} else {
		mostrarComandos(comandosModificaciones);
	}
}

// Publicar funciones globalmente a window de forma segura
if (typeof comandos === 'function') window.comandos = comandos;
if (typeof aprovisionamiento === 'function') window.aprovisionamiento = aprovisionamiento;
if (typeof modificaciones === 'function') window.modificaciones = modificaciones;
