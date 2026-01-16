import Scene from "@/components/Scene";
import AboutSection from "@/app/about/_components/AboutSection";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Scene />
      <main className="relative z-10 min-h-screen">
        <AboutSection />
      </main>
    </div>
  );
}
