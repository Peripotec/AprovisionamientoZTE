//Función que permite copiar los comandos
function copiarComando(comando) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = comando;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
  
    // Mostrar el mensaje de copiado en el centro inferior
    const mensajeCopiado = document.createElement("div");
    mensajeCopiado.className = "copiado-mensaje";
    mensajeCopiado.textContent = "Comando copiado";
    document.body.appendChild(mensajeCopiado);
    mensajeCopiado.style.position = "fixed";
    mensajeCopiado.style.bottom = "20px";
    mensajeCopiado.style.left = "1129px";
    mensajeCopiado.style.transform = "translateX(-0%)";
    mensajeCopiado.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    mensajeCopiado.style.color = "#fff";
    mensajeCopiado.style.padding = "10px";
    mensajeCopiado.style.borderRadius = "5px";
  
    // Deja grabado el comando copiado en el textarea.
    const textarea = document.getElementById("contenido-archivo-comando");
    textarea.value = comando; // Asigna el valor del comando al textarea
    textarea.readOnly = true;
  
    // Difuminar el mensaje gradualmente
    setTimeout(() => {
        let opacity = 1;
        const fadeOutInterval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(fadeOutInterval);
            mensajeCopiado.remove(); // Eliminar el mensaje después de la animación de desvanecimiento
        } else {
            opacity -= 0.1;
            mensajeCopiado.style.opacity = opacity;
        }
        }, 100); // Difuminar gradualmente durante 1 segundo
    }, 500); // Mostrar el mensaje durante 0.5 segundo
}

  
// Función para mostrar los comandos en la página.
function mostrarComandos(comandos) {
    let descripcionYComandoText = "";
    for (const cmd of comandos) {
      descripcionYComandoText += `
        <div class="descripcion-container">
            <div class="comando" onclick="toggleComandos(this)">
                <p> <button type="button" class="btn-primary" onclick="copiarComando(\`${cmd.copiarComando || cmd.comandos || cmd.comando}\`); event.stopPropagation();">Copiar Comando</button> ${cmd.descripcion}</p>
            </div>
            <div class="contenido" style="display: none;">
                <div class="comando">
                    <p class="comando-texto">${cmd.comando || cmd.copiarComando}</p>
                </div>
            </div>
        </div>
      `;
    }
  
    const comandosContainer = document.getElementById("descripcion-y-comandos");
    comandosContainer.innerHTML = descripcionYComandoText;
}
  
function toggleComandos(descripcionContainer) {
    const contenido = descripcionContainer.nextElementSibling; // Obtener el siguiente elemento hermano
    if (contenido && contenido.classList.contains('contenido')) { // Verificar si es el div de contenido
        descripcionContainer.classList.toggle('expanded');
        contenido.style.display = contenido.style.display === "none" ? "block" : "none";
    }
}


// Comandos FIJOS que no requieren modificación
const comandosFijos = {
	descripcion: "Ver ONUs no provisionadas",
	comando: "show gpon onu uncfg"
	};
  
  // Función para obtener las VLANS para aprovisionar en Trunk
  function separarVLANs(vlanInput) {
	let vlans;
	if (vlanInput && vlanInput.includes(",")) {
	vlans = vlanInput.split(",");
	} else {
	vlans = [vlanInput];
	}
	const vlan1 = vlans[0] ? `${vlans[0]}` : "XXX";
	const vlan2 = vlans[1] ? `${vlans[1]}` : "XXX";
	const vlan3 = vlans[2] ? `${vlans[2]}` : "XXX";
	const vlan4 = vlans[3] ? `${vlans[3]}` : "XXX";
	return { vlan1, vlan2, vlan3, vlan4 };
  }
  
  // Función para asignar característica y vlans de localidades
  function caracteristicaylocalidades() {
	let select = document.getElementById("localidad");
	let selectedOption = select.options[select.selectedIndex].value;
	let caracteristica;
	let vlan;
  
	switch (selectedOption) {
	  case "rafaela":
		vlan = "XXX";
		caracteristica = "3492";
		break;
	  case "sunchales":
		vlan = "XXX";
		caracteristica = "3493";
		break;
	  case "bellaitalia":
		vlan = "XXX";
		caracteristica = "3492";
		break;
	  case "lehmann":
		vlan = "XXX";
		caracteristica = "3492";
		break;
	  case "esperanza":
		vlan = "XXX";
		caracteristica = "3496";
		break;
	  case "sanjorge":
		vlan = "XXX";
		caracteristica = "3406";
		break;
	  case "susana":
		vlan = "119";
		break;
	  case "sancarlosnorte":
		vlan = "XXX";
		vlan = "912";
		break;
	  case "santaclaradesaguier":
		vlan = "165";
		break;
	  case "sanjeronimonorte":
		vlan = "911";
		break;
	  case "sanmartindelasescobas":
		vlan = "69";
		break;
	  case "nuevotorino":
		vlan = "124";
		break;
	  // Añade casos para otras localidades si es necesario especificar VLAN o característica.
	default:
		caracteristica = "XXXX";
		vlan = "XXX";
	}
  
	const inputVLAN = document.getElementById("vlan").value;
  
	if (inputVLAN != "") {
	vlan = inputVLAN;
	}
	if (vlan == "") {
	vlan = "XXX";
	}
	if (caracteristica == "") {
	  caracteristica = "XXXX";
	}
	return { caracteristica, vlan };
  }
  
