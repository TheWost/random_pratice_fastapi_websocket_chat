function focus_form() {
  document.getElementById("message").focus();
  document.querySelector(".terminal").classList.add("focused_border")
}

function blur_form() {
  document.querySelector(".terminal").classList.remove("focused_border")
}

const ws = new WebSocket("ws://127.0.0.1:8000/ws");
const msg_place = document.querySelector(".messages");
const terminal = document.querySelector("form");

ws.onmessage = (e) => {
  const p = document.createElement("p");

  p.textcontent = e.data

  msg_place.append(p)
}


function SendMsg(e) {
  const input = e.elements["message"];
  ws.send(input.value)
  input.value = '';
  e.preventDefault();
}
