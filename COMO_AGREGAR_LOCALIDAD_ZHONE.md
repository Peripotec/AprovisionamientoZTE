# Guía: Cómo Agregar una Nueva Localidad en ZHONE

## Archivos a Modificar
1.  `zhone.html` (Interfaz)
2.  `zhone/scriptZhone.js` (Lógica)

---

## Paso 1: Modificar `zhone.html`

1.  Abre el archivo `zhone.html`.
2.  Busca el selector: `<select class="form-control" id="localidad">`.
3.  Agrega la nueva opción.

```html
<select class="form-control" id="localidad">
  <option value="defaultZhone">Seleccione</option>
  <option value="rafaela" selected>Rafaela</option>
  <!-- NUEVA -->
  <option value="nuevalocalidad">Nueva Localidad</option>
</select>
```

---

## Paso 2: Modificar `zhone/scriptZhone.js`

1.  Abre `zhone/scriptZhone.js`.
2.  Busca la función `cargarScript()`.
3.  Localiza los bloques `if` de localidades.

**Opción A (Mismos equipos que otra localidad):**
```javascript
if (localidad === "rafaela" || localidad === "nuevalocalidad") {
    // ... comparte configuración
}
```

**Opción B (Equipos diferentes):**
```javascript
if (localidad === "nuevalocalidad") {
    agregarOption(tipoONU, "defaultZhone", "Seleccione", tipoOnu);
    agregarOption(tipoONU, "zhone-2301", "2301", tipoOnu);
    // ... otros equipos
}
```
