import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/homepage/HeroSection";
import DidYouKnow from "@/components/homepage/DidYouKnow";
import RecipeGenerator from "@/components/homepage/RecipeGenerator";

export default function Home() {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <RecipeGenerator />
      <DidYouKnow />
    </div>
  );
}
