(function () {
	const config = {
		comandos: [
			{
				descripcion: "Encontrar puerto lógico a partir del Nº de Serie (GPON SN)",
				comando: (d) => `show gpon onu by sn ${d.numeroSerie}`,
			},
			{
				descripcion: "Encontrar puerto lógico a partir de la MAC",
				comando: (d) => `show mac ${d.mac}`,
			},
			{
				descripcion: "Ver valores de la Fibra Óptica (Datos)",
				comando: (d) => `show gpon remote-onu interface pon gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar si está en PPPoE o Bridge",
				comando: (d) => `show onu running config gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar la configuración de la interfaz ONU",
				comando: (d) => `show running-config interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar las Ethernet de la ONU",
				comando: (d) => `show gpon remote-onu interface eth gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},

			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `show running-config interface gpon-olt_1/${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Visualizar la información de la ONU",
				comando: (d) => `show gpon onu detail-info gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
			{
				descripcion: "Estados de ONUs",
				comando: (d) => `show gpon onu state gpon-olt_1/${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Ver MACs aprendidas por el equipo",
				comando: (d) => `show mac gpon onu gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
			{
				descripcion: "Ver valores de la Fibra Óptica del puerto (Usar con Cuidado)",
				comando: (d) => `show pon power onu-rx gpon-olt_1/${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Visualizar el Digital Map (Telefonía) ",
				comando: (d) => `show gpon onu profile dial-plan`,
			},
		],
		aprovisionamiento: [
			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `show running-config interface gpon-olt_1/${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Aprovisionar ONU en un puerto de la OLT",
				comando: (d) => `configure terminal<br>
<b>interface gpon-olt_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span><br></b>
onu <span class="variable-highlight">${d.puertoLogico}</span> type <span class="variable-highlight">${d.tipoONU}</span> sn <span class="variable-highlight">${d.numeroSerie}</span><br>
exit<br>
<br><b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet<br>
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254<br>
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149<br>
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web<br>
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34<br><br>
exit<br>
exit<br>
`,
				copiarComando: (d) => `configure terminal\n
interface gpon-olt_1/${d.placa}/${d.puerto}\n
onu ${d.puertoLogico} type ${d.tipoONU} sn ${d.numeroSerie}\n\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
security-mgmt 1 state enable ingress-type lan protocol web ftp telnet\n
security-mgmt 1 start-src-ip 192.168.1.2 end-src-ip 192.168.1.254\n
security-mgmt 2 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 2 start-src-ip 200.2.127.149 end-src-ip 200.2.127.149\n
security-mgmt 3 state enable mode forward ingress-type iphost 1 protocol web\n
security-mgmt 3 start-src-ip 200.2.126.34 end-src-ip 200.2.126.34\n
exit\n
exit\n
`,
			},
			{
				descripcion: "Aprovisionar ONU en Bridge",
				comando: (d) => `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> vlan <span class="variable-highlight">${d.vlan}</span><br>
pppoe-intermediate-agent enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
ip-service-map 1 host 1<br><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
sn-bind enable sn\n
tcont 1 name 1 profile 1G\n
gemport 1 tcont 1\n
switchport mode hybrid vport 1\n
service-port 1 vport 1 user-vlan ${d.vlan} vlan ${d.vlan}\n
pppoe-intermediate-agent enable vport 1\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
service ppp gemport 1 iphost 1 vlan ${d.vlan}\n
vlan port eth_0/1 mode tag vlan ${d.vlan}\n
ip-service-map 1 host 1\n
exit\n
exit\n`,
			},
			{
				descripcion: "Aprovisionar ONU en Trunk",
				comando: (d) => `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span><br>
onu <span class="variable-highlight">${d.puertoLogico}</span> type <span class="variable-highlight">${d.tipoONU}</span> sn <span class="variable-highlight">${d.numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}<br></b>
tcont 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode trunk vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan1}</span> transparent<br>
service-port 2 vport 1 user-vlan <span class="variable-highlight">${d.vlan2}</span> transparent<br>
service-port 3 vport 1 user-vlan <span class="variable-highlight">${d.vlan3}</span> transparent<br>
service-port 4 vport 1 user-vlan <span class="variable-highlight">${d.vlan4}</span> transparent<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}</b><br>
service tag gemport 1 ethuni eth_0/1 vlan <span class="variable-highlight">${d.vlanInput}</span><br><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-olt_1/${d.placa}/${d.puerto}\n
onu ${d.puertoLogico} type ${d.tipoONU} sn ${d.numeroSerie}\n
exit\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
tcont 1 profile 1G\n
gemport 1 tcont 1\n
switchport mode trunk vport 1\n
service-port 1 vport 1 user-vlan ${d.vlan1} transparent\n
service-port 2 vport 1 user-vlan ${d.vlan2} transparent\n
service-port 3 vport 1 user-vlan ${d.vlan3} transparent\n
service-port 4 vport 1 user-vlan ${d.vlan4} transparent\n
exit\n\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
service tag gemport 1 ethuni eth_0/1 vlan ${d.vlanInput}\n
exit\n
exit\n`,
			},
		],
		modificaciones: [
			{
				descripcion: "Reiniciar ONU",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
reboot<br>
yes<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
reboot
yes\n
exit\n
exit\n`,
			},
			{
				descripcion: "Resetear de fábrica ONU",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
restore factory<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
restore factory\n
exit\n
exit\n`,
			},
			{
				descripcion: "Cambiar VLAN (ONU en Bridge)",
				comando: (d) => `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> vlan <span class="variable-highlight">${d.vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no service ppp<br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${d.vlan} vlan ${d.vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no service ppp\n
service ppp gemport 1 iphost 1 vlan ${d.vlan}\n
vlan port eth_0/1 mode tag vlan ${d.vlan}\n
\n
exit\n
exit\n`,
			},
			{
				descripcion: "Eliminar ONU",
				comando: (d) => `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span><br>
no onu ${d.puertoLogico}<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-olt_1/${d.placa}/${d.puerto}\n
no onu ${d.puertoLogico}\n
exit\n
exit\n`,
			},

		]
	};

	window.comandos = function () {
		const gen = new CommandGenerator();
		mostrarComandos(gen.render(config.comandos, { includeFixed: true }));
	}

	window.aprovisionamiento = function () {
		const gen = new CommandGenerator();
		mostrarComandos(gen.render(config.aprovisionamiento, { includeFixed: true }));
	}

	window.modificaciones = function () {
		const gen = new CommandGenerator();
		mostrarComandos(gen.render(config.modificaciones));
	}
})();