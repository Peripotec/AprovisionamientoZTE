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
	descripcion: "Ver provisión de ONUs",
	comando: "log cache grep assigned"
	};
    
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

    // Función para formatear puerto lógico y agregar un 0 si es un sólo digito el p. lógico (para levantar telefonía)
function gem() {
	const gem = document.getElementById("puerto-logico").value; // Obtener el valor del input gem
	const numerogem = parseInt(gem);
	const longitud = gem.length;
	const longitudDeseada = 2;

	if (longitud === 0) {
		// Si no se ha ingresado nada, devolver "00"
		return "00";
	} else if (longitud < longitudDeseada) {
		// Agregar un cero al inicio solo si la longitud es menor que 2
		const gemFormateada = "0" + gem;
		return gemFormateada;
	} else {
		// Si la longitud es mayor o igual a 2, devolver la gem original
		return gem;
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
  