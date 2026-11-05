const msg_place = document.querySelector(".messages");
const terminal_form = document.querySelector("form");
const temrinal_container = document.querySelector("div")
const input_area = document.querySelector("textarea")
const code_checkbox = document.querySelector("input")
const body = document.body
let logged_in = false;
let ws;

input_area.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    send_message();
  }
}
)

function login(e) {
  e.preventDefault();

  const username = e.target.elements["username"].value;

  ws = new WebSocket(
    `ws://${window.location.host}/ws?username=${encodeURIComponent(username)}`
  );

  ws.onmessage = (e) => {
    const p = document.createElement("p");

    p.classList.add("message")

    if (e.data.startsWith("[BLOCK CODE]")) {
      const block_code = document.createElement("code");
      block_code.textContent = e.data.slice(12)
      p.append(block_code)
    }
    else {
      p.textContent = e.data
    }
    msg_place.append(p)
    msg_place.scrollTop = msg_place.scrollHeight;
  }

  if (!logged_in) {
    temrinal_container.style.display = "flex";
    e.target.style.display = "none";
    logged_in = true;
  }

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

  let message_content = input_area.value;

  if (code_checkbox.checked) {
    message_content = "[BLOCK CODE]" + message_content;
  }

  ws.send(message_content);
  input_area.value = '';
}
