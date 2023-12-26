function comandos() {
	// Resto del código para obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
	const mac = document.getElementById("mac").value || "xx:xx:xx:xx:xx:xx"; // Formatear la dirección MAC
	
  
	// Generar los nuevos comandos con sus descripciones
	const comandos = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Encontrar puerto lógico a partir de la MAC que disca el PPPoE",
		comando: `bridge showall mac ${mac}`,
	  },
	  {
		descripcion: "Ver valores de la Fibra Óptica",
		comando: `onu status ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar la información de la ONU",
		comando: `onu showall ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar configuración (Si está en PPPoE o Bridge, Telefonía, etc)",
		comando: `cpe show ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Resincornizar configuración de la OLT en la ONU (elimina configuración hecha en la ONU)",
		comando: `onu resync ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Reiniciar ONU",
		comando: `onu reboot ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar las MACs aprendidas por la ONU",
		comando: `bridge showall 1-${placa}-${puerto}-${puertoLogico}`,
	  },
	  {
		descripcion: "Visualizar las MACs aprendidas por las ONU de una placa",
		comando: `bridge showall 1/${placa}/${puerto}`,
	  },
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `onu showall ${placa}/${puerto}`,
	  },
	  {
		descripcion: "Ver PPPoE configurado",
		comando: `cpe rg wan show ${placa}/${puerto}/${puertoLogico} showhidden`,
	  },
	  {
		descripcion: "Ver MACs aprendidas por el equipo",
		comando: `show mac gpon onu gpon-onu_1/${placa}/${puerto}:${puertoLogico}`,
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
	const caracteristica = "3492"; // Asignar el valor Caracterísitca
	const telefono = document.getElementById("telefono").value || "XXXXXX"; // Agregar 'x' si está vacío
	const cuentaFormateada = formatearCuenta();
	const cuenta = document.getElementById("cuenta").value || "cuenta"; // Agregar 'CUENTA' si está vacío
	const cliente = document.getElementById("cliente").value || "cliente"; // Agregar 'CLIENTE' si está vacío
	const pppoe = document.getElementById("clave-pppoe").value || "AAA000AA"; // Agregar 'AAA000AA' si está vacío
	const localidad = document.getElementById("localidad").value || "Localidad"; // Agrega 'Localidad' si está vacío
	const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna ''
	const vlan = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const Ngem = gem();

	// Comando para aprovisionar ONU con PPPoE Función: Visualizar
	const AprovisionarPPPoEVisual = `cpe system add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> vlan <span class="variable-highlight">${vlan}</span> pppoe-usr-id <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span>  pppoe-password <span class="variable-highlight">${pppoe}</span><br>`;
  
	// Comando para aprovisionar ONU con PPPoE Función: copiar
	const AprovisionarPPPoECopiar = `cpe system add ${placa}/${puerto}/${puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${placa}/${puerto}/${puertoLogico} vlan ${vlan} pppoe-usr-id ${cuenta}-${cliente}@${localidad}${esviejo} pppoe-password ${pppoe}\n`;	
  
	// Comando para aprovisionar ONU en Bridge Función: Visualizar
	const AprovisionarBridgeVisual = `cpe system add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan 143 tagged eth [1-4] rg-bridged<br>
`;
  
	// Comando para aprovisionar ONU en Bridge Función: copiar
	const AprovisionarBridgeCopiar = `cpe system add ${placa}/${puerto}/${puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan 143 tagged eth [1-4] rg-bridged\n
	`;

  
	// Comando para aprovisionar la Telefonía Función: Visualizar
	const AprovisionarTelefoniaVisual = `bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 7<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink-p2p vlan 141 tagged cos 6 rg-bridged sip<br>
cpe voip add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/1 admin-state up dial-number 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> voip-server-profile denwa-server<br>
cpe voip modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/1 admin-state up`;
  
	// Comando para aprovisionar la Telefonía Función: Copiar
	const AprovisionarTelefoniaCopiar = `bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 7${Ngem} gtp 1024000 downlink-p2p vlan 141 tagged cos 6 rg-bridged sip\n
cpe voip add ${placa}/${puerto}/${puertoLogico}/1 admin-state up dial-number 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} username 54${caracteristica}${telefono} voip-server-profile denwa-server\n
cpe voip modify ${placa}/${puerto}/${puertoLogico}/1 admin-state up\n
		`;
  
	const comandosAprovisionamiento = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `onu showall ${placa}/${puerto}`,
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
	];
  
	mostrarComandos(comandosAprovisionamiento);
  }
  
  function modificaciones() {
	// Obtener los valores de los campos de entrada
	const placa = document.getElementById("placa").value || "x"; // Agregar 'x' si está vacío
	const puerto = document.getElementById("puerto").value || "x"; // Agregar 'x' si está vacío
	const puertoLogico = document.getElementById("puerto-logico").value || "x"; // Agregar 'x' si está vacío
	const tipoONU = document.getElementById("tipo-onu").value || "ZTEX-FXXX"; // Agregar 'ZTEX-FXXX' si está vacío
	const vlan = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const caracteristica = "3492"; // Asignar el valor Caracterísitca
	const telefono = document.getElementById("telefono").value || "XXXXXX"; // Agregar 'x' si está vacío
	const cuentaFormateada = formatearCuenta();
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
reboot\n
yes\n
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
		descripcion: "Cambiar VLAN (ONU con PPPoE)",
		comando: CambiarVLANconPPPoEVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: CambiarVLANconPPPoECopiar, // Usamos el comando con \n para copiar
	  },
	  {
		descripcion: "Eliminar ONU",
		comando: EliminarONUVisual, // Utilizamos el comando con <br> para la visualización
		copiarComando: EliminarONUCopiar, // Usamos el comando con \n para copiar
	  },
	  
	];
  
	mostrarComandos(comandosModificaciones);
  }