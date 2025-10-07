"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from 'next/image';
import '../../styles/BootstrapDropdown.scss';
import BootstrapClient from '../BootstrapClient';
import '../../styles/shared/Navbar.css';
import { Menu } from 'lucide-react';
import LogoutModal from '../modals/LogoutModal';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        await logout();
        setShowLogoutModal(false);
        router.push("/");
        toast.success("Logged out successfully!");
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleDashboardClick = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must sign in to access dashboard.")
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="custom-navbar">
          <BootstrapClient />
            {/* Desktop menu */}
            <div className='custom-navbar-logo'>
                <Image src='/images/logo_option_3.png' alt='recipebyte-logo' height={40} width={40}/>
                <h3>RECIBYTE</h3>
            </div>
            <div className='custom-navbar-links'>
                <Link className='nav-bar-link' href="/">
                    <div>
                        <Image 
                            src="/images/navbar-icons/home.png" 
                            alt="homepage-icon"
                            height={15}
                            width={15}
                        />
                        Home
                    </div>
                </Link>
                {/* <Link href="/recipes">Recipes</Link> */}

                <Link 
                    href="/dashboard"
                    className="nav-bar-link"
                    onClick={handleDashboardClick}
                    >
                    <div>
                        <Image 
                        src="/images/navbar-icons/dashboards.png" 
                        alt="dashboard-icon"
                        height={15}
                        width={15}
                        />
                        <span>Dashboard</span>
                    </div>
                </Link>
                
                {!user ? (
                    <Link className='nav-bar-link' href="/authentication">
                        <div>
                            <Image 
                                src="/images/navbar-icons/login.png" 
                                alt="login-icon"
                                height={15}
                                width={15}
                            />
                            Sign In
                        </div>
                    </Link>
                ) : (
                    <>
                        <button onClick={handleLogoutClick}>
                            <div>
                                <Image 
                                    src="/images/navbar-icons/logout.png" 
                                    alt="logout-icon"
                                    height={15}
                                    width={15}
                                />
                                Logout
                            </div>
                        </button>
                        
                    </>
                )}
            </div>

            {/* Mobile menu */}
            <div className="btn-group d-md-none">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <Menu size={20} />
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <Link href="/" className="dropdown-item">
                            <div>
                                <Image 
                                    src="/images/navbar-icons/home.png" 
                                    alt="homepage-icon"
                                    height={10}
                                    width={10}
                                />
                                Home
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/dashboard"
                            className="dropdown-item"
                            onClick={handleDashboardClick}
                            >
                            <div>
                                <Image 
                                src="/images/navbar-icons/dashboards.png" 
                                alt="dashboard-icon"
                                height={10}
                                width={10}
                                />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        {!user ? (
                            <Link href="/authentication" className="dropdown-item">
                                <div>
                                    <Image 
                                        src="/images/navbar-icons/login.png" 
                                        alt="login-icon"
                                        height={10}
                                        width={10}
                                    />
                                    Sign In
                                </div>
                            </Link>
                        ) : (
                            <>
                                <button onClick={handleLogoutClick} className="dropdown-item">
                                    <div>
                                        <Image 
                                            src="/images/navbar-icons/logout.png" 
                                            alt="logout-icon"
                                            height={10}
                                            width={10}
                                        />
                                        Logout
                                    </div>
                                </button>
                            </>
                        )}
                    </li>
                </ul>
            </div>
            <LogoutModal 
                show={showLogoutModal} 
                onConfirm={handleConfirmLogout} 
                onCancel={handleCancelLogout} 
            />
        </div>
    );
}