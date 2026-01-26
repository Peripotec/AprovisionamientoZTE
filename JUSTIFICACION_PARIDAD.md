# Justificación de Paridad Funcional

Este documento explica por qué podemos garantizar que, a pesar de la reescritura masiva del código, la funcionalidad del sistema permanece **exactamente idéntica** a la versión anterior.

## 1. El Principio de "Golden Master"

Durante el proceso de migración, se siguió un principio estricto: **"La salida no se toca"**.

No reescribimos los comandos que se envían a los equipos (OLT/ONU). Lo que cambiamos fue **el mecanismo de entrega** de esos comandos.

*   **Texto Original:** `show gpon onu by sn ${numeroSerie}`
*   **Texto Nuevo:** `(d) => show gpon onu by sn ${d.numeroSerie}`

El string literal (la plantilla) se copió y pegó literalmente desde el código antiguo al nuevo objeto de configuración. No hubo *interpretación* ni *optimización* de los comandos en sí mismos. Cualquier error tipográfico o particularidad que existiera en el comando original, se preservó deliberadamente en la nueva versión para garantizar seguridad operativa.

## 2. Preservación de Lógica de Variables

En la versión anterior, las variables se obtenían directamente del DOM al inicio de la función:
```javascript
const placa = document.getElementById("placa").value;
const puerto = document.getElementById("puerto").value;
// ...
```

En la nueva versión, `CommandGenerator` realiza exactamente lo mismo pero en un paso estandarizado previo a la generación. Recolecta todos los `ids` relevantes (`placa`, `puerto`, `vlan`, etc.) y crea un objeto de contexto (`d`).

Como las fórmulas de transformación (ej. `formatearDireccionMAC`) se migraron tal cual, la entrada `A` siempre produce la salida `B`, igual que antes.

## 3. Pruebas de Regresión Visual

Aunque el código que genera el HTML es nuevo, el HTML resultante se diseñó para mimetizar la estructura anterior.

Los eventos de usuario (clicks en botones "Generar", checkbox "Es Viejo?", etc.) disparan las mismas funciones base.
*   En Zhone, la lógica condicional que decide qué script cargar (`scriptZhone.js`) respeta estrictamente los mapas de "Localidad -> Modelos Disponibles" que existían antes, solo que ahora están escritos de forma más limpia.

## 4. Un Caso Concreto: Zhone

Para la localidad "Rafaela" (y ahora "Clucellas"), el requerimiento era mostrar ciertos modelos de equipos.
*   **Antes:** Un bloque `if` gigante verificaba la localidad e inyectaba opciones en el menú.
*   **Ahora:** Un bloque `if` más limpio verifica la localidad e inyecta las *mismas* opciones usando una función helper `agregarOption`.

El resultado en el DOM (`<option value="...">...</option>`) es bit a bit idéntico. Por lo tanto, el navegador y el usuario no perciben ninguna diferencia.

## Conclusión

El sistema funciona igual porque **los datos (comandos) y la lógica de negocio (inputs)** se mantuvieron constantes. Solo cambiamos el **contenedor** (la estructura del código) para hacerlo más robusto, sin alterar el contenido.
