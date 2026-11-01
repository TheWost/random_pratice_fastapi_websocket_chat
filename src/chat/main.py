from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="src/chat/templates")

app.mount(path="/static", app=StaticFiles(directory="src/chat/static"), name="static")


@app.get("/", name="main_page")
def main_page(request: Request):
    return templates.TemplateResponse(request, name="index.html")
