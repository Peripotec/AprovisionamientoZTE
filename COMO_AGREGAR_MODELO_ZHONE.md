# Guía: Cómo Agregar un Nuevo Modelo en ZHONE

## Archivos a Modificar
1.  Carpeta `zhone/` (Crear archivo `.js`)
2.  `zhone.html` (Interfaz)

---

## Paso 1: Crear el Script del Modelo

1.  Crea un archivo nuevo en la carpeta `zhone/`. Ejemplo: `zhone-NUEVO.js`.
2.  Usa la plantilla base estándar (igual que en ZTE, pero guardada en carpeta `zhone/`).

```javascript
(function() {
    const config = {
        comandos: [ ... ],
        aprovisionamiento: [ ... ],
        modificaciones: [ ... ]
    };
    // ... window.comandos, window.aprovisionamiento ...
})();
```

## Paso 2: Registrar en `zhone.html`

1.  Abre `zhone.html`.
2.  Busca `<select id="tipo-onu">`.
3.  Agrega la opción.

```html
<select class="form-control" id="tipo-onu">
   <option value="zhone-NUEVO">Modelo Nuevo Visual</option>
</select>
```

> **Nota:** Al igual que en ZTE, recuerda activar este modelo para las localidades correspondientes en `zhone/scriptZhone.js`, o no aparecerá habilitado cuando selecciones la localidad.
