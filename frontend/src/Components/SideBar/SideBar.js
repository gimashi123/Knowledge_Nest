import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SideBar.css';
import NavBar from '../NavBar/NavBar';
import { 
  FiBook, 
  FiTrendingUp, 
  FiBarChart2, 
  FiAward,
  FiChevronRight,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [expanded, setExpanded] = useState(true);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setUserType(localStorage.getItem('userType') || '');
    setActiveItem(location.pathname);
  }, [location]);

  const navItems = [
    { 
      path: '/learningSystem/allLearningPost', 
      name: 'EduStream', 
      icon: <FiBook size={20} />,
      visible: true
    },
    { 
      path: '/allPost', 
      name: 'BoostPost', 
      icon: <FiTrendingUp size={20} />,
      visible: true
    },
    { 
      path: '/allLearningProgress', 
      name: 'LearnTrack', 
      icon: <FiBarChart2 size={20} />,
      visible: true
    },
    { 
      path: '/learningSystem/recommendPost', 
      name: 'SkillPulse', 
      icon: <FiAward size={20} />,
      visible: userType !== 'googale'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setActiveItem(path);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`sidebar-container ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className='nav_con'>
        <NavBar />
      </div>
      
      <div className='sidebar'>
  <div className='sidebar-header'>
    {expanded && (
      <div className='sidebar-logo'>
        <img 
          src="https://img.freepik.com/free-vector/gradient-learn-logo-template_23-2149000062.jpg" 
          alt="LearnHub Logo" 
          className="logo-image"
        />
        <span>Skills Hub</span>
      </div>
    )}
  </div>
        
        <div className='sidebar-nav-items'>
          {navItems.map((item) => (
            item.visible && (
              <div
                key={item.path}
                className={`nav-item ${activeItem === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className='nav-icon'>{item.icon}</div>
                {expanded && <span>{item.name}</span>}
              </div>
            )
          ))}
        </div>
        <div className='sidelogo'></div>
      </div>
    </div>
  );
}

export default SideBar;