// Función para formatear la cuenta (para levantar telefonía)
function formatearCuenta() {
	const cuenta = document.getElementById("cuenta").value || ""; // Obtener el valor del input cuenta, asegurándose de tener una cadena
  
	// Validar si no se ingresó nada
	if (!cuenta) {
	  return "XXXXXXXXXX";
	}
  
	// Validar la longitud y los últimos tres caracteres
	if (cuenta.length === 10 && cuenta.slice(-3) === "000") {
	  return cuenta; // Si cumple con los requisitos, retornar el valor actual
	}
	if (cuenta.length != 10 && cuenta.slice(-3) != "000"){
		// Formatear la cuenta según las especificaciones
		const longitudDeseada = 10;
		const cerosNecesarios = longitudDeseada - cuenta.length - 3;
		const cerosInicio = "0".repeat(Math.max(cerosNecesarios, 0));
		const cuentaFormateada = cerosInicio + cuenta + "0".repeat(3);
		return cuentaFormateada;
	} else {
		return "XXXXXXXXXX";
	}
	}
  
  
  

    // Variable para almacenar el contenido original del archivo recuperado de GitHub
    let contenidoOriginal = "";

    // Comando para mostrar el bloc de notas de la carpeta raíz
    const url =
      "https://raw.githubusercontent.com/Peripotec/AprovisionamientoZTE/main/vlans.txt";
    function mostrarContenido() {
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const textarea = document.getElementById("contenido-archivo");
          contenidoOriginal = data;
          textarea.value = data;
          textarea.readOnly = true;
        })
        .catch((error) => console.error("Se ha producido un error:", error));
    }
    
    // Función para habilitar la edición
    function habilitarEdicion() {
      const textarea = document.getElementById("contenido-archivo");
	  textarea.focus(); // Pone el foco en el textarea para facilitar la escritura
      textarea.readOnly = false;
    }
	
	
	// Función para habilitar la edición del comando copiado
	function habilitarEdicionComando() {
		const textarea = document.getElementById("contenido-archivo-comando");
		textarea.focus(); // Pone el foco en el textarea para facilitar la escritura
		textarea.readOnly = false;
	}
	// Copia el comando editado
    function CopiarContenidoComando() {
		const textarea = document.getElementById("contenido-archivo-comando");
		// Selecciona el texto en el textarea
		textarea.select();
		textarea.setSelectionRange(0, 99999); // Para dispositivos móviles
		// Copia el texto al portapapeles
		document.execCommand("copy");
		// Deselecciona el texto
		textarea.setSelectionRange(0, 0);
	  }
	  
	
// Función para activar/desactivar el modo oscuro
function toggleDarkMode() {
	const htmlElement = document.documentElement;
	htmlElement.classList.toggle('dark-mode');
  
	// Guarda la preferencia del usuario en localStorage
	const isDarkModeEnabled = htmlElement.classList.contains('dark-mode');
	localStorage.setItem('darkMode', isDarkModeEnabled);
  }
  
  // Verifica la preferencia del usuario al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
	const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
	if (isDarkModeEnabled) {
	  document.documentElement.classList.add('dark-mode');
	}
  });
  