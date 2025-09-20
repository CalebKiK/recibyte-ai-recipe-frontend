"use client";

import { useAuth } from '@/context/AuthContext';
import '../../styles/homepage/HomePage.css';

export default function HeroSection() {
    const { user } = useAuth();
    
    return (
        <div className="hero-section-component">
            <h1>Welcome{user?.first_name ? `, ${user.first_name}` : ''}!</h1>
            <h2>Let&apos;s turn your ingredients into culinary magic.</h2>
        </div>
    );
}