import DidYouKnow from "@/components/homepage/DidYouKnow";
import HeroSection from "@/components/homepage/HeroSection";
import Navbar from "@/components/shared/Navbar";
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