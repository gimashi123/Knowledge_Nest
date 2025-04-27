import React, { useState, useEffect } from 'react';  // Added useEffect here
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundForward } from 'react-icons/io';
import './user.css';
import GoogleLogo from './img/glogo.png';
import OAuthLogin from '../../Components/Auth/OAuthLogin';

const images = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
];

function UserLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userID', data.id);
                alert('Login successful!');
                navigate('/learningSystem/allLearningPost');
            } else if (response.status === 401) {
                alert('Invalid credentials!');
            } else {
                alert('Failed to login!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="user-register-container">
            <div className="register-wrapper">
                {/* Left Side - Image Slideshow */}
                <div className="image-slideshow">
                    {images.map((image, index) => (
                        <div 
                            key={index}
                            className={`slide ${index === currentImageIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${image})` }}
                        >
                            <div className="slide-overlay">
                                <h1 className="slide-title">Welcome Back!</h1>
                                <p className="slide-text">
                                    Continue your learning journey with us.
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="slideshow-dots">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="register-form-container">
                    <div className="form-header">
                        <div className="form-icon">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                            </svg>
                        </div>
                        <h2 className="form-title">Welcome Back</h2>
                        <p className="form-subtitle">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Login
                        </button>

                        <div className="separator">
                            <span>OR</span>
                        </div>
                        
                        <OAuthLogin />

                        <div className="form-footer">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => (window.location.href = '/register')}
                                className="login-link"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;