# Guía de Administración Simplificada

Gracias a la última actualización, agregar localidades y modelos ahora es infinitamente más sencillo. Ya no necesitas tocar códigos HTML ni lógica compleja.

Todo se controla desde dos archivos de configuración.

---

## 1. Administrar ZTE (`js/ConfigZTE.js`)

Abre el archivo `js/ConfigZTE.js`. Verás algo como esto:

```javascript
export const organizacion = {
    "Wiltel": {
        "rafaela": ["ZTE-F601", "ZTEG-F660", ...],
        // ...
    },
    // ...
};
```

### Para agregar una localidad:
Simplemente agrega una línea con el nombre de la localidad y la lista de modelos que quieres que aparezcan.

```javascript
"miden”: ["ZTE-F601", "ZTE-F6600R"], // ¡Listo!
```

### Para agregar un modelo nuevo:
1. Crea tu archivo `.js` del modelo en la carpeta `js/`.
2. Registralo en la lista `modelos` al principio del archivo `ConfigZTE.js`:

```javascript
export const modelos = {
    // ...
    "ZTE-NUEVO": "Nombre Visible en Pantalla",
};
```
3. Agrégalo a las localidades que lo usen.

---

## 2. Administrar Zhone (`zhone/ConfigZhone.js`)

Abre el archivo `zhone/ConfigZhone.js`. Funciona exactamente igual.

```javascript
export const organizacion = {
    "rafaela": ["zhone-2301", ...],
    "nuevalocalidad": ["zhone-2301", "DM984-100B"] // ¡Listo!
};
```

---

## Resumen
*   **Olvídate de `index.html` y `script.js`.**
*   Edita solo los archivos que empiezan con `Config...`.
*   El sistema se encarga de dibujar los menús y cargar los scripts automáticamente.

---

## 3. Personalizar un Modelo (Puertos, CATV, WiFi)

Si necesitas definir cuántos puertos tiene una ONU, si lleva configuración de TV (RF) o qué modos soporta (Bridge/Router), **debes editar el archivo `.js` del modelo** (ej. `js/ZTE-F660.js`).

No hay un "interruptor" global porque cada equipo usa comandos distintos. Tú tienes el control total escribiendo los comandos exactos.

### Ejemplo: Agregar Configuración de TV (CATV)

Abre el archivo del modelo y busca la sección `aprovisionamiento`. Agrega un nuevo bloque con el comando para activar el RF.

```javascript
aprovisionamiento: [
    {
        descripcion: "Configurar Internet (PPPoE)",
        comando: (d) => `...`
    },
    // AGREGAR ESTO:
    {
        descripcion: "Activar Salida de RF (CATV)",
        comando: (d) => `configure terminal<br>
interface gpon-onu_1/${d.placa}/${d.puerto}:${d.puertoLogico}<br>
video-service enable<br> // Comando ejemplo
exit`,
        copiarComando: (d) => `configure terminal\nvideo-service enable\nexit`
    }
]
```

### Ejemplo: Definir Cantidad de Puertos Ethernet

Si el equipo tiene 4 puertos y quieres configurarlos todos, simplemente escribe las líneas correspondientes en el comando:

```javascript
comando: (d) => `...
// Configurar 4 puertos
vlan port eth_0/1 mode tag vlan ${d.vlan}
vlan port eth_0/2 mode tag vlan ${d.vlan}
vlan port eth_0/3 mode tag vlan ${d.vlan}
vlan port eth_0/4 mode tag vlan ${d.vlan}
...`
```

### Ejemplo: Modalidades (Bridge vs Router)

Las opciones que aparecen en los botones "Aprovisionamiento" (ej. "Aprovisionar PPPoE" vs "Aprovisionar Bridge") son simplemente elementos en la lista `aprovisionamiento`.

*   Para **agregar** una modalidad: Copia y pega un bloque entero `{ descripcion: "...", comando: ... }`.
*   Para **quitar** una modalidad: Borra el bloque correspondiente.

De esta forma, puedes tener un modelo que solo permita Bridge, u otro que permita 3 configuraciones distintas. Tú defines las "modalidades" creando las opciones en la lista.
