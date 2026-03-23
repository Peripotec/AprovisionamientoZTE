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
				descripcion: "Ver valores de la Fibra Óptica (TV)",
				comando: (d) => `show gpon remote-onu interface video-ani gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
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
				descripcion: "Ver estado de la Telefonía",
				comando: (d) => `show gpon remote-onu voip-linestatus gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
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
exit<br>`,
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
exit\n`,
			},
			{
				descripcion: "Configurar Telefonía",
				comando: (d) => `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 2 name 2 profile 1G<br>
gemport 2 tcont 2<br>
switchport mode hybrid vport 2<br>
service-port 2 vport 2 user-vlan 141 vlan 141<br>
dhcpv4-l2-relay-agent enable vport 2<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
service voip gemport 2 vlan 141<br>
voip protocol sip<br>
voip-ip mode dhcp vlan-profile vlan141 host 2<br>
sip-service pots_0/<span class="variable-highlight">${d.numpots}</span> profile denwaSIP userid 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> username 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> password <span class="variable-highlight">${d.cuentaFormateada}</span><span class="variable-highlight">${d.telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
sn-bind enable sn\n
tcont 2 name 2 profile 1G\n
gemport 2 tcont 2\n
switchport mode hybrid vport 2\n
service-port 2 vport 2 user-vlan 141 vlan 141\n
dhcpv4-l2-relay-agent enable vport 2\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
service voip gemport 2 vlan 141\n
voip protocol sip\n
voip-ip mode dhcp vlan-profile vlan141 host 2\n
sip-service pots_0/${d.numpots} profile denwaSIP userid 54${d.caracteristica}${d.telefono} username 54${d.caracteristica}${d.telefono} password ${d.cuentaFormateada}${d.telefono} media-profile wiltelMEDIA\n
exit\n
exit\n`,
			},
			{
				descripcion: "Configurar ONU con PPPoE",
				comando: (d) => `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${d.vlan}</span><br>
pppoe-intermediate-agent enable vport 1<br><br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
weight tcont 1 queue 1 0<br>
ip-host 1 id ppp<br>
pppoe 1 nat enable user <span class="variable-highlight">${d.cuenta}-${d.cliente}@</span><span class="variable-highlight">${d.localidad}</span><span class="variable-highlight">${d.esviejo}</span> password <span class="variable-highlight">${d.pppoe}</span><br>
ip-service-map 1 host 1<br>
interface video video_0/1 state <span class="variable-highlight">${d.tv}lock</span><br><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
sn-bind enable sn\n
tcont 1 name 1 profile 1G\n
gemport 1 tcont 1\n
switchport mode hybrid vport 1\n
service-port 1 vport 1 user-vlan ${d.vlan} user-etype PPPOE vlan ${d.vlan}\n
pppoe-intermediate-agent enable vport 1\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
service ppp gemport 1 iphost 1 vlan ${d.vlan}\n
weight tcont 1 queue 1 0\n
ip-host 1 id ppp\n
pppoe 1 nat enable user ${d.cuenta}-${d.cliente}@${d.localidad}${d.esviejo} password ${d.pppoe}\n
ip-service-map 1 host 1\n
interface video video_0/1 state ${d.tv}lock\n
exit\n
exit\n`,
			},
			{
				descripcion: "Configurar WiFi",
				comando: (d) => `configure terminal<br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
interface wifi wifi_0/1 state unlock<br>
interface wifi wifi_0/5 state unlock<br>
ssid ctrl wifi_0/1 name <span class="variable-highlight">${d.wifiSsid}</span>_2.4GHz<br>
ssid ctrl wifi_0/5 name <span class="variable-highlight">${d.wifiSsid}</span>_5.8GHz<br>
ssid auth wpa wifi_0/1 key <span class="variable-highlight">${d.wifiPassword}</span><br>
ssid auth wpa wifi_0/5 key <span class="variable-highlight">${d.wifiPassword}</span><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
interface wifi wifi_0/1 state unlock\n
interface wifi wifi_0/5 state unlock\n
ssid ctrl wifi_0/1 name ${d.wifiSsid}_2.4GHz\n
ssid ctrl wifi_0/5 name ${d.wifiSsid}_5.8GHz\n
ssid auth wpa wifi_0/1 key ${d.wifiPassword}\n
ssid auth wpa wifi_0/5 key ${d.wifiPassword}\n
exit\n
exit\n`,
			},
			{
				descripcion: "Configurar ONU en Bridge",
				comando: (d) => `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
sn-bind enable sn<br>
tcont 1 name 1 profile 1G<br>
gemport 1 tcont 1<br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> vlan <span class="variable-highlight">${d.vlan}</span><br>
pppoe-intermediate-agent enable vport 1<br><br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
ip-service-map 1 host 1<br>
interface video video_0/1 state <span class="variable-highlight">${d.tv}lock</span><br><br>
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
vlan port eth_0/2 mode tag vlan ${d.vlan}\n
vlan port eth_0/3 mode tag vlan ${d.vlan}\n
vlan port eth_0/4 mode tag vlan ${d.vlan}\n
ip-service-map 1 host 1\n
interface video video_0/1 state ${d.tv}lock\n
exit\n
exit\n`,
			},
			{
				descripcion: "Configurar ONU en Trunk",
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
reboot\n
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
				descripcion: "Modificar WiFi",
				comando: (d) => `configure terminal<br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br></b>
interface wifi wifi_0/1 state unlock<br>
interface wifi wifi_0/5 state unlock<br>
ssid ctrl wifi_0/1 name <span class="variable-highlight">${d.wifiSsid}</span>_2.4GHz<br>
ssid ctrl wifi_0/5 name <span class="variable-highlight">${d.wifiSsid}</span>_5.8GHz<br>
ssid auth wpa wifi_0/1 key <span class="variable-highlight">${d.wifiPassword}</span><br>
ssid auth wpa wifi_0/5 key <span class="variable-highlight">${d.wifiPassword}</span><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
interface wifi wifi_0/1 state unlock\n
interface wifi wifi_0/5 state unlock\n
ssid ctrl wifi_0/1 name ${d.wifiSsid}_2.4GHz\n
ssid ctrl wifi_0/5 name ${d.wifiSsid}_5.8GHz\n
ssid auth wpa wifi_0/1 key ${d.wifiPassword}\n
ssid auth wpa wifi_0/5 key ${d.wifiPassword}\n
exit\n
exit\n`,
			},
			{
				descripcion: "Cambiar PPPoE en ONU",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no pppoe<br>
pppoe 1 nat enable user <span class="variable-highlight">${d.cuenta}-${d.cliente}@</span><span class="variable-highlight">${d.localidad}</span><span class="variable-highlight">${d.esviejo}</span> password <span class="variable-highlight">${d.pppoe}</span><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no pppoe\n
pppoe 1 nat enable user ${d.cuenta}-${d.cliente}@${d.localidad}${d.esviejo} password ${d.pppoe}\n
exit\n
exit\n`,
			},
			{
				descripcion: "Cambiar Telefonía en ONU",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no sip-service pots_0/<span class="variable-highlight">${d.numpots}</span><br>
sip-service pots_0/<span class="variable-highlight">${d.numpots}</span> profile denwaSIP userid 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> username 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> password <span class="variable-highlight">${d.cuentaFormateada}</span><span class="variable-highlight">${d.telefono}</span> media-profile wiltelMEDIA<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no sip-service pots_0/${d.numpots}\n
sip-service pots_0/${d.numpots} profile denwaSIP userid 54${d.caracteristica}${d.telefono} username 54${d.caracteristica}${d.telefono} password ${d.cuentaFormateada}${d.telefono} media-profile wiltelMEDIA\n
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
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/2 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/3 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br>
vlan port eth_0/4 mode tag vlan <span class="variable-highlight">${d.vlan}</span><br><br>
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
vlan port eth_0/2 mode tag vlan ${d.vlan}\n
vlan port eth_0/3 mode tag vlan ${d.vlan}\n
vlan port eth_0/4 mode tag vlan ${d.vlan}\n
exit\n
exit\n`,
			},
			{
				descripcion: "Cambiar VLAN (ONU con PPPoE)",
				comando: (d) => `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${d.vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${d.vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
no service ppp<br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${d.vlan}</span><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no service-port 1\n
service-port 1 vport 1 user-vlan ${d.vlan} user-etype PPPOE vlan ${d.vlan}\n
exit\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
no service ppp\n
service ppp gemport 1 iphost 1 vlan ${d.vlan}\n
exit\n
exit\n`,
			},
			{
				descripcion: "Activar/Desactivar TV",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
interface video video_0/1 state <span class="variable-highlight">${d.tv}lock</span><br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
interface video video_0/1 state ${d.tv}lock\n
exit\n
exit\n`,
			},
			{
				descripcion: "Desactivar WiFi de la ONU (No funciona en todos los modelos)",
				comando: (d) => `configure terminal<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>:<span class="variable-highlight">${d.puertoLogico}</span><br>
wifi disable<br>
exit<br>
exit<br>`,
				copiarComando: (d) => `configure terminal\n
pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n
wifi disable\n
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