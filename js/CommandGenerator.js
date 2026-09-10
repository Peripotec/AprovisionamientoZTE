class CommandGenerator {
    constructor() {
        this.data = this.readFormData();
    }

    readFormData() {
        // Lectura centralizada de todos los campos posibles
        const getValue = (id, defaultVal = "x") => {
            const el = document.getElementById(id);
            return el ? (el.value || defaultVal) : defaultVal;
        };

        const getChecked = (id) => {
            const el = document.getElementById(id);
            return el ? el.checked : false;
        };

        const formatMAC = (mac) => {
            if (!mac || mac === "xxxx.xxxx.xxxx") return "xxxx.xxxx.xxxx";
            const macClean = mac.replace(/:/g, "");
            const grupos = [];
            for (let i = 0; i < macClean.length; i += 4) {
                grupos.push(macClean.slice(i, i + 4));
            }
            return grupos.join(".");
        };

        const formatSSID = (ssid) => {
            if (!ssid) return "WiFi_ONT";
            return ssid.replace(/\s+/g, "_");
        };

        const formatCuenta = (cuenta) => {
            if (!cuenta) return "XXXXXXXXXX";
            if (cuenta.length === 10 && cuenta.slice(-3) === "000") return cuenta;
            if (cuenta.length !== 10 && cuenta.slice(-3) !== "000") {
                const longitudDeseada = 10;
                const cerosNecesarios = longitudDeseada - cuenta.length - 3;
                const cerosInicio = "0".repeat(Math.max(cerosNecesarios, 0));
                return cerosInicio + cuenta + "0".repeat(3);
            }
            return "XXXXXXXXXX";
        };

        const data = {
            placa: getValue("placa"),
            puerto: getValue("puerto"),
            puertoLogico: getValue("puerto-logico"),
            tipoONU: getValue("tipo-onu", "ZTEX-FXXX"),
            numeroSerie: getValue("no-serie", "ZTEGCXXXXXXX"),
            telefono: getValue("telefono", "XXXXXX"),
            cuentaOriginal: getValue("cuenta"),
            cliente: getValue("cliente", "cliente"),
            pppoe: getValue("clave-pppoe", "AAA000AA"),
            localidadKey: getValue("localidad", "Localidad"),
            vlanInput: getValue("vlan", "XXX"),
            macInput: getValue("mac"),
            wifiSsidInput: getValue("wifi-ssid"),
            wifiPassword: getValue("wifi-password", "Contraseña123"),
            isOld: getChecked("esviejo"),
            isPots2: getChecked("pots"),
            isTvActive: getChecked("tv"),
            perfilInput: getValue("perfil", "Seleccione")
        };

        // Perfil / Plan seleccionado o valores Por Defecto
        if (data.perfilInput && data.perfilInput !== "Seleccione") {
            const parts = data.perfilInput.split("x");
            if (parts.length === 2) {
                const down = parts[0];
                const up = parts[1];
                data.profileUp = `${up}UP`;
                data.profileDown = `${down}DOWN`;
                data.trafficProfileUp = `${up}MUP`;
                data.trafficProfileDown = `${down}MDW`;
            }
        } else {
            // Valores predeterminados si no se selecciona ningún perfil en el desplegable
            data.profileUp = "35UP";
            data.profileDown = "300DOWN";
            data.trafficProfileUp = "35MUP";
            data.trafficProfileDown = "300MDW";
        }

        data.mac = formatMAC(data.macInput);
        data.wifiSsid = formatSSID(data.wifiSsidInput);
        data.cuentaFormateada = formatCuenta(data.cuentaOriginal);
        data.cuenta = data.cuentaOriginal || "cuenta";

        if (typeof window.caracteristicaylocalidades === 'function') {
            const locData = window.caracteristicaylocalidades();
            data.vlan = locData.vlan || data.vlanInput;
            data.caracteristica = locData.caracteristica;
        } else {
            data.vlan = data.vlanInput;
            data.caracteristica = "XXXX";
        }

        data.esviejo = data.isOld ? "-wilnet" : "";
        data.esviejoSuffix = data.esviejo;
        data.localidad = data.localidadKey;
        data.tv = data.isTvActive ? "un" : "";
        data.numpots = data.isPots2 ? "2" : "1";

        if (typeof window.separarVLANs === 'function') {
            const vlans = window.separarVLANs(data.vlanInput);
            data.vlan1 = vlans.vlan1;
            data.vlan2 = vlans.vlan2;
            data.vlan3 = vlans.vlan3;
            data.vlan4 = vlans.vlan4;
        }

        const pl = data.puertoLogico === "x" ? "" : data.puertoLogico;
        if (pl.length === 0) {
            data.gem = "00";
        } else if (pl.length < 2) {
            data.gem = "0" + pl;
        } else {
            data.gem = pl;
        }
        data.Ngem = data.gem;

        return data;
    }

    render(templates, options = {}) {
        const result = [];
        if (options.includeFixed && typeof window.comandosFijos !== 'undefined') {
            result.push(window.comandosFijos);
        }

        for (const tpl of templates) {
            result.push({
                descripcion: tpl.descripcion,
                comando: this.interpolate(tpl.comando),
                copiarComando: tpl.copiarComando ? this.interpolate(tpl.copiarComando) : undefined
            });
        }
        return result;
    }

    interpolate(template) {
        if (!template) return "";
        let str = (typeof template === 'function') ? template(this.data) : template;

        if (this.data.profileUp) {
            str = str.replace(/profile 1G/g, `profile ${this.data.profileUp}`);
            str = str.replace(/profile \d+UP/g, `profile ${this.data.profileUp}`);
        }

        if (this.data.profileDown) {
            if (!str.includes("traffic-limit downstream")) {
                str = str.replace(
                    /gemport 1 tcont 1<br>/g,
                    `gemport 1 tcont 1<br>gemport 1 traffic-limit downstream <span class="variable-highlight">${this.data.profileDown}</span><br>`
                );
                str = str.replace(
                    /gemport 1 tcont 1\n/g,
                    `gemport 1 tcont 1\ngemport 1 traffic-limit downstream ${this.data.profileDown}\n`
                );
            } else {
                str = str.replace(/downstream \d+DOWN/g, `downstream ${this.data.profileDown}`);
            }
        }

        if (this.data.trafficProfileUp && this.data.trafficProfileDown) {
            const trafficVis = `traffic-profile <span class="variable-highlight">${this.data.trafficProfileUp}</span> vport 1 direction ingress<br>traffic-profile <span class="variable-highlight">${this.data.trafficProfileDown}</span> vport 1 direction egress<br>`;
            const trafficCop = `traffic-profile ${this.data.trafficProfileUp} vport 1 direction ingress\n` +
                               `traffic-profile ${this.data.trafficProfileDown} vport 1 direction egress\n`;

            if (!str.includes("traffic-profile")) {
                str = str.replace(/pppoe-intermediate-agent enable vport 1<br>/g, `pppoe-intermediate-agent enable vport 1<br>${trafficVis}`);
                str = str.replace(/pppoe-intermediate-agent enable vport 1\n/g, `pppoe-intermediate-agent enable vport 1\n${trafficCop}`);
            } else {
                str = str.replace(/traffic-profile [^\s]+ vport 1 direction ingress/g, `traffic-profile ${this.data.trafficProfileUp} vport 1 direction ingress`);
                str = str.replace(/traffic-profile [^\s]+ vport 1 direction egress/g, `traffic-profile ${this.data.trafficProfileDown} vport 1 direction egress`);
            }
        }

        return str;
    }
}

window.CommandGenerator = CommandGenerator;
