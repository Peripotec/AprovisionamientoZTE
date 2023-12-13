// script2.js

function cargarScript() {
    const select = document.getElementById("tipo-onu");
    const selectedValue = select.options[select.selectedIndex].value;

    // Elimina el script anterior si existe
    const existingScript = document.getElementById("onu-script");
    if (existingScript) {
        existingScript.remove();
    }

    // Crea y carga el nuevo script
    const newScript = document.createElement("script");
    newScript.id = "onu-script";
    newScript.type = "module";
    const scriptPath = `js/${selectedValue}.js`; // Ruta relativa a la carpeta que contiene 'js'
    console.log("Script Path:", scriptPath);
    newScript.src = scriptPath;
    document.head.appendChild(newScript);
}
