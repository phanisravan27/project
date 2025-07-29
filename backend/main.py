from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import os
import uuid
import shutil

# Local imports
from config import settings
from database import create_tables, get_db, User, DiaryEntry, FileUpload
from auth import (
    authenticate_user, create_user, get_current_active_user, 
    create_access_token, get_user_by_email
)
from schemas import (
    UserCreate, UserLogin, Token, User as UserSchema,
    DiaryEntryCreate, DiaryEntry as DiaryEntrySchema,
    StoryGenerationRequest, StoryResponse, TimelineResponse,
    TranscriptionResponse, RecapRequest, RecapResponse
)
from ai_services import (
    transcribe_audio, generate_story, generate_illustration,
    generate_recap_summary, describe_image
)

# Create tables on startup
create_tables()

# Create uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="AI Life Narrator",
    description="A full-stack AI-powered life storytelling application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Authentication endpoints
@app.post("/auth/register", response_model=UserSchema)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = create_user(db, user.email, user.password, user.full_name)
    return db_user

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token."""
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """Logout user (client-side token removal)."""
    return {"message": "Successfully logged out"}

# User profile endpoints
@app.get("/profile", response_model=UserSchema)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    return current_user

# File upload endpoints
@app.post("/upload/audio", response_model=TranscriptionResponse)
async def upload_audio(
    file: UploadFile = File(...),
    entry_id: Optional[int] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and transcribe audio file."""
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create file record
    db_file = FileUpload(
        user_id=current_user.id,
        entry_id=entry_id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type="audio",
        file_size=os.path.getsize(file_path)
    )
    db.add(db_file)
    db.commit()
    
    # Transcribe audio
    transcript = await transcribe_audio(file_path)
    
    # Update entry with transcript if entry_id provided
    if entry_id:
        entry = db.query(DiaryEntry).filter(
            DiaryEntry.id == entry_id,
            DiaryEntry.user_id == current_user.id
        ).first()
        if entry:
            entry.audio_transcript = transcript
            db.commit()
    
    return TranscriptionResponse(transcript=transcript)

@app.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    entry_id: Optional[int] = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload image file."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create file record
    db_file = FileUpload(
        user_id=current_user.id,
        entry_id=entry_id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type="image",
        file_size=os.path.getsize(file_path)
    )
    db.add(db_file)
    db.commit()
    
    return {"message": "Image uploaded successfully", "file_id": db_file.id}

# Diary entry endpoints
@app.post("/entries", response_model=DiaryEntrySchema)
async def create_entry(
    entry: DiaryEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new diary entry."""
    db_entry = DiaryEntry(
        user_id=current_user.id,
        text_content=entry.text_content,
        story_style=entry.story_style,
        date=entry.date or datetime.utcnow()
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/entries", response_model=List[DiaryEntrySchema])
async def get_entries(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's diary entries."""
    entries = db.query(DiaryEntry).filter(
        DiaryEntry.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return entries

@app.get("/entries/{entry_id}", response_model=DiaryEntrySchema)
async def get_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific diary entry."""
    entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

# AI story generation
@app.post("/generate/story", response_model=StoryResponse)
async def generate_entry_story(
    request: StoryGenerationRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate AI story for a diary entry."""
    entry = db.query(DiaryEntry).filter(
        DiaryEntry.id == request.entry_id,
        DiaryEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # Get associated images for context
    image_files = db.query(FileUpload).filter(
        FileUpload.entry_id == request.entry_id,
        FileUpload.file_type == "image"
    ).all()
    
    image_descriptions = []
    for img_file in image_files:
        description = await describe_image(img_file.file_path)
        image_descriptions.append(description)
    
    # Generate story
    story = await generate_story(
        text_content=entry.text_content or "",
        audio_transcript=entry.audio_transcript or "",
        image_descriptions=image_descriptions,
        style=request.style,
        date=entry.date
    )
    
    # Update entry with generated story
    entry.ai_story = story
    entry.story_style = request.style
    db.commit()
    
    # Generate illustration
    illustration_url = await generate_illustration(story, request.style)
    
    return StoryResponse(
        story=story,
        generated_images=[illustration_url] if illustration_url else []
    )

# Timeline endpoints
@app.get("/timeline", response_model=TimelineResponse)
async def get_timeline(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get timeline of diary entries."""
    query = db.query(DiaryEntry).filter(DiaryEntry.user_id == current_user.id)
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(DiaryEntry.date >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(DiaryEntry.date <= end_dt)
    
    entries = query.order_by(DiaryEntry.date.desc()).all()
    
    # Add file information to entries
    timeline_entries = []
    for entry in entries:
        files = db.query(FileUpload).filter(FileUpload.entry_id == entry.id).all()
        has_audio = any(f.file_type == "audio" for f in files)
        has_images = any(f.file_type == "image" for f in files)
        
        timeline_entries.append({
            "id": entry.id,
            "date": entry.date,
            "text_content": entry.text_content,
            "ai_story": entry.ai_story,
            "has_audio": has_audio,
            "has_images": has_images,
            "files": files
        })
    
    return TimelineResponse(entries=timeline_entries, total_count=len(timeline_entries))

# Recap generation
@app.post("/generate/recap", response_model=RecapResponse)
async def generate_recap(
    request: RecapRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate weekly/monthly recap."""
    entries = db.query(DiaryEntry).filter(
        DiaryEntry.user_id == current_user.id,
        DiaryEntry.date >= request.start_date,
        DiaryEntry.date <= request.end_date
    ).all()
    
    if not entries:
        raise HTTPException(status_code=404, detail="No entries found for the specified period")
    
    # Collect all text content and stories
    entries_text = []
    for entry in entries:
        content = []
        if entry.text_content:
            content.append(entry.text_content)
        if entry.audio_transcript:
            content.append(entry.audio_transcript)
        if entry.ai_story:
            content.append(entry.ai_story)
        
        if content:
            entries_text.append(" | ".join(content))
    
    # Generate recap summary
    summary = await generate_recap_summary(entries_text, request.recap_type)
    
    # Extract highlights (simple implementation)
    highlights = [f"Day {i+1}: {entry.text_content[:100]}..." 
                 for i, entry in enumerate(entries[:5]) if entry.text_content]
    
    return RecapResponse(
        summary=summary,
        highlights=highlights
    )

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)