(function () {
	const config = {
		comandos: [
			{
				descripcion: "Encontrar puerto lógico a partir de la MAC",
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
				descripcion: "Visualizar configuración",
				comando: (d) => `cpe show ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Visualizar ONUs asignadas en una placa/puerto",
				comando: (d) => `onu showall ${d.placa}/${d.puerto}`,
			},
			{
				descripcion: "Reiniciar ONU",
				comando: (d) => `onu reboot ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			}
		],
		aprovisionamiento: [
			{
				descripcion: "Aprovisionar ONU con PPPoE (Sastre)",
				comando: (d) => `cpe system add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> sys-common-profile 1<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.puertoLogico}</span> gtp 30720 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged eth [1-4] rg-bpppoe<br>
cpe rg wan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> vlan <span class="variable-highlight">${d.vlan}</span> pppoe-usr-id <span class="variable-highlight">${d.cuenta}-${d.cliente}@sastre</span> pppoe-password <span class="variable-highlight">${d.pppoe}</span><br>
cpe wlan add <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/1  wlan-com-profile 1<br>
cpe wlan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>/1 ssid Wifi_Wiltel encrypt-key 12345678<br>
cpe rg wan modify <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span> vlan <span class="variable-highlight">${d.vlan}</span> ip-com-profile 3<br>
bridge add 1-<span class="variable-highlight">${d.placa}</span>-<span class="variable-highlight">${d.puerto}</span>-<span class="variable-highlight">${d.puertoLogico}</span>/gpononu gem 6<span class="variable-highlight">${d.puertoLogico}</span> gtp 30720 downlink vlan <span class="variable-highlight">${d.vlan}</span> tagged wlan 1 rg-bpppoe<br>
`,
				copiarComando: (d) => `cpe system add ${d.placa}/${d.puerto}/${d.puertoLogico} sys-common-profile 1\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.puertoLogico} gtp 30720 downlink vlan ${d.vlan} tagged eth [1-4] rg-bpppoe\n
cpe rg wan modify ${d.placa}/${d.puerto}/${d.puertoLogico} vlan ${d.vlan} pppoe-usr-id ${d.cuenta}-${d.cliente}@sastre pppoe-password ${d.pppoe}\n
cpe wlan add ${d.placa}/${d.puerto}/${d.puertoLogico}/1  wlan-com-profile 1\n
cpe wlan modify ${d.placa}/${d.puerto}/${d.puertoLogico}/1 ssid Wifi_Wiltel encrypt-key 12345678\n
cpe rg wan modify ${d.placa}/${d.puerto}/${d.puertoLogico} vlan ${d.vlan} ip-com-profile 3\n
bridge add 1-${d.placa}-${d.puerto}-${d.puertoLogico}/gpononu gem 6${d.puertoLogico} gtp 30720 downlink vlan ${d.vlan} tagged wlan 1 rg-bpppoe\n
`,
			}
		],
		modificaciones: [
			{
				descripcion: "Eliminar ONU",
				comando: (d) => `onu delete <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>`,
				copiarComando: (d) => `onu delete ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			},
			{
				descripcion: "Reiniciar ONU",
				comando: (d) => `onu reboot <span class="variable-highlight">${d.placa}</span>/<span class="variable-highlight">${d.puerto}</span>/<span class="variable-highlight">${d.puertoLogico}</span>`,
				copiarComando: (d) => `onu reboot ${d.placa}/${d.puerto}/${d.puertoLogico}`,
			}
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