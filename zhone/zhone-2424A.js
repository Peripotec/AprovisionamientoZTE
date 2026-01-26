(function () {
	const config = {
		comandos: [
			{
				descripcion: "Encontrar puerto lógico a partir de la MAC que disca el PPPoE",
				comando: (d) => `bridge showall mac ${d.macInput || 'xx:xx:xx:xx:xx:xx'}`,
			},
			{
				descripcion: "Ver valores de la Fibra Óptica",
				comando: (d) => `onu status ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar la información de la ONU",
				comando: (d) => `onu showall ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar configuración (Si está en PPPoE o Bridge, Telefonía, etc)",
				comando: (d) => `cpe show ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Resincronizar configuración de la OLT en la ONU (elimina configuración hecha en la ONU)",
				comando: (d) => `onu resync ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Reiniciar ONU",
				comando: (d) => `onu reboot ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar las MACs aprendidas por la ONU",
				comando: (d) => `bridge showall 1-${d.placa}-${d.puerto}-${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar las MACs aprendidas por las ONU de una placa",
				comando: (d) => `bridge showall 1/${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `onu showall ${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Ver PPPoE configurado",
				comando: (d) => `cpe rg wan show ${d.placa}/${d.puerto}/${d.puertoLogico} showhidden`,
			},
		],
		aprovisionamiento: [
			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `onu showall ${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Aprovisionar Telefonía",
				comando: (d) => `bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 7<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink-p2p vlan 141 tagged cos 6 rg-bridged sip<br>
cpe voip add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/<span class="variable-highlight">${d.numpots}</span> admin-state up dial-number 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> password <span class="variable-highlight">${d.cuentaFormateada}</span></span><span class="variable-highlight">${d.telefono}</span> username 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> voip-server-profile denwa-server<br>
cpe voip modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/<span class="variable-highlight">${d.numpots}</span> admin-state up
`,
				copiarComando: (d) => `bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 7${d.gem} gtp 1024000 downlink-p2p vlan 141 tagged cos 6 rg-bridged sip\n
cpe voip add ${d.placa}/${d.puerto}/${d.puertoLogico}/${d.numpots} admin-state up dial-number 54${d.caracteristica}${d.telefono} password ${d.cuentaFormateada}${d.telefono} username 54${d.caracteristica}${d.telefono} voip-server-profile denwa-server\n
cpe voip modify ${d.placa}/${d.puerto}/${d.puertoLogico}/${d.numpots} admin-state up\n
`,
			},
			{
				descripcion: "Aprovisionar ONU con PPPoE",
				comando: (d) => `cpe system add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> vlan <span class="variable-highlight">${d.vlan}</span> pppoe-usr-id <span class="variable-highlight">${d.cuenta}-${d.cliente}@</span><span class="variable-highlight">${d.localidad}</span><span class="variable-highlight">${d.esviejoSuffix}</span>  pppoe-password <span class="variable-highlight">${d.pppoe}</span><br>
`,
				copiarComando: (d) => `cpe system add ${d.placa}/${d.puerto}/${d.puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${d.placa}/${d.puerto}/${d.puertoLogico} vlan ${d.vlan} pppoe-usr-id ${d.cuenta}-${d.cliente}@${d.localidad}${d.esviejoSuffix} pppoe-password ${d.pppoe}\n
`,
			},
			{
				descripcion: "Aprovisionar ONU en Bridge",
				comando: (d) => `cpe system add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bridged<br>
`,
				copiarComando: (d) => `cpe system add ${d.placa}/${d.puerto}/${d.puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth [1-4] rg-bridged\n
`,
			},
		],
		modificaciones: [
			{
				descripcion: "Reestablecer el CPE System (Acceso Remoto)",
				comando: (d) => `cpe system delete <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span><br>
cpe system add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> sys-common-profile Default_Cpe_System_Common
	`,
				copiarComando: (d) => `cpe system delete ${d.placa}/${d.puerto}/${d.puertoLogico}\n
cpe system add ${d.placa}/${d.puerto}/${d.puertoLogico} sys-common-profile Default_Cpe_System_Common\n
`,
			},
			{
				descripcion: "Cambiar PPPoE en ONU",
				comando: (d) => `cpe rg wan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> vlan <span class="variable-highlight">${d.vlan}</span> pppoe-usr-id <span class="variable-highlight">${d.cuenta}-${d.cliente}@</span><span class="variable-highlight">${d.localidad}</span><span class="variable-highlight">${d.esviejoSuffix}</span>  pppoe-password <span class="variable-highlight">${d.pppoe}</span><br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bridged<br>
	`,
				copiarComando: (d) => `cpe rg wan modify ${d.placa}/${d.puerto}/${d.puertoLogico} vlan ${d.vlan} pppoe-usr-id ${d.cuenta}-${d.cliente}@${d.localidad}${d.esviejoSuffix} pppoe-password ${d.pppoe}\n
`,
			},
			{
				descripcion: "Cambiar Telefonía en ONU",
				comando: (d) => `cpe voip delete <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/<span class="variable-highlight">${d.numpots}</span><br>
cpe voip add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/<span class="variable-highlight">${d.numpots}</span> admin-state up dial-number 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> password <span class="variable-highlight">${d.cuentaFormateada}</span></span><span class="variable-highlight">${d.telefono}</span> username 54<span class="variable-highlight">${d.caracteristica}</span><span class="variable-highlight">${d.telefono}</span> voip-server-profile denwa-server<br>
cpe voip modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/<span class="variable-highlight">${d.numpots}</span> admin-state up<br>
`,
				copiarComando: (d) => `cpe voip delete ${d.placa}/${d.puerto}/${d.puertoLogico}/${d.numpots}\n
cpe voip add ${d.placa}/${d.puerto}/${d.puertoLogico}/${d.numpots} admin-state up dial-number 54${d.caracteristica}${d.telefono} password ${d.cuentaFormateada}${d.telefono} username 54${d.caracteristica}${d.telefono} voip-server-profile denwa-server\n
cpe voip modify ${d.placa}/${d.puerto}/${d.puertoLogico}/${d.numpots} admin-state up\n
`,
			},
			{
				descripcion: "Cambiar VLAN (ONU con PPPoE)",
				comando: (d) => `bridge delete 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> vlan <span class="variable-highlight">${d.vlan}</span> pppoe-usr-id <span class="variable-highlight">${d.cuenta}-${d.cliente}@</span><span class="variable-highlight">${d.localidad}</span><span class="variable-highlight">${d.esviejoSuffix}</span>  pppoe-password <span class="variable-highlight">${d.pppoe}</span><br>
`,
				copiarComando: (d) => `bridge delete 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu all\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${d.placa}/${d.puerto}/${d.puertoLogico} vlan ${d.vlan} pppoe-usr-id ${d.cuenta}-${d.cliente}@${d.localidad}${d.esviejoSuffix} pppoe-password ${d.pppoe}\n
`,
			},
			{
				descripcion: "Cambiar VLAN (ONU en Bridge)",
				comando: (d) => `bridge delete 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bridged<br>
`,
				copiarComando: (d) => `bridge delete 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu all\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth [1-4] rg-bridged\n
`,
			},
			{
				descripcion: "Eliminar ONU",
				comando: (d) => `onu delete <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span><br>
yes<br>
no<br>
yes<br>
`,
				copiarComando: (d) => `onu delete ${d.placa}/${d.puerto}/${d.puertoLogico}\n
yes\n
no\n
yes\n
`,
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