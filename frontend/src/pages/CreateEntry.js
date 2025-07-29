import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { entriesAPI, uploadsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
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

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#8b5cf6' : '#d1d5db'};
  padding: 1rem 1.5rem;
  font-weight: 500;
  border-bottom: 2px solid ${props => props.active ? '#8b5cf6' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #8b5cf6;
  }
`;

const ContentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #f8f9fa;
  font-weight: 500;
  font-size: 0.9rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #f8f9fa;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #f8f9fa;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #1a1a2e;
    color: #f8f9fa;
  }
`;

const AudioRecorder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  text-align: center;
`;

const RecordButton = styled(motion.button)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.recording ? 
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)'
  };
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'primary' ? 
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  border: 1px solid ${props => props.variant === 'primary' ? 
    'transparent' : 'rgba(255, 255, 255, 0.2)'
  };
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'primary' ? 
      'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' : 
      'rgba(255, 255, 255, 0.15)'
    };
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.type === 'success' ? 
    'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'
  };
  border: 1px solid ${props => props.type === 'success' ? 
    'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'
  };
  color: #f8f9fa;
  margin-bottom: 1rem;
`;

const CreateEntry = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [storyStyle, setStoryStyle] = useState('journal');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);
    try {
      const response = await entriesAPI.createEntry({
        text_content: textContent,
        story_style: storyStyle
      });
      
      toast.success('Entry created successfully!');
      navigate('/timeline');
    } catch (error) {
      toast.error('Failed to create entry');
      console.error('Error creating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setStatus('Recording saved! You can now upload it.');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setStatus('Recording in progress...');
    } catch (error) {
      toast.error('Failed to start recording. Please check microphone permissions.');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      setMediaRecorder(null);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      toast.error('No audio to upload');
      return;
    }

    setLoading(true);
    try {
      const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      const response = await uploadsAPI.uploadAudio(file);
      
      toast.success('Audio uploaded and transcribed!');
      setStatus(`Transcription: "${response.data.transcript}"`);
      setAudioBlob(null);
    } catch (error) {
      toast.error('Failed to upload audio');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    setLoading(true);
    try {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          await uploadsAPI.uploadImage(file);
        } else if (file.type.startsWith('audio/')) {
          await uploadsAPI.uploadAudio(file);
        }
      }
      
      setUploadedFiles([...uploadedFiles, ...files]);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload files');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <Form onSubmit={handleTextSubmit}>
            <InputGroup>
              <Label htmlFor="content">What's on your mind today?</Label>
              <TextArea
                id="content"
                placeholder="Share your thoughts, experiences, or what happened today..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="style">Story Style</Label>
              <Select
                id="style"
                value={storyStyle}
                onChange={(e) => setStoryStyle(e.target.value)}
              >
                <option value="journal">Personal Journal</option>
                <option value="comic">Comic Style</option>
                <option value="poetic">Poetic Narrative</option>
              </Select>
            </InputGroup>

            <ActionButtons>
              <Button type="button" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Entry'}
              </Button>
            </ActionButtons>
          </Form>
        );

      case 'audio':
        return (
          <div>
            {status && (
              <StatusMessage type={audioBlob ? 'success' : 'info'}>
                {status}
              </StatusMessage>
            )}

            <AudioRecorder>
              <h3>Voice Recording</h3>
              <p>Capture your thoughts with voice</p>
              
              <RecordButton
                recording={recording}
                onClick={recording ? stopRecording : startRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {recording ? '⏹️' : '🎤'}
              </RecordButton>
              
              <p>
                {recording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>

              {audioBlob && (
                <ActionButtons>
                  <Button onClick={() => setAudioBlob(null)}>
                    Discard
                  </Button>
                  <Button variant="primary" onClick={uploadAudio} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload & Transcribe'}
                  </Button>
                </ActionButtons>
              )}
            </AudioRecorder>
          </div>
        );

      case 'files':
        return (
          <div>
            <FileUploadArea onClick={() => document.getElementById('fileInput').click()}>
              <h3>📁 Upload Files</h3>
              <p>Add photos and other files to your entry</p>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db', marginTop: '0.5rem' }}>
                Supports images, audio files, and more
              </p>
            </FileUploadArea>

            <HiddenFileInput
              id="fileInput"
              type="file"
              multiple
              accept="image/*,audio/*"
              onChange={handleFileUpload}
            />

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Uploaded Files:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {uploadedFiles.map((file, index) => (
                    <li key={index} style={{ 
                      padding: '0.5rem', 
                      background: 'rgba(255,255,255,0.1)', 
                      margin: '0.25rem 0',
                      borderRadius: '8px'
                    }}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CreateContainer>
      <Header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Create New Entry ✨</Title>
        <Subtitle>Capture today's moments and let AI craft your story</Subtitle>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'text'} 
          onClick={() => setActiveTab('text')}
        >
          ✍️ Text Entry
        </Tab>
        <Tab 
          active={activeTab === 'audio'} 
          onClick={() => setActiveTab('audio')}
        >
          🎤 Voice Recording
        </Tab>
        <Tab 
          active={activeTab === 'files'} 
          onClick={() => setActiveTab('files')}
        >
          📁 File Upload
        </Tab>
      </TabContainer>

      <ContentCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {renderTabContent()}
      </ContentCard>
    </CreateContainer>
  );
};

export default CreateEntry;