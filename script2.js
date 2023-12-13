// script2.js

function cargarScript() {
    const select = document.getElementById("tipo-onu");
    const selectedValue = select.options[select.selectedIndex].value;

    // Elimina el script anterior si existe
    const existingScript = document.getElementById("onu-script");
    if (existingScript) {
        existingScript.remove();
    }

    // Crea y carga el nuevo script de forma asincrónica
    const newScript = document.createElement("script");
    newScript.id = "onu-script";
    newScript.type = "module";
    const scriptPath = `js/${selectedValue}.js`; // Ruta relativa a la carpeta que contiene 'js'
    console.log("Script Path:", scriptPath);
    newScript.src = scriptPath;
    newScript.onload = () => {
        // Una vez que el script se ha cargado correctamente, habilita las funciones
        habilitarFunciones();
    };
    document.head.appendChild(newScript);
}

function habilitarFunciones() {
    // Habilita las funciones una vez que el script se ha cargado
    document.getElementById("comandos-btn").onclick = comandos;
    document.getElementById("aprovisionamiento-btn").onclick = aprovisionamiento;
    document.getElementById("modificaciones-btn").onclick = modificaciones;
}
