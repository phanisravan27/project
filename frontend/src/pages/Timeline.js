import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { timelineAPI } from '../services/api';
import { format, isToday, isThisMonth } from 'date-fns';
import toast from 'react-hot-toast';

const TimelineContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TimelineHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #fff 0%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #d1d5db;
  font-size: 1.1rem;
`;

const EntriesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const EntryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  }
`;

const EntryDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #8b5cf6;
  font-weight: 600;
  font-size: 1.1rem;
`;

const EntryContent = styled.div`
  margin-bottom: 1.5rem;
`;

const EntryText = styled.p`
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const AIStory = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const AIStoryLabel = styled.div`
  color: #8b5cf6;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AIStoryText = styled.p`
  color: #e8eaed;
  line-height: 1.6;
  font-style: italic;
`;

const EntryMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #d1d5db;
  
  h3 {
    margin-bottom: 1rem;
    color: #f8f9fa;
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #d1d5db;
`;

const Timeline = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelineEntries();
  }, []);

  const fetchTimelineEntries = async () => {
    try {
      const response = await timelineAPI.getTimeline();
      setEntries(response.data.entries);
    } catch (error) {
      toast.error('Failed to load timeline');
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = isToday(date);
    const thisMonth = isThisMonth(date);
    
    if (today) {
      return '📅 Today';
    } else if (thisMonth) {
      return `📅 ${format(date, 'EEEE, MMMM do')}`;
    } else {
      return `📅 ${format(date, 'EEEE, MMMM do, yyyy')}`;
    }
  };

  if (loading) {
    return (
      <TimelineContainer>
        <LoadingState>
          <div className="loading">Loading your timeline...</div>
        </LoadingState>
      </TimelineContainer>
    );
  }

  return (
    <TimelineContainer>
      <TimelineHeader
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Your Life Timeline ✨</Title>
        <Subtitle>
          A journey through your memories and stories
        </Subtitle>
      </TimelineHeader>

      {entries.length > 0 ? (
        <EntriesContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {entries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <EntryDate>
                {formatDate(entry.date)}
              </EntryDate>

              <EntryContent>
                {entry.text_content && (
                  <EntryText>{entry.text_content}</EntryText>
                )}

                {entry.ai_story && (
                  <AIStory>
                    <AIStoryLabel>
                      🤖 AI Generated Story
                    </AIStoryLabel>
                    <AIStoryText>{entry.ai_story}</AIStoryText>
                  </AIStory>
                )}
              </EntryContent>

              <EntryMeta>
                {entry.has_audio && (
                  <MetaBadge>🎤 Audio</MetaBadge>
                )}
                {entry.has_images && (
                  <MetaBadge>📷 Images</MetaBadge>
                )}
                {entry.files && entry.files.length > 0 && (
                  <MetaBadge>📎 {entry.files.length} files</MetaBadge>
                )}
              </EntryMeta>
            </EntryCard>
          ))}
        </EntriesContainer>
      ) : (
        <EmptyState>
          <h3>No entries yet</h3>
          <p>Start capturing your life story by creating your first entry!</p>
        </EmptyState>
      )}
    </TimelineContainer>
  );
};

export default Timeline;