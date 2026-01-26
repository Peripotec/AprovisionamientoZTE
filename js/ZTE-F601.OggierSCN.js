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
				descripcion: "Aprovisionar ONU en Bridge",
				comando: (d) => `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span><br>
onu <span class="variable-highlight">${d.puertoLogico}</span> type <span class="variable-highlight">ZTE-F601</span> sn <span class="variable-highlight">${d.numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
tcont 1 name tcont1 profile 1G<br>
gemport 1 unicast tcont 1 dir both<br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${d.vlan}</span><br>
pppoe-plus enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
service ppp type internet gemport 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br><br>
exit<br>
exit<br><br>
wr<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-olt_1/${d.placa}/${d.puerto}\n
onu ${d.puertoLogico} type ZTE-F601 sn ${d.numeroSerie}\n
exit\n\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
tcont 1 name tcont1 profile 1G\n
gemport 1 unicast tcont 1 dir both\n
switchport mode hybrid vport 1\n
service-port 1 vport 1 user-vlan ${d.vlan} user-etype PPPOE vlan ${d.vlan}\n
pppoe-plus enable vport 1\n
exit\n\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
service ppp type internet gemport 1 vlan ${d.vlan}\n
vlan port eth_0/1 mode tag vlan ${d.vlan}\n\n
exit\n
exit\n\n
wr\n`,
			}
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
