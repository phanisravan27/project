#!/usr/bin/env python3
"""
Demo data seeder for AI Life Narrator application.
Creates sample user accounts and diary entries for testing.
"""

import os
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, User, DiaryEntry, FileUpload
from auth import get_password_hash

def create_demo_data():
    """Create demo users and entries for testing."""
    db = SessionLocal()
    
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@example.com").first()
        if existing_user:
            print("Demo data already exists. Skipping creation.")
            return

        # Create demo user
        demo_user = User(
            email="demo@example.com",
            hashed_password=get_password_hash("demo123"),
            full_name="Demo User",
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        print(f"Created demo user: {demo_user.email}")

        # Create sample diary entries
        sample_entries = [
            {
                "text_content": "Today was an amazing day! I went for a morning run in the park and the sunrise was absolutely breathtaking. The colors painted across the sky reminded me why I love early mornings so much.",
                "ai_story": "The morning sun cast its golden threads across the sky as I laced up my running shoes, ready to greet another day. Each step through the park felt like a meditation, connecting me with the rhythm of nature awakening around me. The sunrise wasn't just a sight to behold—it was a reminder of the endless possibilities each new day brings.",
                "story_style": "poetic",
                "date": datetime.utcnow() - timedelta(days=1)
            },
            {
                "text_content": "Had a great coffee meeting with Sarah today. We discussed our new project ideas and I'm really excited about the direction we're heading. Sometimes the best ideas come from simple conversations.",
                "ai_story": "The aroma of freshly brewed coffee mingled with the energy of inspiration as Sarah and I dove deep into our brainstorming session. What started as a casual catch-up quickly evolved into an electric exchange of ideas. There's something magical about those moments when two minds sync perfectly, creating something greater than the sum of their parts.",
                "story_style": "journal",
                "date": datetime.utcnow() - timedelta(days=2)
            },
            {
                "text_content": "Spent the evening cooking a new recipe I found online. It didn't turn out exactly as planned, but it was still delicious! Cooking always helps me relax and disconnect from work stress.",
                "ai_story": "Chapter 1: The Kitchen Adventure. Our hero (me) boldly entered the culinary battlefield armed with a mysterious online recipe and unwavering determination. Despite a few plot twists (was that supposed to be salt or sugar?), the evening ended with a delicious victory and a sink full of heroic battle scars (aka dirty dishes).",
                "story_style": "comic",
                "date": datetime.utcnow() - timedelta(days=3)
            },
            {
                "text_content": "Finished reading 'The Midnight Library' today. What a thought-provoking book about life choices and possibilities. It really made me reflect on my own path and decisions.",
                "ai_story": "Between the pages of Haig's masterpiece, I found myself wandering through my own library of possibilities. Each chapter was a mirror reflecting the paths I've taken and those I've left unexplored. As I closed the book, I realized that every ending is also a beginning—a chance to write the next chapter of my own story.",
                "story_style": "poetic",
                "date": datetime.utcnow() - timedelta(days=4)
            },
            {
                "text_content": "Tried a new yoga class today. I'm definitely not as flexible as I thought, but everyone was so welcoming and supportive. Looking forward to going back next week.",
                "ai_story": "Today I documented my humbling yet enlightening introduction to the ancient art of pretzel-making (also known as yoga). While my body protested each pose with creative interpretations of the intended positions, my spirit soared with the warmth of the community around me. Note to self: flexibility is a journey, not a destination.",
                "story_style": "journal",
                "date": datetime.utcnow() - timedelta(days=5)
            },
            {
                "text_content": "Weekend hiking trip with friends was incredible. We reached the summit just as the clouds cleared, giving us the most spectacular view. Felt so grateful to be surrounded by nature and good friends.",
                "ai_story": "Episode 5: The Summit Squad strikes again! After hours of heroic hiking (and minimal complaining), our brave adventurers conquered the mighty mountain. Just when all seemed cloudy, nature decided to roll back the curtains and reveal the most epic season finale view ever. Friendship level: Maximum. Altitude achievement: Unlocked!",
                "story_style": "comic",
                "date": datetime.utcnow() - timedelta(days=6)
            }
        ]

        # Create entries for demo user
        for entry_data in sample_entries:
            entry = DiaryEntry(
                user_id=demo_user.id,
                text_content=entry_data["text_content"],
                ai_story=entry_data["ai_story"],
                story_style=entry_data["story_style"],
                date=entry_data["date"],
                created_at=entry_data["date"],
                updated_at=entry_data["date"]
            )
            db.add(entry)
        
        db.commit()
        print(f"Created {len(sample_entries)} sample diary entries")

        # Create a second demo user
        demo_user2 = User(
            email="jane@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Jane Smith",
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(demo_user2)
        db.commit()
        db.refresh(demo_user2)
        
        print(f"Created second demo user: {demo_user2.email}")

        # Create a few entries for the second user
        jane_entries = [
            {
                "text_content": "Started learning guitar today! My fingers are sore but I managed to play my first chord. Music has always been a dream of mine.",
                "ai_story": "The strings vibrated with possibility as I picked up the guitar for the first time. Each fumbling attempt at forming a chord was a small victory, a note in the symphony of my learning journey. My fingertips may ache, but my heart sings with the promise of melodies yet to come.",
                "story_style": "poetic",
                "date": datetime.utcnow() - timedelta(days=1)
            },
            {
                "text_content": "Had lunch with my grandmother today. She shared stories about her childhood that I'd never heard before. These moments are so precious.",
                "ai_story": "Today I recorded another episode of 'Grandma's Greatest Hits'—a heartwarming series where our beloved protagonist (Grandma) shares legendary tales from the golden age of her youth. Armed with tea and cookies, we traveled through time, collecting stories like precious treasures. Rating: 5 stars, would definitely binge-watch again.",
                "story_style": "comic",
                "date": datetime.utcnow() - timedelta(days=2)
            }
        ]

        for entry_data in jane_entries:
            entry = DiaryEntry(
                user_id=demo_user2.id,
                text_content=entry_data["text_content"],
                ai_story=entry_data["ai_story"],
                story_style=entry_data["story_style"],
                date=entry_data["date"],
                created_at=entry_data["date"],
                updated_at=entry_data["date"]
            )
            db.add(entry)
        
        db.commit()
        print(f"Created {len(jane_entries)} entries for second user")

        print("\n" + "="*50)
        print("DEMO DATA CREATED SUCCESSFULLY!")
        print("="*50)
        print("\nDemo Accounts:")
        print("1. Email: demo@example.com")
        print("   Password: demo123")
        print("   Name: Demo User")
        print(f"   Entries: {len(sample_entries)}")
        print("\n2. Email: jane@example.com")
        print("   Password: password123")
        print("   Name: Jane Smith")
        print(f"   Entries: {len(jane_entries)}")
        print("\nYou can now log in with either account to explore the application!")
        print("="*50)

    except Exception as e:
        db.rollback()
        print(f"Error creating demo data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating demo data for AI Life Narrator...")
    create_demo_data()