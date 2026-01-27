class CommandGenerator {
    constructor() {
        this.data = this.readFormData();
    }

    readFormData() {
        // Lectura centralizada de todos los campos posibles
        // Usamos try-catch o verificaciones para elementos que podrian no existir en ciertas vistas
        const getValue = (id, defaultVal = "x") => {
            const el = document.getElementById(id);
            return el ? (el.value || defaultVal) : defaultVal;
        };

        const getChecked = (id) => {
            const el = document.getElementById(id);
            return el ? el.checked : false;
        };

        // Lógica de formatting específica (extraida de script original)
        const formatMAC = (mac) => {
            if (!mac || mac === "xxxx.xxxx.xxxx") return "xxxx.xxxx.xxxx";
            const macClean = mac.replace(/:/g, "");
            const grupos = [];
            for (let i = 0; i < macClean.length; i += 4) {
                grupos.push(macClean.slice(i, i + 4));
            }
            return grupos.join(".");
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

        // Recopilamos datos básicos
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
            localidadKey: getValue("localidad", "Localidad"), // Para lógica interna
            vlanInput: getValue("vlan", "XXX"),
            macInput: getValue("mac"),
            isOld: getChecked("esviejo"),
            isPots2: getChecked("pots"),
            isTvActive: getChecked("tv")
        };

        // Datos derivados / formateados
        data.mac = formatMAC(data.macInput);
        data.cuentaFormateada = formatCuenta(data.cuentaOriginal);
        data.cuenta = data.cuentaOriginal || "cuenta"; // Fallback si está vacío para string interpolation

        // Lógica de Localidad (caracteristica y vlan, equivalente a caracteristicaylocalidades())
        // Importante: Esta lógica estaba hardcodeada en common.js/script.js o duplicada.
        // Vamos a intentar reutilizar la función global si existe, o implementarla aqui.
        // Por ahora, asumimos que `caracteristicaylocalidades` en `common.js` es accesible o la replicamos.
        // Dado que common.js lo define:
        if (typeof window.caracteristicaylocalidades === 'function') {
            const locData = window.caracteristicaylocalidades();
            // Si la funcion devuelve valor, usalo. Si no (caso Zhone), usa el del input.
            data.vlan = locData.vlan || data.vlanInput;
            data.caracteristica = locData.caracteristica;
        } else {
            data.vlan = data.vlanInput; // Fallback directo
            data.caracteristica = "XXXX";
        }

        // Lógica esviejo
        data.esviejo = data.isOld ? "-wilnet" : "";
        data.localidad = data.localidadKey; // Alias

        // Lógica TV
        data.tv = data.isTvActive ? "un" : "";

        // Lógica Pots
        data.numpots = data.isPots2 ? "2" : "1";

        // Lógica VLANs Trunk (separarVLANs)
        if (typeof window.separarVLANs === 'function') {
            const vlans = window.separarVLANs(data.vlanInput);
            data.vlan1 = vlans.vlan1;
            data.vlan2 = vlans.vlan2;
            data.vlan3 = vlans.vlan3;
            data.vlan4 = vlans.vlan4;
        }

        // Lógica GEM (Zhone Ngem)
        // Regla: Si vacío "00", si length < 2 pad con 0.
        const pl = data.puertoLogico === "x" ? "" : data.puertoLogico;
        if (pl.length === 0) {
            data.gem = "00";
        } else if (pl.length < 2) {
            data.gem = "0" + pl;
        } else {
            data.gem = pl;
        }
        // Alias para compatibilidad con nombre variable original 'Ngem'
        data.Ngem = data.gem;

        return data;
    }

    // Función principal para procesar una lista de plantillas
    render(templates, options = {}) {
        const result = [];

        // Agregamos comandos fijos si se solicita
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
        if (typeof template === 'function') {
            return template(this.data);
        }
        return template;
    }
}

// Exponer globalmente
window.CommandGenerator = CommandGenerator;
