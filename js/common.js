//Función que permite copiar los comandos modificados.
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
		<div class="descripcion-container"> <!-- Aquí agregamos el contenedor -->
		<div class="comando" style="display: flex; align-items: center; justify-content: space-between;"> <!-- Estilos para alinear y justificar el contenido -->
				<p style=" align-items: center;"><button type="button" id="btn-comandos" class="btn-primary" onclick="copiarComando(\`${
			cmd.copiarComando || cmd.comandos || cmd.comando
		  }\`)">Copiar Comando</button></p>
				<p style="flex: 1; text-align: left; font-size: 17px;">${cmd.descripcion}</p>
			</div>
			<div class="comando">
				<p class="comando-texto">${cmd.comando || cmd.copiarComando}</p>
			</div>
		</div>
		  `;
	}
  
	const comandosContainer = document.getElementById("descripcion-y-comandos");
	comandosContainer.innerHTML = descripcionYComandoText;
  
	// Evitar el desplazamiento al principio de la página al copiar
	const btns = document.querySelectorAll(".btn-copy");
	btns.forEach((btn) => {
	  btn.addEventListener("click", (event) => {
		event.preventDefault();
	  });
	});
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
	const cuenta = document.getElementById("cuenta").value; // Obtener el valor del input cuenta
	const numeroCuenta = parseInt(cuenta);
	const longitud = cuenta.length;
	const longitudDeseada = 10;
  
	const cerosNecesarios = longitudDeseada - longitud - 3;
	const cerosInicio = "0".repeat(cerosNecesarios);
	const cuentaFormateada = cerosInicio + cuenta + "0".repeat(3);
  
	if (cuentaFormateada == "0000000000") {
	  const cuentaFormateada = "XXXXXXXXXX";
	return cuentaFormateada;
	}
  
	return cuentaFormateada;
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
	  textarea.value = "";
	  textarea.focus(); // Pone el foco en el textarea para facilitar la escritura
      textarea.readOnly = false;
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
  