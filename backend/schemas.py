from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Diary Entry schemas
class DiaryEntryBase(BaseModel):
    text_content: Optional[str] = None
    story_style: Optional[str] = "journal"

class DiaryEntryCreate(DiaryEntryBase):
    date: Optional[datetime] = None

class DiaryEntry(DiaryEntryBase):
    id: int
    user_id: int
    date: datetime
    audio_transcript: Optional[str] = None
    ai_story: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# File Upload schemas
class FileUpload(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Story generation schemas
class StoryGenerationRequest(BaseModel):
    entry_id: int
    style: Optional[str] = "journal"  # journal, comic, poetic

class StoryResponse(BaseModel):
    story: str
    generated_images: Optional[List[str]] = []

# Timeline schemas
class TimelineEntry(BaseModel):
    id: int
    date: datetime
    text_content: Optional[str] = None
    ai_story: Optional[str] = None
    has_audio: bool = False
    has_images: bool = False
    files: List[FileUpload] = []
    
    class Config:
        from_attributes = True

class TimelineResponse(BaseModel):
    entries: List[TimelineEntry]
    total_count: int

# Audio transcription schema
class TranscriptionResponse(BaseModel):
    transcript: str
    confidence: Optional[float] = None

# Recap schemas
class RecapRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    recap_type: str = "weekly"  # weekly, monthly

class RecapResponse(BaseModel):
    summary: str
    highlights: List[str]
    generated_audio_url: Optional[str] = None