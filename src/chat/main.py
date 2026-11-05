import json

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.types import Message

app = FastAPI()
templates = Jinja2Templates(directory="src/chat/templates")

app.mount(path="/static", app=StaticFiles(directory="src/chat/static"), name="static")

temp_chat_history = [{"username": "SERVER", "message": "WELCOME!", "is_code": False}]


class ConnectionManager:
    def __init__(self) -> None:
        self.__clients: dict[WebSocket, str] = {}
        self.guest_count = 0

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()

        self.__clients[websocket] = username

    def disconnect(self, websocket: WebSocket, username):
        del self.__clients[websocket]

    def format_to_msg(self, data: str, username: str) -> dict:
        is_code = data.startswith("[BLOCK CODE]")

        if is_code:
            data = data[12:]

        return {"username": username, "message": data, "is_code": is_code}

    async def broadcast(
        self, msg: str, websocket: WebSocket | None = None, username: str = ""
    ):
        if websocket:
            username = self.__clients[websocket]

        formatted_msg = self.format_to_msg(msg, username)

        temp_chat_history.append(formatted_msg)

        for client in self.__clients:
            await self.send_msg(formatted_msg, client)

    async def send_msg(self, msg: dict, websocket: WebSocket):
        formatted_msg = f"{msg['username']} -> {msg['message']}"

        await websocket.send_text(
            f"[BLOCK CODE]{formatted_msg}" if msg["is_code"] else formatted_msg
        )

    async def send_history(self, websocket: WebSocket):
        for msg in temp_chat_history:
            await self.send_msg(msg, websocket)


connection_manager = ConnectionManager()


@app.get("/", name="main_page")
def main_page(request: Request):
    return templates.TemplateResponse(request, name="index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, username: str = "GUEST"):
    if username.strip() == "":
        g_count = connection_manager.guest_count
        username = f"GUEST{g_count if g_count else ''}"
        connection_manager.guest_count += 1

    elif username.strip().lower() == "server":
        username = "client"

    await connection_manager.connect(websocket, username)

    await connection_manager.send_history(websocket)

    await connection_manager.broadcast(username="SERVER", msg=f"{username} has joined!")

    try:
        while True:
            data = await websocket.receive_text()
            await connection_manager.broadcast(msg=data, websocket=websocket)

    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, username)
        await connection_manager.broadcast(
            username="SERVER", msg=f"{username} has left!"
        )
