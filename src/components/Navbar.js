"use client";

import '../styles/Navbar.css';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from 'next/image';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import BootstrapClient from './BootstrapClient';
// import { Navbar as BSNavbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';

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

// return (
//     <BSNavbar expand="md" bg="light" className="py-2 px-3">
//       <Container fluid>
//         {/* Brand Logo */}
//         <BSNavbar.Brand as={Link} href="/homepage" className="d-flex align-items-center">
//           <Image src="/images/logo_option_3.png" alt="recipebyte-logo" height={40} width={40} />
//           <span className="ms-2 fw-bold">RECIPEBYTE</span>
//         </BSNavbar.Brand>

//         {/* Hamburger for mobile */}
//         <BSNavbar.Toggle aria-controls="main-navbar" />

//         {/* Collapsible menu */}
//         <BSNavbar.Collapse id="main-navbar">
//           <Nav className="ms-auto d-flex align-items-center">
//             <Nav.Link as={Link} href="/homepage">Home</Nav.Link>

//             <Nav.Link href="/dashboard" onClick={handleDashboardClick}>
//               Dashboard
//             </Nav.Link>

//             {!token ? (
//               <Nav.Link as={Link} href="/auth">Sign In</Nav.Link>
//             ) : (
//               <Button variant="outline-secondary" className="ms-2" onClick={handleLogout}>
//                 Logout
//               </Button>
//             )}
//           </Nav>
//         </BSNavbar.Collapse>
//       </Container>
//     </BSNavbar>
//   );


    return (
        <div className="navbar">
          {/* <BootstrapClient /> */}
            <div className='navbar-logo'>
                <Image src='/images/logo_option_3.png' alt='recipebyte-logo' height={40} width={40}/>
                <h3>RECIPBYTE</h3>
            </div>
            <div className='navbar-links'>
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
                    className="btn btn-secondary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Menu
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