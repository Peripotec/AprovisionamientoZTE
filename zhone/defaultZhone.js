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
		descripcion: "Resincronizar configuración de la OLT en la ONU (elimina configuración hecha en la ONU)",
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
	const pots = document.getElementById("pots"); // Comprueba si el checkbox está marcado
	const numpots = pots.checked ? "2" : "1"; // Le asigna por defecto el valor a pots 1, si es true le asigna '2'
	const vlan = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const Ngem = gem(); //  Se asigna el valor del gem en base al puerto lógico

	// Comando para aprovisionar ONU con PPPoE Función: Visualizar
	const AprovisionarPPPoEVisual = `cpe system add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> vlan <span class="variable-highlight">${vlan}</span> pppoe-usr-id <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span>  pppoe-password <span class="variable-highlight">${pppoe}</span><br>
`;
  
	// Comando para aprovisionar ONU con PPPoE Función: copiar
	const AprovisionarPPPoECopiar = `cpe system add ${placa}/${puerto}/${puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${placa}/${puerto}/${puertoLogico} vlan ${vlan} pppoe-usr-id ${cuenta}-${cliente}@${localidad}${esviejo} pppoe-password ${pppoe}\n
`;	
  
	// Comando para aprovisionar ONU en Bridge Función: Visualizar
	const AprovisionarBridgeVisual = `cpe system add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bridged<br>
`;
  
	// Comando para aprovisionar ONU en Bridge Función: copiar
	const AprovisionarBridgeCopiar = `cpe system add ${placa}/${puerto}/${puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bridged\n
`;

  
	// Comando para aprovisionar la Telefonía Función: Visualizar
	const AprovisionarTelefoniaVisual = `bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 7<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink-p2p vlan 141 tagged cos 6 rg-bridged sip<br>
cpe voip add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/<span class="variable-highlight">${numpots}</span> admin-state up dial-number 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> voip-server-profile denwa-server<br>
cpe voip modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/<span class="variable-highlight">${numpots}</span> admin-state up
`;
  
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
	const pots = document.getElementById("pots"); // Comprueba si el checkbox está marcado
	const numpots = pots.checked ? "2" : "1"; // Le asigna por defecto el valor a pots 1, si es true le asigna '2'
	const Ngem = gem(); //  Se asigna el valor del gem en base al puerto lógico

	// Comando para Eliminar ONU Función: Visualizar
	const EliminarONUVisual = `onu delete <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span><br>
yes<br>
no<br>
yes<br>
`;
  
	// Comando para Eliminar ONU Función: Copiar
	const EliminarONUCopiar = `onu delete ${placa}/${puerto}/${puertoLogico}\n
yes\n
no\n
yes\n
`;
  
	// Comando para Reiniciar ONU Función: Visualizar
	const ReiniciarONUVisual = `configure terminal<br>
`;
  
	// Comando para Reiniciar ONU Función: Copiar
	const ReiniciarONUCopiar = `configure terminal\n
`;
  
	// Comando para cambiar la VLAN (ONU con PPPoE) Función: Visualizar
	const CambiarVLANconPPPoEVisual = `bridge delete 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> vlan <span class="variable-highlight">${vlan}</span> pppoe-usr-id <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span>  pppoe-password <span class="variable-highlight">${pppoe}</span><br>
`;


  
	// Comando para cambiar la VLAN (ONU con PPPoE) Función: Copiar
	const CambiarVLANconPPPoECopiar = `bridge delete 1-${placa}-${puerto}-${puertoLogico}/gpononu all\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${placa}/${puerto}/${puertoLogico} vlan ${vlan} pppoe-usr-id ${cuenta}-${cliente}@${localidad}${esviejo}  pppoe-password ${pppoe}\n
`;
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Visualizar
	const CambiarVLANenBRIDGEVisual = `bridge delete 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bridged<br>
`;
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Copiar
	const CambiarVLANenBRIDGECopiar = `bridge delete 1-${placa}-${puerto}-${puertoLogico}/gpononu all\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bridged\n
`;
  
	// Comando para cambiar el PPPoE Función: Visualizar
	const CambiarPPPoEVisual = `cpe rg wan modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> vlan <span class="variable-highlight">${vlan}</span> pppoe-usr-id <span class="variable-highlight">${cuenta}-${cliente}@</span><span class="variable-highlight">${localidad}</span><span class="variable-highlight">${esviejo}</span>  pppoe-password <span class="variable-highlight">${pppoe}</span><br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bridged<br>
	`;
  
	// Comando para cambiar el PPPoE Función: Copiar
	const CambiarPPPoECopiar = `cpe rg wan modify ${placa}/${puerto}/${puertoLogico} vlan ${vlan} pppoe-usr-id ${cuenta}-${cliente}@${localidad}${esviejo} pppoe-password ${pppoe}\n
`;
 
	// Comando para cambiar la Telefonía Función: Visualizar
	const CambiarTelefoniaVisual = `cpe voip delete <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/<span class="variable-highlight">${numpots}</span><br>
cpe voip add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/<span class="variable-highlight">${numpots}</span> admin-state up dial-number 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> password <span class="variable-highlight">${cuentaFormateada}</span></span><span class="variable-highlight">${telefono}</span> username 54<span class="variable-highlight">${caracteristica}</span><span class="variable-highlight">${telefono}</span> voip-server-profile denwa-server<br>
cpe voip modify <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span>/<span class="variable-highlight">${numpots}</span> admin-state up<br>
`;
	
	
  
	// Comando para cambiar la Telefonía Función: Copiar
	const CambiarTelefoniaCopiar = `cpe voip delete ${placa}/${puerto}/${puertoLogico}/1\n
cpe voip add ${placa}/${puerto}/${puertoLogico}/1 admin-state up dial-number 54${caracteristica}${telefono} password ${cuentaFormateada}${telefono} username 54${caracteristica}${telefono} voip-server-profile denwa-server\n
cpe voip modify ${placa}/${puerto}/${puertoLogico}/1 admin-state up\n
`;
  
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