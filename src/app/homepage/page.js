import DidYouKnow from "@/components/DidYouKnow";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import '../../styles/HomePage.css';

export default function HomePage() {
    return(
        <div className="home-page">
            <Navbar />
            <HeroSection />
            <DidYouKnow />
        </div>
    )
}