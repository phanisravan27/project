import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(12, 12, 29, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(motion.div)`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(motion.button)`
  background: none;
  color: ${props => props.active ? '#8b5cf6' : '#d1d5db'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #f8f9fa;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <Nav>
        <Logo
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✨ Life Narrator
        </Logo>

        <NavLinks>
          <NavLink
            active={isActive('/dashboard')}
            onClick={() => handleNavigation('/dashboard')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Dashboard
          </NavLink>
          
          <NavLink
            active={isActive('/timeline')}
            onClick={() => handleNavigation('/timeline')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Timeline
          </NavLink>
          
          <NavLink
            active={isActive('/create')}
            onClick={() => handleNavigation('/create')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Create Entry
          </NavLink>
        </NavLinks>

        <UserSection>
          {user && <UserName>Hello, {user.full_name}</UserName>}
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </LogoutButton>
        </UserSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;