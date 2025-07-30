"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from 'next/image';
import '../styles/BootstrapDropdown.scss';
import BootstrapClient from './BootstrapClient';
import '../styles/Navbar.css';
import { Menu } from 'lucide-react';

export default function Navbar() {
    const { token, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/homepage");
        toast.success("Logged out successfully!");
    };

    const handleDashboardClick = (e) => {
        e.preventDefault();
        if (!token) {
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
                <h3>RECIPBYTE</h3>
            </div>
            <div className='custom-navbar-links'>
                <Link href="/homepage">Home</Link>
                {/* <Link href="/recipes">Recipes</Link> */}

                {/* {token && (
                    <Link href="/dashboard">Dashboard</Link>
                )} */}

                <Link href="/dashboard" legacyBehavior>
                    <a onClick={handleDashboardClick}>Dashboard</a>
                </Link>
                
                {!token ? (
                    <Link href="/auth">Sign In</Link>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
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
                    <li><Link href="/homepage" className="dropdown-item">Home</Link></li>
                    <li>
                        <Link href="/dashboard" legacyBehavior>
                            <a onClick={handleDashboardClick} className="dropdown-item">Dashboard</a>
                        </Link>
                    </li>
                    <li>
                        {!token ? (
                            <Link href="/auth" className="dropdown-item">Sign In</Link>
                        ) : (
                            <button onClick={handleLogout} className="dropdown-item">Logout</button>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}