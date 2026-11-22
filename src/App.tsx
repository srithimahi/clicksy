import Booth from "./Booth";
import CreationsGallery from "./CreationsGallery";
import CreativeStudio from "./CreativeStudio";
import { useEffect, useState } from "react";
import { loadStudioData } from "./studioStorage"; 
import type { SavedStudioCreation } from "./creationTypes";
import "./App.css";

type ModeCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

function ModeCard({
  title,
  description,
  onClick,
}: ModeCardProps) {
  return (
    <button className="mode-card" onClick={onClick}>
      <h2>{title}</h2>
      <p>{description}</p>
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState<
    "home" | "booth" | "studio" | "gallery"
  >("home");

  const [studioPhotos, setStudioPhotos] = useState<string[]>([]);
  const [studioSessionId, setStudioSessionId] = useState(0);
  const [selectedCreation, setSelectedCreation] = useState<SavedStudioCreation | null>(null);
  const [photosReady, setPhotosReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restorePhotos() {
      try {
        const saved = await loadStudioData<{
          photos: string[];
        }>("current-creation");

        if(!cancelled && saved && Array.isArray(saved.photos)) {
          setStudioPhotos(saved.photos);
        }
      } catch(error) {
        console.error("Could not restore photos: ", error);
      } finally {
        if(!cancelled) {
          setPhotosReady(true);
        }
      }
    }

    void restorePhotos();

    return() => {
      cancelled = true;
    };
  }, []);

  if(screen === "booth") {
    return <Booth onBack={() => setScreen("home")} 
                  onOpenStudio={(photos) => {
                    setStudioPhotos(photos);
                    setSelectedCreation(null);
                    setStudioSessionId((previous) => previous + 1);
                    setScreen("studio");
                  }}
            />;
  }

  if(screen === "gallery") {
    return(
      <CreationsGallery onBack={() => setScreen("home")}
        onOpenCreation={(creation) => {
          setSelectedCreation(creation);
          setStudioPhotos(creation.photos);
          setStudioSessionId((previous) => previous + 1);
          setScreen("studio");
        }}
      />
    );
  }

  if(screen === "studio" && !photosReady) {
    return <main className="studio-page">loading your creation...</main>
  }

  if(screen === "studio") {
    return (
      <CreativeStudio key={studioSessionId}
        onBack={() => setScreen("home")}
        photos={studioPhotos}
        isNewSession={selectedCreation === null && studioSessionId > 0}
        initialCreation={selectedCreation}
      />
    );
  }

  return (
    <main className="homepage">
      <header>
        <h1>clicksy</h1>
        <p>snap it. style it. save it.</p>
      </header>

      <section className="mode-selection">
        <ModeCard
          title="Quick Booth"
          description="Capture the little moments"
          onClick={() => setScreen("booth")}
        />

        <ModeCard
          title="Creative Studio"
          description="Make your memories your own"
          onClick={() => setScreen("studio")}
        />

        <ModeCard 
          title="My Creations"
          description="Your saved memories"
          onClick={() => setScreen("gallery")}
        />
      </section>
    </main>
  );
}

export default App;