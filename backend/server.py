from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Todo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TodoCreate(BaseModel):
    text: str


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None


class FocusSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    duration_minutes: int
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FocusSessionCreate(BaseModel):
    duration_minutes: int


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Lofi Room API", "status": "cozy"}


# Todos
@api_router.get("/todos", response_model=List[Todo])
async def list_todos():
    items = await db.todos.find({}, {"_id": 0}).sort("created_at", 1).to_list(500)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


@api_router.post("/todos", response_model=Todo)
async def create_todo(payload: TodoCreate):
    todo = Todo(text=payload.text)
    doc = todo.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.todos.insert_one(doc)
    return todo


@api_router.patch("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, payload: TodoUpdate):
    update_fields = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_fields:
        existing = await db.todos.find_one({"id": todo_id}, {"_id": 0})
        if not existing:
            raise HTTPException(404, "Todo not found")
        if isinstance(existing.get('created_at'), str):
            existing['created_at'] = datetime.fromisoformat(existing['created_at'])
        return existing

    res = await db.todos.update_one({"id": todo_id}, {"$set": update_fields})
    if res.matched_count == 0:
        raise HTTPException(404, "Todo not found")
    item = await db.todos.find_one({"id": todo_id}, {"_id": 0})
    if isinstance(item.get('created_at'), str):
        item['created_at'] = datetime.fromisoformat(item['created_at'])
    return item


@api_router.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    res = await db.todos.delete_one({"id": todo_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Todo not found")
    return {"ok": True}


# Focus sessions
@api_router.post("/focus-sessions", response_model=FocusSession)
async def create_focus_session(payload: FocusSessionCreate):
    session = FocusSession(duration_minutes=payload.duration_minutes)
    doc = session.model_dump()
    doc['completed_at'] = doc['completed_at'].isoformat()
    await db.focus_sessions.insert_one(doc)
    return session


@api_router.get("/focus-sessions/stats")
async def focus_stats():
    total = await db.focus_sessions.count_documents({})
    pipeline = [{"$group": {"_id": None, "total_minutes": {"$sum": "$duration_minutes"}}}]
    agg = await db.focus_sessions.aggregate(pipeline).to_list(1)
    total_minutes = agg[0]["total_minutes"] if agg else 0
    return {"total_sessions": total, "total_minutes": total_minutes}


# ---- Music streaming proxy (bypasses CORS for external CDN tracks) ----
ALLOWED_AUDIO_HOSTS = {
    "www.soundhelix.com",
    "soundhelix.com",
    "cdn.pixabay.com",
    "freepd.com",
    "archive.org",
    "ia800209.us.archive.org",
    "ia800300.us.archive.org",
}


@api_router.get("/audio-proxy")
async def audio_proxy(url: str, request: Request):
    """Stream an external audio file through the backend with proper CORS + range handling."""
    from urllib.parse import urlparse
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or parsed.hostname not in ALLOWED_AUDIO_HOSTS:
        raise HTTPException(400, "host not allowed")

    range_header = request.headers.get("range")
    fwd_headers = {"User-Agent": "LofiRoomProxy/1.0"}
    if range_header:
        fwd_headers["Range"] = range_header

    cli = httpx.AsyncClient(timeout=None, follow_redirects=True)
    try:
        upstream = await cli.send(cli.build_request("GET", url, headers=fwd_headers), stream=True)
    except Exception:
        await cli.aclose()
        raise HTTPException(502, "upstream fetch failed")

    async def stream():
        try:
            async for chunk in upstream.aiter_bytes(chunk_size=64 * 1024):
                yield chunk
        finally:
            await upstream.aclose()
            await cli.aclose()

    passthrough = ("content-length", "content-range", "accept-ranges", "content-type", "etag", "last-modified")
    resp_headers = {k: v for k, v in upstream.headers.items() if k.lower() in passthrough}
    resp_headers.setdefault("Accept-Ranges", "bytes")
    resp_headers["Cache-Control"] = "public, max-age=3600"

    return StreamingResponse(
        stream(),
        status_code=upstream.status_code,
        media_type=upstream.headers.get("content-type", "audio/mpeg"),
        headers=resp_headers,
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
