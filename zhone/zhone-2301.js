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
			{
				descripcion: "Ver MACs aprendidas por el equipo",
				comando: (d) => `show mac gpon onu gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
			},
		],
		aprovisionamiento: [
			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `onu showall ${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Aprovisionar ONU en Bridge",
				comando: (d) => `cpe system add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> sys-common-profile Default_Cpe_System_Common<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth 1<br>
`,
				copiarComando: (d) => `cpe system add ${d.placa}/${d.puerto}/${d.puertoLogico} sys-common-profile Default_Cpe_System_Common\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth 1\n
`,
			},
		],
		modificaciones: [
			{
				descripcion: "Reiniciar ONU",
				comando: (d) => `onu reboot ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Cambiar VLAN (ONU con en Bridge)",
				comando: (d) => `bridge delete 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu all<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.gem}</span> gtp 1024000 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth 1<br>
`,
				copiarComando: (d) => `bridge delete 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu all\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.gem} gtp 1024000 downlink vlan ${d.vlan} tagged eth 1\n
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