import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { entriesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled(motion.section)`
  text-align: center;
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #fff 0%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: #d1d5db;
  margin-bottom: 2rem;
`;

const QuickActions = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f8f9fa;
`;

const ActionDescription = styled.p`
  color: #d1d5db;
  font-size: 0.9rem;
`;

const RecentEntriesSection = styled(motion.section)`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #f8f9fa;
  font-family: 'Playfair Display', serif;
`;

const EntriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EntryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(139, 92, 246, 0.5);
  }
`;

const EntryDate = styled.div`
  color: #8b5cf6;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EntryContent = styled.p`
  color: #d1d5db;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #d1d5db;
  
  h3 {
    margin-bottom: 1rem;
    color: #f8f9fa;
  }
`;

const StatsSection = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #d1d5db;
  font-size: 0.9rem;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const response = await entriesAPI.getEntries(0, 6);
      setEntries(response.data);
      
      // Calculate basic stats
      const totalEntries = response.data.length;
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeek = response.data.filter(entry => 
        new Date(entry.date) >= weekAgo
      ).length;
      
      const thisMonth = response.data.filter(entry => 
        new Date(entry.date) >= monthAgo
      ).length;
      
      setStats({ totalEntries, thisWeek, thisMonth });
    } catch (error) {
      toast.error('Failed to load entries');
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '✍️',
      title: 'Create Entry',
      description: 'Start writing your story for today',
      action: () => navigate('/create')
    },
    {
      icon: '📅',
      title: 'View Timeline',
      description: 'Browse your life story timeline',
      action: () => navigate('/timeline')
    },
    {
      icon: '🎤',
      title: 'Voice Recording',
      description: 'Record your thoughts and experiences',
      action: () => navigate('/create?tab=audio')
    },
    {
      icon: '🤖',
      title: 'Generate Story',
      description: 'Let AI craft your daily narrative',
      action: () => navigate('/create?tab=generate')
    }
  ];

  const handleEntryClick = (entryId) => {
    navigate(`/timeline?entry=${entryId}`);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading">Loading your dashboard...</div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeTitle>
          Welcome back, {user?.full_name?.split(' ')[0]}! ✨
        </WelcomeTitle>
        <WelcomeSubtitle>
          Ready to continue your life story? Let's capture today's moments.
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatCard>
          <StatNumber>{stats.totalEntries}</StatNumber>
          <StatLabel>Total Entries</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.thisWeek}</StatNumber>
          <StatLabel>This Week</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.thisMonth}</StatNumber>
          <StatLabel>This Month</StatLabel>
        </StatCard>
      </StatsSection>

      <QuickActions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {quickActions.map((action, index) => (
          <ActionCard
            key={index}
            onClick={action.action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            <ActionIcon>{action.icon}</ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActions>

      <RecentEntriesSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SectionTitle>Recent Entries</SectionTitle>
        
        {entries.length > 0 ? (
          <EntriesGrid>
            {entries.map((entry, index) => (
              <EntryCard
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <EntryDate>
                  {format(new Date(entry.date), 'MMMM dd, yyyy')}
                </EntryDate>
                <EntryContent>
                  {entry.ai_story || entry.text_content || 'No content available'}
                </EntryContent>
              </EntryCard>
            ))}
          </EntriesGrid>
        ) : (
          <EmptyState>
            <h3>No entries yet</h3>
            <p>Start your journey by creating your first entry!</p>
          </EmptyState>
        )}
      </RecentEntriesSection>
    </DashboardContainer>
  );
};

export default Dashboard;