const ws = new WebSocket("ws://127.0.0.1:8000/ws");
const msg_place = document.querySelector(".messages");
const terminal = document.querySelector("form");
const body = document.body

function login(e) {
  e.preventDefault();

  const username = e.target.elements["username"].value;

  const ws = new WebSocket(`ws://127.0.0.1:8000/ws?username=${username}`);

  return ws
}

function create_login_input() {
  terminal.style.display = "none";

  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");

  input.name = "username";
  input.placeholder = "Enter username";

  button.textContent = "Login";
  button.type = "submit";

  form.append(input, button);
  body.appendChild(form);

  return form;
}


login_form = create_login_input()
login_form.addEventListener("submit", login)


function focus_form() {
  document.getElementById("message").focus();
  document.querySelector(".terminal").classList.add("focused_border")
}

function blur_form() {
  document.querySelector(".terminal").classList.remove("focused_border")
}

ws.onmessage = (e) => {
  const p = document.createElement("p");

  p.textContent = e.data

  msg_place.append(p)
}

function SendMsg(e) {
  e.preventDefault();
  const input = e.srcElement["message"];
  ws.send(input.value);
  input.value = '';
}
