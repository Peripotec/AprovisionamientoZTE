# Documentación de Refactorización y Mantenibilidad

Este documento detalla los cambios estructurales realizados en el proyecto "Aprovisionamiento ZTE/Zhone" y explica por qué la nueva arquitectura es superior en términos de mantenibilidad y escalabilidad.

## 1. El Problema Original

Antes de la refactorización, el proyecto sufría de varios problemas típicos de código "legacy" o script-based:

*   **Duplicación Masiva:** Cada archivo `.js` (uno por modelo de ONU) contenía toda la lógica de validación, generación de HTML y formateo. Si se quería cambiar el estilo de un botón o corregir un error en un comando, había que editar manualmenente más de 15 archivos.
*   **Mezcla de Responsabilidades:** La definición de los comandos (los datos) estaba mezclada con la lógica de presentación (el HTML/DOM).
*   **Difícil de Escalar:** Agregar un nuevo modelo implicaba copiar y pegar un archivo existente y buscar/reemplazar con cuidado, propenso a errores humanos.

## 2. La Solución: Arquitectura Basada en Configuración

Hemos migrado de un enfoque imperativo ("haz esto, luego esto, luego imprime esto") a un enfoque declarativo ("estos son mis datos, renderízalos").

### Componentes Clave

#### A. `CommandGenerator.js` (El Motor)
Creamos una clase reutilizable que se encarga de:
1.  **Iterar** sobre una lista de comandos.
2.  **Reemplazar** las variables dinámicas (`${d.placa}`, `${d.vlan}`, etc.) en las plantillas.
3.  **Generar el HTML** consistente para todos los modelos (botones de copiar, resaltado de sintaxis, estructura visual).

**Ventaja:** Si mañana quieres cambiar el color de los comandos o agregar un botón de "copiar al portapapeles" más sofisticado, solo editas *un* archivo (`CommandGenerator.js`) y el cambio se aplica instantáneamente a los 20+ modelos.

#### B. Archivos de Modelo Refactorizados (La Configuración)
Archivos como `ZTE-F6600R.js` ahora son extremadamente limpios. Ya no contienen lógica de programación, solo contienen un objeto de configuración (`config`) con tres listas:
1.  `comandos` (Consultas)
2.  `aprovisionamiento` (Configuración)
3.  `modificaciones` (Cambios)

Cada comando es un objeto simple:
```javascript
{
    descripcion: "Ver estado de la Telefonía",
    comando: (d) => `show gpon ... ${d.puerto}...`,
}
```

**Ventaja:** Para corregir un comando en un modelo específico, vas directo a la definición del texto. No hay "ruido" de código HTML alrededor.

#### C. Unificación de Zhone
Para Zhone, unificamos la lógica común en `commonZhone.js` y usamos `scriptZhone.js` como un controlador de tráfico que carga el script correcto según la selección (Rafaela/Clucellas).

**Ventaja:** Agregar "Clucellas" fue una tarea de 3 líneas de código porque la lógica de "qué scripts cargar" ya estaba abstraída.

## 3. Por qué es "Autoadministrable"

1.  **Estandarización:** Todos los modelos siguen la misma estructura. Un desarrollador nuevo puede abrir cualquier archivo y entenderlo en segundos.
2.  **Seguridad:** Al usar una clase generadora central, reducimos el riesgo de introducir errores de sintaxis HTML (`<div>` sin cerrar, comillas rotas) en archivos individuales.
3.  **Extensibilidad:** Agregar un nuevo modelo es tan simple como crear un archivo `.js` con el objeto `config`. El sistema se encarga del resto.

## Resumen de Impacto

| Característica | Antes | Ahora |
| :--- | :--- | :--- |
| **Cambiar HTML/CSS global** | Editar 20+ archivos | Editar 1 archivo (`CommandGenerator.js`) |
| **Corregir comando específico** | Buscar entre código HTML spaghetti | Editar string simple en objeto JSON |
| **Agregar localidad Zhone** | Copiar lógica condicional compleja | Agregar opción en `scriptZhone.js` |
| **Legibilidad** | Baja (mezcla de lenguajes) | Alta (JavaScript puro y limpio) |
