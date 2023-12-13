// script2.js

async function cargarScript() {
    const select = document.getElementById("tipo-onu");
    const selectedValue = select.options[select.selectedIndex].value;

    // Elimina el script anterior si existe
    const existingScript = document.getElementById("onu-script");
    if (existingScript) {
        existingScript.remove();
    }

    try {
        // Importa el script como un módulo
        const onuModule = await import(`./js/${selectedValue}.js`);
        
        // Llama a una función específica del módulo, ajusta esto según tus necesidades
        onuModule.default(); 

        // Una vez que el script se ha cargado correctamente, habilita las funciones
        habilitarFunciones();
    } catch (error) {
        console.error("Error al cargar el script:", error);
    }
}

function habilitarFunciones() {
    // Habilita las funciones una vez que el script se ha cargado
    comandos();
    aprovisionamiento();
    modificaciones();
}
