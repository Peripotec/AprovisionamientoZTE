# Guía Práctica: Cómo Agregar un Nuevo Modelo de equipo (ZTE o Zhone)

¡Hola! Si eres nuevo en este proyecto y necesitas agregar un modelo de ONU que acaba de llegar, llegaste al lugar indicado. Esta guía te llevará paso a paso.

Nuestra aplicación utiliza un sistema de **Plantillas**. Esto significa que tú no tienes que preocuparte por leer los datos de la pantalla (`document.getElementById...`), de eso se encarga el "Motor" (`CommandGenerator.js`). Tú solo tienes que crear un archivo con los comandos y usar variables (ej. `${d.placa}`).

---

## 📘 Diccionario de Variables (El objeto `d`)

Cuando escribes un comando, tienes a tu disposición todas estas "fichas de Lego" listas para usar. El motor las extrae de la pantalla y te las entrega formateadas:

| Variable en plantilla | ¿Qué contiene? | Ejemplo de salida | Origen |
| :--- | :--- | :--- | :--- |
| `d.placa` | El número de placa de la OLT | `1` | Input "Placa" |
| `d.puerto` | El puerto PON de la placa | `2` | Input "Puerto" |
| `d.puertoLogico` | El ID de la ONU en ese puerto | `20` | Input "P. Lógico" |
| `d.gem` / `d.Ngem` | Gemport (agrega '0' si es < 10) | `05` o `20` | Calculado del P. Lógico |
| `d.numeroSerie` | El serial de la ONU ZTE | `ZTEGCXXXXXXX`| Input "Nº SERIE" |
| `d.mac` | La MAC de la ONU Zhone formateada | `xxxx.xxxx.xxxx`| Input "MAC" |
| `d.vlan` | La VLAN a asignar | `165` | Autocalculada por Localidad |
| `d.telefono` | El número de teléfono del cliente | `503391` | Input "Teléfono" |
| `d.caracteristica` | El prefijo telefónico | `3492` | Autocalculado por Localidad |
| `d.cuentaFormateada`| La cuenta con ceros rellenados | `0035969000` | Input "Cuenta" |
| `d.esviejoSuffix` | Sufijo para usuarios viejos PPPoE | `-wilnet` o ` ` | Checkbox "¿Es Viejo?" |
| `d.numpots` | El puerto de telefonía física | `1` o `2` | Checkbox "¿Pots 2?" |

> **Tip:** Puedes ver todas estas variables en el archivo `js/CommandGenerator.js` en la función `readFormData()`.

---

## 🚀 Paso 1: Crear el Archivo de Comandos

1. Crea un archivo nuevo en la carpeta `js/` (para ZTE) o `zhone/` (para Zhone). 
   * Ejemplo: `ZTE-F601-NUEVO.js`.
2. Copia y pega esta plantilla base (no cambies la estructura, solo los comandos adentro):

```javascript
(function() {
    // 1. Aquí defines TODOS los comandos que necesita tu modelo
    const config = {
        comandos: [
             {
                descripcion: "Ver estado óptico de la ONU",
                comando: (d) => `show gpon onu detail-info gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}`,
            }
        ],
        aprovisionamiento: [
             {
                descripcion: "Aprovisionamiento Básico (Bridge)",
                // Nota cómo usamos las variables con ${d.nombre_variable}
                comando: (d) => `pon-onu-mng gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}\n` + 
                                `  vlan port eth_0/1 mode tag vlan ${d.vlan}\n`
            }
        ],
        modificaciones: [
             {
                descripcion: "Borrar la ONU",
                comando: (d) => `configure terminal\n` + 
                                `interface gpon-olt_1/${d.placa}/${d.puerto}\n` +
                                `  no onu ${d.puertoLogico}\n`
            }
        ]
    };

    // 2. ¡NO TOQUES ESTA PARTE! Es la que conecta tus comandos con la pantalla.
    window.comandos = function() {
        const gen = new CommandGenerator();
        mostrarComandos(gen.render(config.comandos, { includeFixed: true }));
    }

    window.aprovisionamiento = function() {
        const gen = new CommandGenerator();
        mostrarComandos(gen.render(config.aprovisionamiento, { includeFixed: true }));
    }

    window.modificaciones = function() {
        const gen = new CommandGenerator();
        mostrarComandos(gen.render(config.modificaciones));
    }
})();
```

---

## 🌐 Paso 2: Registrar el Modelo en la Interfaz

Para que tu modelo aparezca en el menú desplegable de la página:

1. Abre el archivo de configuración base:
   - Para **ZTE**: `js/Config.js`
   - Para **Zhone**: `zhone/ConfigZhone.js`

2. Busca el diccionario `modelos` y agrega tu nuevo modelo. El _valor_ de la izquierda DEBE ser el nombre exacto de tu archivo `.js` (sin la extensión), y el de la derecha es lo que leerá el humano en pantalla.
   
```javascript
export const modelos = {
    // NombreArchivo: "Nombre Bonito en Pantalla",
    "ZTE-F601-NUEVO": "ZTE F601 (Nueva Versión)",
};
```

3. Busca el diccionario `organizacion` en el mismo archivo y colócalo debajo de las localidades donde este router vaya a ser utilizado.
```javascript
export const organizacion = {
    "rafaela": [
        "ZTE-F601-NUEVO", // <-- Agregas tu modelo a Rafaela
        "ZTE-F6600R"
    ]
}
```

¡Y listo! Al recargar la página seleccionas "Rafaela" y verás tu nuevo modelo disponible, autocompletando todas las variables mágicamente gracias al `CommandGenerator`.
