# Group Chat

A real-time group chat built with Python, FastAPI and WebSockets.

## Features

- Real-time messaging.
- Multiple connected clients.
- Custom usernames.
- Default username (`GUEST`).

## Requirements

- Python 3.14+
- [uv](https://docs.astral.sh/uv/)

## Installation

Clone the repository:

```bash
git clone https://github.com/TheWost/random_pratice_fastapi_websocket_chat
cd chat
```

Install dependencies:

```bash
uv sync
```

## Usage

Run the application:

```bash
uv run fastapi dev src/chat/main.py
```

With chosen port and host:

```bash
uv run fastapi dev src/chat/main.py --port 8080 --host 0.0.0.0
```

The development server will be available at:

```text
http://127.0.0.1:8000
```

For anyone else on the same LAN, the server will be available at:

```text
http://<YOUR_IPV4>:8080
```

## Project Structure

```text
chat/
├── pyproject.toml
├── pyrightconfig.json
├── README.md
├── src/
│   └── chat/
│       ├── __init__.py
│       ├── main.py
│       ├── static/
│       │   ├── script.js
│       │   └── style.css
│       └── templates/
│           └── index.html
└── uv.lock
```

## Used

- Python
- FastAPI
- WebSockets
- HTML
- CSS
- JavaScript
- uv
