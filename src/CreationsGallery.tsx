import {useEffect, useState} from "react";
import {loadGalleryCreations, saveGalleryCreation, deleteGalleryCreation, type GalleryCreation,} from "./studioStorage";
import type { SavedStudioCreation } from "./creationTypes";

type CreationsGalleryProps = {
    onBack: () => void;
    onOpenCreation: (creation: SavedStudioCreation) => void;
};

export default function CreationsGallery({
    onBack,
    onOpenCreation,
}: CreationsGalleryProps) {
    const [creations, setCreations] = useState<GalleryCreation<SavedStudioCreation>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [renameId, setRenameId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");


    useEffect(() => {
        let cancelled = false;

        async function loadCreations() {
            try {
                const saved = await loadGalleryCreations<SavedStudioCreation>();
                if(!cancelled) {
                    setCreations([...saved].sort((a, b) => b.createdAt - a.createdAt));
                }
            } catch(err) {
                console.error("Could not load gallery: ", err);

                if(!cancelled) {
                    setError("couldn't load your creations");
                }
            } finally {
                if(!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadCreations();

        return() => {
            cancelled = true;
        };
    }, []);

    async function handleDelete() {
        if(!deleteId || deleting) {
            return;
        }

        const idToDelete = deleteId;

        setDeleting(true);
        setError("");

        try {
            await deleteGalleryCreation(idToDelete);
            setCreations((previous) =>
                previous.filter((creation) => creation.id !== idToDelete)
            );

            setDeleteId(null);
        } catch(error) {
            console.error("Could not delete creation: ", error);
            setError("Couldn't delete your creation. Try again.");
        } finally {
            setDeleting(false);
        }
    }

    async function handleRename() {
        if(!renameId || !newName.trim()) {
            return;
        }

        const creation = creations.find((item) => item.id === renameId);

        if(!creation) {
            return;
        }

        const name = newName.trim();
        const updatedCreation = {
            ...creation,
            name,
            updatedAt: Date.now(),
            data: {
                ...creation.data,
                name,
            },
        };

        try {
            setError("");
            await saveGalleryCreation(updatedCreation);

            setCreations((previous) => previous.map((item) =>
                item.id === renameId ? updatedCreation : item
            ));

            setRenameId(null);
            setNewName("");
        } catch(error) {
            console.error("Could not rename creation: ", error);
            setError("Couldn't rename your creation. Try again.");
        }
    }

    return(
        <main className="studio-page gallery-page">
            <header className="studio-header">
                <button type="button"
                    className="studio-back"
                    onClick={onBack}
                >
                    Back
                </button>

                <span className="studio-logo">
                    clicksy
                </span>
            </header>

            <section style={{ 
                padding: "32px 24px",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}>
                <h1>my creations</h1>
                <p>all your creations in one place!</p>

                {loading && <p>loading your memories</p>}
                {error && <p role="alert">{error}</p>}

                {!loading && !error && creations.length === 0 && (
                    <p>no saved creations yet. let's make some!</p>
                )}

                {!loading && !error && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                        gap: "20px",
                        marginTop: "24px",
                        width: "100%",
                        maxHeight: "70vh",
                        overflowY: "auto",
                        overflowX: "hidden",

                        padding: "8px 12px 16px 8px",
                        boxSizing: "border-box",
                        alignContent: "start",
                    }}
                    >
                        {creations.map((creation) => (
                            <article key={creation.id}
                                className="gallery-creation-card"
                                onClick={() => onOpenCreation(creation.data)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if(event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onOpenCreation(creation.data);
                                    }
                                }}
                                style={{
                                    background: "#fff8fb",
                                    border: "1px solid #f0cbd9",
                                    borderRadius: "18px",
                                    padding: "16px",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(163, 76, 112, 0.08)",
                                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                }}
                            >
                                {creation.data.thumbnail ? (
                                    <img src={creation.data.thumbnail}
                                        alt={`Preview of ${creation.name}`}
                                        loading="lazy"
                                        style={{
                                            width: "100%",
                                            height: "220px",
                                            objectFit: "contain",
                                            borderRadius: "12px",
                                            background: "#fff5f8",
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                            width: "100%",
                                            height: "220px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "12px",
                                            background: "#fff5f8",
                                            color: "#a34c70",
                                            fontSize: "13px",
                                            textAlign: "center",
                                            padding: "12px",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        preview coming soon
                                    </div>
                                )}

                                <h2 style={{fontSize:"16px"}}>
                                    {creation.name}
                                </h2>

                                <p style={{fontSize: "12px"}}>
                                    {new Date(creation.createdAt).toLocaleDateString()}
                                </p>

                                <p style={{fontSize: "12px"}}>
                                    {creation.data.stickers.length} stickers ·{""}
                                    {creation.data.texts.length} text elements
                                </p>

                                <button type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setRenameId(creation.id);
                                        setNewName(creation.name);
                                    }}
                                    style={{
                                        marginTop: "12px",
                                        marginRight: "8px",
                                        padding: "8px 12px",
                                        borderRadius: "10px",
                                        border: "1px solid #e9a5ba",
                                        background: "#fff0f5",
                                        color: "#a34c70",
                                        cursor: "pointer",
                                    }}
                                >
                                    Rename
                                </button>

                                <button type="button"
                                    disabled={deleting}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setDeleteId(creation.id);
                                    }}
                                    style={{
                                        marginTop: "12px",
                                        padding: "8px 12px",
                                        borderRadius: "10px",
                                        border: "1px solid #e9a5ba",
                                        background: "#fff0f5",
                                        color: "#a34c70",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </article>
                        ))}
                    </div>
                )}

                {renameId && (
                    <div className="gallery-modal-overlay">
                        <form className="gallery-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="gallery-rename-title"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleRename();
                            }}
                        >
                            <h2 id="gallery-rename-title">
                                rename your strip
                            </h2>

                            <p>give your strip a new name</p>

                            <input type="text"
                                value={newName}
                                maxLength={60}
                                onChange={(event) => setNewName(event.target.value)}
                                placeholder="my strip"
                                autoFocus 
                            />

                            <div className="gallery-modal-actions">
                                <button type="button"
                                    className="gallery-modal-cancel"
                                    onClick={() => setRenameId(null)}
                                >
                                    cancel
                                </button>

                                <button type="submit"
                                    className="gallery-modal-confirm"
                                    disabled={!newName.trim()}
                                >
                                    save name
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {deleteId && (
                    <div className="gallery-modal-overlay">
                        <div className="gallery-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="gallery-delete-title"
                        >
                            <h2 id="gallery-delete-title">
                                delete this memory?
                            </h2>

                            <p>
                                Are you sure? This creation will be permanently deleted.
                            </p>

                            <div className="gallery-modal-actions">
                                <button type="button"
                                    className="gallery-modal-cancel"
                                    disabled={deleting}
                                    onClick={() => setDeleteId(null)}
                                >
                                    keep it
                                </button>

                                <button type="button"
                                    className="gallery-modal-danger"
                                    disabled={deleting}
                                    onClick={() => void handleDelete()}
                                >
                                    {deleting ? "deleting..." : "yes, delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                   
            </section>
        </main>
    );
}