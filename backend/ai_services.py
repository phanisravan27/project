import openai
import os
import base64
from typing import List, Optional
from datetime import datetime
from config import settings

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY

async def transcribe_audio(audio_file_path: str) -> str:
    """Transcribe audio file using OpenAI Whisper."""
    try:
        with open(audio_file_path, "rb") as audio_file:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
        return transcript["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return ""

async def generate_story(
    text_content: str = "",
    audio_transcript: str = "",
    image_descriptions: List[str] = [],
    style: str = "journal",
    date: datetime = None
) -> str:
    """Generate an AI story based on user inputs."""
    
    # Prepare the prompt based on style
    style_prompts = {
        "journal": "Write a reflective, personal diary entry in first person.",
        "comic": "Write a fun, comic-style narrative with dialogue and humor.",
        "poetic": "Write a poetic, lyrical narrative with beautiful imagery and metaphors."
    }
    
    style_instruction = style_prompts.get(style, style_prompts["journal"])
    
    # Combine all inputs
    content_parts = []
    if text_content:
        content_parts.append(f"Written thoughts: {text_content}")
    if audio_transcript:
        content_parts.append(f"Voice recording: {audio_transcript}")
    if image_descriptions:
        content_parts.append(f"Images from today: {', '.join(image_descriptions)}")
    
    if not content_parts:
        return "Today was a quiet day of reflection."
    
    date_str = date.strftime("%B %d, %Y") if date else "today"
    
    prompt = f"""
    {style_instruction}
    
    Based on these experiences from {date_str}:
    {' | '.join(content_parts)}
    
    Create a {style} entry that weaves these moments together into a cohesive narrative. 
    Make it personal, engaging, and capture the emotions and significance of the day.
    Keep it between 200-500 words.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative writer specializing in personal narratives and life stories."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.8
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating story: {e}")
        return "Unable to generate story at this time."

async def generate_illustration(story_text: str, style: str = "journal") -> Optional[str]:
    """Generate an illustration for the story using DALL-E."""
    
    # Create appropriate prompt for image style
    style_prompts = {
        "journal": "watercolor illustration, soft and dreamy, diary-like",
        "comic": "comic book style illustration, colorful and dynamic",
        "poetic": "artistic illustration, ethereal and beautiful, painterly"
    }
    
    image_style = style_prompts.get(style, style_prompts["journal"])
    
    # Extract key themes from story for image prompt
    prompt = f"""
    Create a {image_style} that represents the mood and key elements from this story excerpt:
    "{story_text[:200]}..."
    
    Style: {image_style}, warm lighting, emotional, personal
    """
    
    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="1024x1024"
        )
        
        image_url = response['data'][0]['url']
        return image_url
    except Exception as e:
        print(f"Error generating illustration: {e}")
        return None

async def generate_recap_summary(entries_text: List[str], recap_type: str = "weekly") -> str:
    """Generate a summary recap of multiple diary entries."""
    
    period = "week" if recap_type == "weekly" else "month"
    
    prompt = f"""
    Create a thoughtful {period}ly recap based on these diary entries:
    
    {' | '.join(entries_text)}
    
    Write a reflective summary that:
    - Highlights the key themes and experiences
    - Notes personal growth or changes
    - Captures the overall mood and journey
    - Provides insights and observations
    
    Keep it warm, personal, and insightful (300-500 words).
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are a thoughtful life coach creating {period}ly recaps."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating recap: {e}")
        return f"Unable to generate {period}ly recap at this time."

async def describe_image(image_path: str) -> str:
    """Describe an uploaded image using GPT-4 Vision (placeholder for now)."""
    # This would use GPT-4 Vision API when available
    # For now, return a placeholder
    try:
        # Read image and encode to base64
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode()
        
        # Note: This is a placeholder - GPT-4 Vision integration would go here
        return "A meaningful moment captured in this image"
    except Exception as e:
        print(f"Error describing image: {e}")
        return "An image from today"