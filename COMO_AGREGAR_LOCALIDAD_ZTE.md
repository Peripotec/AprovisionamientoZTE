# Guía: Cómo Agregar una Nueva Localidad en ZTE

## Archivos a Modificar
1.  `index.html` (Interfaz)
2.  `js/script.js` (Lógica)

---

## Paso 1: Modificar `index.html`

1.  Abre el archivo `index.html`.
2.  Busca el selector de localidades: `<select class="form-control" id="localidad">`.
3.  Identifica el grupo correcto (`Wiltel` o `Socios`).
4.  Agrega la nueva opción.

```html
<optgroup label="Wiltel">
  <option value="rafaela">Rafaela</option>
  <!-- AGREGA TU NUEVA LOCALIDAD AQUÍ -->
  <option value="nuevalocalidad">Nueva Localidad</option> 
</optgroup>
```

---

## Paso 2: Modificar `js/script.js`

1.  Abre `js/script.js`.
2.  Busca la función `cargarScript()`.
3.  Encontrarás una serie de bloques `if / else if (localidad === "...")`.
4.  Agrega un nuevo bloque `else if` para tu localidad.

```javascript
} else if (localidad === "nuevalocalidad") {
    // 1. Agrega la opción por defecto
    agregarOption(tipoONU, "default", "Seleccione", tipoOnu);
    
    // 2. Agrega los modelos disponibles para esta localidad
    agregarOption(tipoONU, "ZTE-F601", "ZTE F601", tipoOnu);
    agregarOption(tipoONU, "ZTEG-F660", "ZTEG F660", tipoOnu);
    // ... agrega los que necesites
}
```

## Paso 3: Verificar
Recarga `index.html`, selecciona la nueva localidad y confirma que la lista de modelos se actualice correctamente.
