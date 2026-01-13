import Scene from "./components/Scene";
import TeaseCard from "./components/TeaseCard";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      <Scene />
      <TeaseCard />
    </div>
  );
}
