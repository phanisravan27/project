import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%);
    background-attachment: fixed;
    min-height: 100vh;
    color: #e8eaed;
    overflow-x: hidden;
    position: relative;
  }

  /* Dynamic night sky background */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 20px 30px, #fff, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 160px 30px, #fff, transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: sparkle 8s linear infinite;
    z-index: -1;
    opacity: 0.8;
  }

  @keyframes sparkle {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-200px);
    }
  }

  /* Moon gradient overlay */
  body::after {
    content: '';
    position: fixed;
    top: 10%;
    right: 10%;
    width: 120px;
    height: 120px;
    background: radial-gradient(
      circle at 30% 30%, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.1) 40%, 
      transparent 70%
    );
    border-radius: 50%;
    z-index: -1;
    animation: moonGlow 6s ease-in-out infinite alternate;
  }

  @keyframes moonGlow {
    from {
      opacity: 0.6;
      transform: scale(1);
    }
    to {
      opacity: 0.9;
      transform: scale(1.1);
    }
  }

  #root {
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    color: #f8f9fa;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, #fff 0%, #d1d5db 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h2 {
    font-size: 2rem;
    font-weight: 500;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  p {
    line-height: 1.6;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  a {
    color: #8b5cf6;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #a855f7;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Form elements */
  input, textarea, select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    color: #f8f9fa;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  /* Button base styles */
  button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  /* Glass morphism effect for cards */
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  /* Gradient text effect */
  .gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    body::after {
      width: 80px;
      height: 80px;
      top: 5%;
      right: 5%;
    }
  }

  /* Animation for floating elements */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }

  /* Smooth transitions for route changes */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity 300ms;
  }
`;