from fastapi import FastAPI, Form, Request, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="src/chat/templates")

app.mount(path="/static", app=StaticFiles(directory="src/chat/static"), name="static")


class ConnectionManager:
    def __init__(self) -> None:
        self.__clients: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()

        self.__clients[websocket] = username

    def disconnect(self, websocket: WebSocket, username):
        del self.__clients[websocket]

    async def broadcast(
        self, msg: str, websocket: WebSocket | None = None, username: str = ""
    ):
        if websocket:
            username = self.__clients[websocket]

        for client in self.__clients:
            formated_msg = username + " -> " + msg
            await client.send_text(formated_msg)


connection_manager = ConnectionManager()


@app.get("/", name="main_page")
def main_page(request: Request):
    return templates.TemplateResponse(request, name="index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, username: str = "GUEST"):
    print(username)
    await connection_manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            await connection_manager.broadcast(msg=data, websocket=websocket)

    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, username)
        await connection_manager.broadcast(
            username="SERVER", msg=f"{username} has left!"
        )
