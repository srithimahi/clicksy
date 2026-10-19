import Booth from "./Booth";
import { useState } from "react";
import "./App.css";

type ModeCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

function ModeCard({ title, description, onClick }: ModeCardProps) {
  return (
    <button className="mode-card" onClick={onClick}>
      <h2>{title}</h2>
      <p>{description}</p>
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState<"home" | "booth">("home");

  if(screen == "booth") {
    return <Booth onBack={() => setScreen("home")} />;
  }

  return (
    <main className="homepage">
      <header>
        <h1>clicksy</h1>
        <p>snap it. style it. save it.</p>
      </header>

      <section className="mode-selection">
        <ModeCard title="Quick Booth"
                  description="Capture the little moments"
                  onClick={() => setScreen("booth")}
        />

        <ModeCard title="Creative Studio"
                  description="Make your memories your own"
                  onClick={() => {}}
        />
      </section>
    </main>
  );
}

export default App;