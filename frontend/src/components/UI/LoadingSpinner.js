import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: #d1d5db;
  font-size: 1.1rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Stars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 20px 30px, #fff, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: sparkle 8s linear infinite;
    opacity: 0.6;
  }

  @keyframes sparkle {
    from { transform: translateX(0); }
    to { transform: translateX(-200px); }
  }
`;

const LoadingSpinner = ({ text = "Loading your stories..." }) => {
  return (
    <LoadingContainer>
      <Stars />
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;