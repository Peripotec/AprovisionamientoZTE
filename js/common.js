// common.js
// Función para copiar texto al portapapeles y mostrar un mensaje de confirmación
function copiarComando(comando) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = comando;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  // Mostrar un mensaje de "Comando copiado"
  const mensajeCopiado = document.createElement("div");
  mensajeCopiado.className = "copiado-mensaje";
  mensajeCopiado.textContent = "Comando copiado";
  document.body.appendChild(mensajeCopiado);

  // Estilos para el mensaje (puedes ajustar según tu diseño)
  mensajeCopiado.style.position = "fixed";
  mensajeCopiado.style.bottom = "20px";
  mensajeCopiado.style.left = "1129px"; // Ajusta esta posición según necesites
  mensajeCopiado.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  mensajeCopiado.style.color = "#fff";
  mensajeCopiado.style.padding = "10px";
  mensajeCopiado.style.borderRadius = "5px";

  // Animación de desvanecimiento
  setTimeout(() => {
    let opacity = 1;
    const fadeOutInterval = setInterval(() => {
      if (opacity <= 0) {
        clearInterval(fadeOutInterval);
        mensajeCopiado.remove();
      } else {
        opacity -= 0.1;
        mensajeCopiado.style.opacity = opacity;
      }
    }, 100);
  }, 500);
}

// Función para mostrar los comandos en el contenedor designado
function mostrarComandos(comandos) {
  let descripcionYComandoText = "";
  for (const cmd of comandos) {
    descripcionYComandoText += `
      <div class="descripcion-container">
          <div class="comando" onclick="toggleComandos(this)">
              <p>
                <button type="button" class="btn-primary" onclick="copiarComando(\`${cmd.copiarComando || cmd.comandos || cmd.comando}\`); event.stopPropagation();">
                  Copiar Comando
                </button>
                ${cmd.descripcion}
              </p>
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
  if (comandosContainer) {
    comandosContainer.innerHTML = descripcionYComandoText;
  }
}

// Función para alternar la visibilidad del bloque de comandos
function toggleComandos(descripcionContainer) {
  const contenido = descripcionContainer.nextElementSibling;
  if (contenido && contenido.classList.contains('contenido')) {
    descripcionContainer.classList.toggle('expanded');
    contenido.style.display = (contenido.style.display === "none" ? "block" : "none");
  }
}

// Función reutilizable para copiar texto al portapapeles (si se prefiere separar esta funcionalidad)
function copyToClipboard(text) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  // Muestra un mensaje de copiado (suponiendo que tengas un elemento con id "copyMsg")
  const copyMsg = document.getElementById("copyMsg");
  if (copyMsg) {
    copyMsg.style.opacity = 1;
    setTimeout(() => { copyMsg.style.opacity = 0; }, 1500);
  }
}

// Exportar funciones si utilizas módulos (opcional)
// export { copiarComando, mostrarComandos, toggleComandos, copyToClipboard };
