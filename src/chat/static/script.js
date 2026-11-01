function focus_form() {
  document.getElementById("message").focus();
  document.querySelector(".terminal").classList.add("focused_border")
}

function blur_form() {
  document.querySelector(".terminal").classList.remove("focused_border")
}

const ws = new WebSocket("ws://127.0.0.1:8000/ws");


ws.onmessage = (e) => {
  const msg_place = document.querySelector(".messages")
  const p = document.createElement("p");
  const content = e.data

  p.textcontent = content

  msg_place.append(p)
}
