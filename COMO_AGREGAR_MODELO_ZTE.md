# Guía: Cómo Agregar un Nuevo Modelo en ZTE

## Archivos a Modificar
1.  Carpeta `js/` (Crear archivo `.js`)
2.  `index.html` (Interfaz)

---

## Paso 1: Crear el Script del Modelo

1.  Crea un archivo nuevo en la carpeta `js/`. Ejemplo: `ZTE-NUEVO.js`.
2.  Usa esta plantilla base (patrón CommandGenerator):

```javascript
(function() {
    const config = {
        comandos: [
             {
                descripcion: "Ejemplo comando",
                comando: (d) => `show gpon ... ${d.numeroSerie}`,
            }
        ],
        aprovisionamiento: [
            // ... comandos de aprovisionamiento
        ],
        modificaciones: [
            // ... comandos de modificaciones
        ]
    };

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

## Paso 2: Registrar en `index.html`

1.  Abre `index.html`.
2.  Busca `<select id="tipo-onu">`.
3.  Agrega la opción. El `value` debe ser **idéntico** al nombre de tu archivo (sin `.js`).

```html
<select class="form-control" id="tipo-onu">
   <!-- ... -->
   <option value="ZTE-NUEVO">Modelo Nuevo Visual</option>
</select>
```

> **Nota Importante:** Si la localidad seleccionada filtra los modelos (ver `js/script.js`), asegúrate de agregar también este modelo a la lista de esa localidad en `js/script.js` (ver guía de Localidades).
