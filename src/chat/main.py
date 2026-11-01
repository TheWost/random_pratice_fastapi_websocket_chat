from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="src/chat/templates")

app.mount(path="/static", app=StaticFiles(directory="src/chat/static"), name="static")


class ConnectionManager:
    def __init__(self) -> None:
        self.__clients: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()

        self.__clients.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.__clients.remove(websocket)

    async def broadcast(self, msg: str):
        for client in self.__clients:
            await client.send_text(msg)


connection_manager = ConnectionManager()


@app.get("/", name="main_page")
def main_page(request: Request):
    return templates.TemplateResponse(request, name="index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await connection_manager.broadcast(data)

    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        await connection_manager.broadcast("User has left chat")
