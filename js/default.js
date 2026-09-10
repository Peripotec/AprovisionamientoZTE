function modificaciones() {
	const placa = document.getElementById("placa").value || "x";
	const puerto = document.getElementById("puerto").value || "x";
	const puertoLogico = document.getElementById("puerto-logico").value || "x";
	const { vlan } = caracteristicaylocalidades();
	const { caracteristica } = caracteristicaylocalidades();
	const telefono = document.getElementById("telefono").value || "XXXXXX";
	const cuentaFormateada = formatearCuenta();
	const cuenta = document.getElementById("cuenta").value || "cuenta";
	const cliente = document.getElementById("cliente").value || "cliente";
	const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA";
	const localidad = document.getElementById("localidad").value || "Localidad";
	const esviejoCheckbox = document.getElementById("esviejo");
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : "";
	const pots = document.getElementById("pots");
	const numpots = pots.checked ? "2" : "1";
	const TV = document.getElementById("tv");
	const tv = TV.checked ? "un" : "";

	// Comando para Eliminar ONU
	const EliminarONUVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
no onu ${puertoLogico}<br>
exit<br>
exit<br>`;
  
	const EliminarONUCopiar = `configure terminal\ninterface gpon-olt_1/${placa}/${puerto}\nno onu ${puertoLogico}\nexit\nexit\n`;
  
	// Comando para Reiniciar ONU
	const ReiniciarONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
reboot<br>
yes<br>
exit<br>
exit<br>`;
  
	const ReiniciarONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nreboot\nyes\nexit\nexit\n`;

	// Comando para Resetear de fábrica ONU
	const ResetearONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
restore factory<br>
exit<br>
exit<br>`;
  
	const ResetearONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nrestore factory\nexit\nexit\n`;

	// Comando para Cambiar Perfil Navegable (NUEVO)
	const CambiarPerfilNavegableVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
tcont 1 name 1 profile <span class="variable-highlight">35UP</span><br>
gemport 1 traffic-limit downstream <span class="variable-highlight">300DOWN</span><br>
traffic-profile <span class="variable-highlight">35MUP</span> vport 1 direction ingress<br>
traffic-profile <span class="variable-highlight">300MDW</span> vport 1 direction egress<br>
exit<br>
exit<br>`;

	const CambiarPerfilNavegableCopiar = `configure terminal\ninterface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\ntcont 1 name 1 profile 35UP\ngemport 1 traffic-limit downstream 300DOWN\ntraffic-profile 35MUP vport 1 direction ingress\ntraffic-profile 300MDW vport 1 direction egress\nexit\nexit\n`;

	// Comando para desactivar WiFi
	const NoWiFiONUVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
wifi disable<br>
exit<br>
exit<br>`;
	
	const NoWiFiONUCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nwifi disable\nexit\nexit\n`;
  
	// Comando para cambiar VLAN (ONU con PPPoE)
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
  
	// Comando para cambiar VLAN (ONU en Bridge)
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
  
	// Comando para cambiar PPPoE
	const CambiarPPPoEVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no pppoe<br>
pppoe 1 nat enable user <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span> password <span class="variable-highlight">${pppoe}</span><br>
exit<br>
exit<br>`;
  
	const CambiarPPPoECopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno pppoe\npppoe 1 nat enable user ${cuenta}-${cliente}@${localidad}${esviejo} password ${pppoe}\nexit\nexit\n`;
 
	// Comando para cambiar Telefonía
	const CambiarTelefoniaVisual = `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no sip-service pots_0/<span class="variable-highlight">${numpots}</span><br>
sip-service pots_0/<span class="variable-highlight">${numpots}</span> profile wiltelvoip userid 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span><span class="variable-highlight">${telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`;
  
	const CambiarTelefoniaCopiar = `configure terminal\npon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\nno sip-service pots_0/${numpots}\nsip-service pots_0/${numpots} profile wiltelvoip userid 54${caracteristica}${telefono} username 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} media-profile wiltelMEDIA\nexit\nexit\n`;

	// Activar/Desactivar TV
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
