const variaveis = {
  chatDisplay: document.querySelector("#chatDisplay"),
  perfilDisplay: document.querySelector("#perfilDisplay"),
  input: document.querySelector("#input"),
  chatsButton: document.querySelector("#chats"),
  perfilButton: document.querySelector("#perfil"),
  chatArea: document.querySelector(".chatArea"),
};

// variaveis.chatsButton.onclick = () => {
//   variaveis.chatDisplay.style.opacity = "1";
//   variaveis.chatDisplay.style.left = "0%";
// };
//
// variaveis.perfilButton.onclick = () => {
//   variaveis.perfilDisplay.style.opacity = "1";
//   variaveis.perfilDisplay.style.left = "60%";
// };

if (localStorage.getItem("nome") === "" || localStorage.getItem("imagem") === "") {
  window.location.href = "http://localhost:8080/cadastro"
}

const nome = localStorage.getItem("nome");
const imagem = localStorage.getItem("imagem");
  console.log(localStorage.getItem("nome"), localStorage.getItem("imagem"));

document.querySelector(".messageTime").textContent =
  `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${window.location.host}`);

  server.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const div = document.createElement("div");
    div.className = "chat__message";
    div.innerHTML = `
      <div class="icon__message">
        <img src="/imagens/${data.imagem}" alt="${data.nome}">
      </div>
      <div class="text__area">
        <div class="user__info">
          <span>${data.nome}</span> |
          <span class="messageTime">${data.hora}</span>
        </div>
        <span class="message__content">${data.conteudo}</span>
      </div>
    `;

    variaveis.chatArea.appendChild(div);
    variaveis.chatArea.scrollTop = variaveis.chatArea.scrollHeight;
  };

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && variaveis.input.value.trim().length !== 0) {
    const mensagem = {
      nome: localStorage.getItem("nome"),
      imagem: localStorage.getItem("imagem"),
      conteudo: variaveis.input.value.trim(),
      hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    }
    server.send(JSON.stringify(mensagem));
    variaveis.input.value = "";
  }
});
