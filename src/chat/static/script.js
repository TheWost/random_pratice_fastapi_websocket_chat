const msg_place = document.querySelector(".messages");
const terminal_form = document.querySelector("form");
const temrinal_container = document.querySelector("div")
const input_area = document.querySelector("textarea")
const body = document.body
let ws;

input_area.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    send_message();
  }
}
)

function login(e) {
  console.log(e)
  e.preventDefault();

  const username = e.target.elements["username"].value;

  ws = new WebSocket(
    `ws://${window.location.host}/ws?username=${encodeURIComponent(username)}`
  );

  ws.onmessage = (e) => {
    const p = document.createElement("p");

    p.textContent = e.data

    msg_place.append(p)
  }

  temrinal_container.style.display = "flex";
  e.target.style.display = "none";
}

function create_login_input() {
  temrinal_container.style.display = "none";

  const form = document.createElement("form");
  form.classList.add("login_form")
  const input = document.createElement("input");
  input.classList.add("login_input")
  const button = document.createElement("button");
  button.classList.add("login_submit")

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


function send_message() {
  ws.send(input_area.value);
  input_area.value = '';
}
