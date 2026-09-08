import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Subjects from "@/components/Subjects";
import AcademicYears from "@/components/AcademicYears";
import FeaturedLectures from "@/components/FeaturedLectures";
import MCQPreview from "@/components/MCQPreview";
import MedicalCases from "@/components/MedicalCases";
import HighYieldNotes from "@/components/HighYieldNotes";
import ProgressPreview from "@/components/ProgressPreview";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Subjects />
      <AcademicYears />
      <FeaturedLectures />
      <MCQPreview />
      <MedicalCases />
      <HighYieldNotes />
      <ProgressPreview />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
