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
	const localidad = document.getElementById("localidad").value || "Localidad"; // Agrega 'Localidad' si está vacío
	const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna ''
	const vlan = document.getElementById("vlan").value || "XXX"; // Obtener los valores de las vlans para el aprovisionamiento en Trunk
	const Ngem = gem(); //  Se asigna el valor del gem en base al puerto lógico

	// Comando para setear si es una Datacom Función: Visualizar
	const Setear2301Visual = `onu set <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> meprof zhone-2301<br>
	`;
		
	// Comando para setear si es una Datacom Función: copiar
	const Setear2301Copiar = `onu set ${placa}/${puerto}/${puertoLogico} meprof zhone-2301\n
	`;

	// Comando para aprovisionar ONU en Bridge Función: Visualizar
	const AprovisionarBridgeVisual = `cpe system add <span class="variable-highlight">${placa}</span>/<span class="variable-highlight">${puerto}</span>/<span class="variable-highlight">${puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth 1<br>
`;
  
	// Comando para aprovisionar ONU en Bridge Función: copiar
	const AprovisionarBridgeCopiar = `cpe system add ${placa}/${puerto}/${puertoLogico} sys-common-profile Default_Cpe_System_Common\n
	bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bridged\n
	`;


  
  
	const comandosAprovisionamiento = [
	  comandosFijos, // Comandos fijos que no se modifican y van al principio
	  {
		descripcion: "Visualizar ONUs asignadas en una placa/puerto",
		comando: `onu showall ${placa}/${puerto}`,
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
	const localidad = document.getElementById("localidad").value || "Localidad"; // Agrega 'Localidad' si está vacío
	const esviejoCheckbox = document.getElementById("esviejo"); // Comprueba si el checkbox está marcado
	const esviejo = esviejoCheckbox.checked ? "-wilnet" : ""; // Le asigna un valor, si es true le asigna '' 
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
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Visualizar
	const CambiarVLANenBRIDGEVisual = `bridge delete 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${placa}</span>-<span class="variable-highlight">${puerto}</span>-<span class="variable-highlight">${puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${Ngem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${vlan}</span> tagged eth [1-4] rg-bridged<br>
`;
  
	// Comando para cambiar la VLAN (ONU en Bridge) Función: Copiar
	const CambiarVLANenBRIDGECopiar = `bridge delete 1-${placa}-${puerto}-${puertoLogico}/gpononu all\n
bridge add 1-${placa}-${puerto}-${puertoLogico}/gpononu gem 6${Ngem} gtp 1024000 downlink vlan ${vlan} tagged eth [1-4] rg-bridged\n
`;
  
 
	const comandosModificaciones = [
	  {
		descripcion: "Reiniciar ONU",
		comando: `onu reboot ${placa}/${puerto}/${puertoLogico}`,
	  },
	  {
		descripcion: "Cambiar VLAN (ONU con en Bridge)",
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