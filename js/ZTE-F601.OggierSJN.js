function comandos() {
	// Resto del código para obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
	const macInput = document.getElementById("mac").value;
	const mac = formatearDireccionMAC(macInput) || "xxxx.xxxx.xxxx"; // Formatear la dirección MAC
	const numeroSerie =	document.getElementById("no-serie").value || "ZTEGCXXXXXXX"; // Agregar 'x' si está vacío
  
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
	const cuenta = document.getElementById("cuenta").value || "cuenta"; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || "cliente"; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA"; // Agregar 'AAA000AA' si está vacío
	const localidad = document.getElementById("localidad").value || "Localidad"; // Agrega 'Localidad' si está vacío
	const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna ''
	const vlanInput = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const { vlan1, vlan2, vlan3, vlan4 } = separarVLANs(vlanInput); // Guardo los valores individuales para asignar vlans trunkeables en cada puerto.
	
  
  
	// Comando para aprovisionar ONU en Bridge Función: Visualizar
	const AprovisionarBridgeVisual = `configure terminal<br>
interface gpon-olt_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span><br>
onu <span class="variable-highlight">${puertoLogico}</span> type <span class="variable-highlight">ZTE-F601</span> sn <span class="variable-highlight">${numeroSerie}</span><br>
exit<br><br>
<b>interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
tcont 1 profile 1G<br>
gemport 1 unicast tcont 1 dir both<br>
switchport mode hybrid vport 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-etype PPPOE vlan <span class="variable-highlight">${vlan}</span><br>
pppoe-plus enable vport 1<br>
exit<br><br>
<b>pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br></b>
service ppp type internet gemport 1 vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
exit<br>
exit<br><br>
wr<br>`;
  
	// Comando para aprovisionar ONU en Bridge Función: copiar
	const AprovisionarBridgeCopiar = `configure terminal\n
interface gpon-olt_1/${placa}/${puerto}\n
onu ${puertoLogico} type ZTE-F601 sn ${numeroSerie}\n
exit\n\n
interface gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
tcont 1 profile 1G\n
gemport 1 unicast tcont 1 dir both\n
switchport mode hybrid vport 1\n
service-port 1 vport 1 user-vlan ${vlan} user-etype PPPOE vlan ${vlan}\n
pppoe-plus enable vport 1\n
exit\n\n
pon-onu-mng gpon-onu_1/${placa}/${puerto}:${puertoLogico}\n
service ppp type internet gemport 1 vlan ${vlan}\n
vlan port eth_0/1 mode tag vlan ${vlan}\n\n
exit\n
exit\n\n
wr\n`;

    
  
	const comandosAprovisionamiento = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `show running-config interface gpon-olt_1/${placa}/${puerto}`,
	  },
	  {
		descripcion: "Aprovisionar ONU en Bridge",
		comando: AprovisionarBridgeVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: AprovisionarBridgeCopiar, // Usamos el copiarComando con \n para copiar
	  }
	];
  
	mostrarComandos(comandosAprovisionamiento);
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

  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Visualizar
	const CambiarVLANenBRIDGEVisual = `configure terminal<br>
interface gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service-port 1<br>
service-port 1 vport 1 user-vlan <span class="variable-highlight">${vlan}</span> user-vlan <span class="variable-highlight">${vlan}</span><br>
exit<br>
pon-onu-mng gpon-onu_1/<span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>:<span class="variable-highlight">${puertoLogico}</span><br>
no service ppp<br>
service ppp gemport 1 iphost 1 vlan <span class="variable-highlight">${vlan}</span><br>
vlan port eth_0/1 mode tag vlan <span class="variable-highlight">${vlan}</span><br><br>
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
		descripcion: "Cambiar VLAN (ONU en Bridge)",
		comando: CambiarVLANenBRIDGEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarVLANenBRIDGECopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Eliminar ONU",
		comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: EliminarONUCopiar, // Usamos el comando con \n para copiar
	  },
	  
	];
  
	mostrarComandos(comandosModificaciones);
  }