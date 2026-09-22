class CommandGenerator {
    constructor() {
        this.data = this.readFormData();
    }

    readFormData() {
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

        const templatesToRender = Array.isArray(templates) ? [...templates] : [];
        const isModificaciones = templatesToRender.some(t => 
            t.descripcion && (t.descripcion.includes("PPPoE") || t.descripcion.includes("Reiniciar") || t.descripcion.includes("VLAN") || t.descripcion.includes("Resetear"))
        );

        if (isModificaciones && !templatesToRender.some(t => t.descripcion === "Cambiar perfil navegable")) {
            const CambiarPerfilNavegableVisual = `configure terminal<br>
<b>interface gpon-onu_1/<span class="variable-highlight">${this.data.placa}</span>/<span class="variable-highlight">${this.data.puerto}</span>:<span class="variable-highlight">${this.data.puertoLogico}</span><br></b>
tcont 1 name 1 profile <span class="variable-highlight">35UP</span><br>
gemport 1 traffic-limit downstream <span class="variable-highlight">300DOWN</span><br>
traffic-profile <span class="variable-highlight">35MUP</span> vport 1 direction ingress<br>
traffic-profile <span class="variable-highlight">300MDW</span> vport 1 direction egress<br>
exit<br>
exit<br>`;

            const CambiarPerfilNavegableCopiar = `configure terminal\ninterface gpon-onu_1/${this.data.placa}/${this.data.puerto}:${this.data.puertoLogico}\ntcont 1 name 1 profile 35UP\ngemport 1 traffic-limit downstream 300DOWN\ntraffic-profile 35MUP vport 1 direction ingress\ntraffic-profile 300MDW vport 1 direction egress\nexit\nexit\n`;

            const insertIndex = templatesToRender.findIndex(t => t.descripcion && t.descripcion.includes("Resetear"));
            if (insertIndex !== -1) {
                templatesToRender.splice(insertIndex + 1, 0, {
                    descripcion: "Cambiar perfil navegable",
                    comando: CambiarPerfilNavegableVisual,
                    copiarComando: CambiarPerfilNavegableCopiar
                });
            } else {
                templatesToRender.push({
                    descripcion: "Cambiar perfil navegable",
                    comando: CambiarPerfilNavegableVisual,
                    copiarComando: CambiarPerfilNavegableCopiar
                });
            }
        }

        for (const tpl of templatesToRender) {
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
        const isHtml = str.includes('<br>');

        // 1. Corrección e inyección de tcont 1 profile para TELEFONÍA
        if (str.includes("service voip gemport 2") || (str.includes("vport 2") && str.includes("vlan 141"))) {
            const tcontVis = `tcont 1 name 1 profile <span class="variable-highlight">${this.data.profileUp}</span><br>`;
            const tcontCop = `tcont 1 name 1 profile ${this.data.profileUp}\n`;

            // Limpieza de estructuras viejas (tcont 2) e inyección de tcont 1
            str = str.replace(
                /(?:sn-bind enable sn<br>\s*)?tcont 2 name 2 profile [^\n<]+<br>\s*gemport 2 tcont 2<br>\s*(?:switchport mode hybrid vport 2<br>\s*)?/g,
                `${tcontVis}gemport 2 tcont 1<br>gemport 2 traffic-limit upstream VOIP downstream VOIP<br>`
            );
            str = str.replace(
                /(?:sn-bind enable sn\n\s*)?tcont 2 name 2 profile [^\n]+\n\s*gemport 2 tcont 2\n\s*(?:switchport mode hybrid vport 2\n\s*)?/g,
                `${tcontCop}gemport 2 tcont 1\ngemport 2 traffic-limit upstream VOIP downstream VOIP\n`
            );

            // Inyección si no tenía tcont 1 name 1 profile
            if (isHtml) {
                if (!str.includes("tcont 1 name 1 profile")) {
                    str = str.replace(/gemport 2 tcont 1<br>/g, `${tcontVis}gemport 2 tcont 1<br>`);
                }
                if (!str.includes("traffic-limit upstream VOIP")) {
                    str = str.replace(/gemport 2 tcont 1<br>/g, `gemport 2 tcont 1<br>gemport 2 traffic-limit upstream VOIP downstream VOIP<br>`);
                }
            } else {
                if (!str.includes("tcont 1 name 1 profile")) {
                    str = str.replace(/gemport 2 tcont 1\n/g, `${tcontCop}gemport 2 tcont 1\n`);
                }
                if (!str.includes("traffic-limit upstream VOIP")) {
                    str = str.replace(/gemport 2 tcont 1\n/g, `gemport 2 tcont 1\ngemport 2 traffic-limit upstream VOIP downstream VOIP\n`);
                }
            }

            str = str.replace(/profile denwaSIP/g, 'profile wiltelvoip');
        }

        // 2. Reemplazo de profileUp SOLO para tcont 1
        if (this.data.profileUp) {
            str = str.replace(
                /(tcont 1 name 1 profile )(?:<span class="variable-highlight">)?[^<\s\n]+(?:<\/span>)?/g,
                (match, p1) => isHtml ? `${p1}<span class="variable-highlight">${this.data.profileUp}</span>` : `${p1}${this.data.profileUp}`
            );
        }

        // 3. Reemplazo de profileDown para gemport 1 (PPPoE / Datos)
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
                str = str.replace(
                    /(gemport 1 traffic-limit downstream )(?:<span class="variable-highlight">)?[^<\s\n]+(?:<\/span>)?/g,
                    (match, p1) => isHtml ? `${p1}<span class="variable-highlight">${this.data.profileDown}</span>` : `${p1}${this.data.profileDown}`
                );
            }
        }

        // 4. Inserción / Reemplazo de traffic-profile ingress y egress en vport 1 (PPPoE)
        if (this.data.trafficProfileUp && this.data.trafficProfileDown) {
            const trafficVis = `traffic-profile <span class="variable-highlight">${this.data.trafficProfileUp}</span> vport 1 direction ingress<br>traffic-profile <span class="variable-highlight">${this.data.trafficProfileDown}</span> vport 1 direction egress<br>`;
            const trafficCop = `traffic-profile ${this.data.trafficProfileUp} vport 1 direction ingress\ntraffic-profile ${this.data.trafficProfileDown} vport 1 direction egress\n`;

            if (str.includes("pppoe-intermediate-agent enable vport 1") && !str.includes("traffic-profile")) {
                str = str.replace(/pppoe-intermediate-agent enable vport 1<br>/g, `pppoe-intermediate-agent enable vport 1<br>${trafficVis}`);
                str = str.replace(/pppoe-intermediate-agent enable vport 1\n/g, `pppoe-intermediate-agent enable vport 1\n${trafficCop}`);
            } else if (str.includes("traffic-profile")) {
                str = str.replace(
                    /traffic-profile (?:<span class="variable-highlight">)?[^<\s\n]+(?:<\/span>)? vport 1 direction ingress/g,
                    () => isHtml ? `traffic-profile <span class="variable-highlight">${this.data.trafficProfileUp}</span> vport 1 direction ingress` : `traffic-profile ${this.data.trafficProfileUp} vport 1 direction ingress`
                );
                str = str.replace(
                    /traffic-profile (?:<span class="variable-highlight">)?[^<\s\n]+(?:<\/span>)? vport 1 direction egress/g,
                    () => isHtml ? `traffic-profile <span class="variable-highlight">${this.data.trafficProfileDown}</span> vport 1 direction egress` : `traffic-profile ${this.data.trafficProfileDown} vport 1 direction egress`
                );
            }
        }

        return str;
    }
}

window.CommandGenerator = CommandGenerator;
