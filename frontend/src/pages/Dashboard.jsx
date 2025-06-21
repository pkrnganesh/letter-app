import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import logo from "../assets/warrantmelogo.svg";

const quotes = [
  "💡 Reflect. Write. Grow.",
  "✍️ Express your thoughts clearly.",
  "📔 A diary a day keeps the chaos away.",
  "🌓 Your thoughts deserve a space.",
  "🌠 Even small entries hold big emotions."
];

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [savedLetters, setSavedLetters] = useState([]);
  const [view, setView] = useState("editor");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("letterDrafts")) || [];
    setDrafts(savedDrafts);
  }, []);

  useEffect(() => {
    localStorage.setItem("letterDrafts", JSON.stringify(drafts));
  }, [drafts]);

  const fetchLetters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/letters/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedLetters(res.data.files);
    } catch (err) {
      toast.error("❌ Failed to fetch entries.");
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleSaveDraft = () => {
    if (content.trim()) {
      const newDraft = { id: Date.now(), content };
      setDrafts([newDraft, ...drafts]);
      setContent("");
      toast.success("✅ Draft saved locally!");
    }
  };

  const handleDeleteDraft = (id) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    toast.info("🗑️ Draft deleted");
  };

  const handleLoadDraft = (draftContent) => {
    setContent(draftContent);
    setView("editor");
    toast("✏️ Draft loaded");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/letters/save",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Saved to Google Drive!");
      setContent("");
      await fetchLetters();
    } catch (err) {
      toast.error("❌ Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap" rel="stylesheet" />
      <style>{`
        * {
          font-family: 'Rubik', sans-serif;
        }

        @media (max-width: 768px) {
          .layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100% !important;
            flex-direction: row;
            overflow-x: auto;
            justify-content: space-around;
            padding: 1rem !important;
          }
          .sidebar button {
            flex: 1;
            font-size: 0.85rem;
          }
          .main {
            padding: 1rem !important;
          }
        }
      `}</style>

      <div className="layout" style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0F172A",
        color: "#F1F5F9"
      }}>
        {/* Sidebar */}
        <aside className="sidebar" style={{
          width: "260px",
          background: "#1E293B",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderRight: "1px solid #334155",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* <img src={logo} alt="Smart Diary" style={{ width: "30px" }} /> */}
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#FACC15" }}>Smart Diary</h2>
          </div>
          {["editor", "drafts", "drive"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? "#F97316" : "#334155",
                color: "white",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                transition: "0.3s"
              }}
            >
              {v === "editor" ? "✍️ Write" : v === "drafts" ? "🗂 Drafts" : "☁️ Drive"}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            style={{
              marginTop: "auto",
              backgroundColor: "#EF4444",
              padding: "0.75rem",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold"
            }}
          >
            🚪 Logout
          </button>
        </aside>

        {/* Main */}
        <main className="main" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <p style={{ color: "#94A3B8", textAlign: "center", marginBottom: "1rem" }}>
            {quotes[quoteIndex]}
          </p>

          {view === "editor" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", color: "#F97316", marginBottom: "1rem" }}>📓 New Entry</h3>
              <textarea
                placeholder="Start typing your thoughts..."
                style={{
                  width: "100%",
                  height: "250px",
                  padding: "1rem",
                  fontSize: "15px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "#1E293B",
                  color: "white",
                  resize: "none"
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button onClick={handleSaveDraft} disabled={!content} style={{
                  background: "#FACC15",
                  color: "#1E293B",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: !content ? "not-allowed" : "pointer"
                }}>
                  Save Draft
                </button>
                <button onClick={handleSave} disabled={loading || !content} style={{
                  background: "#3B82F6",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer"
                }}>
                  {loading ? "Saving..." : "Save to Drive"}
                </button>
              </div>
            </div>
          )}

          {view === "drafts" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", color: "#F97316", marginBottom: "1rem" }}>🗂 Drafts</h3>
              {drafts.length === 0 ? (
                <p>No drafts yet.</p>
              ) : (
                drafts.map((draft) => (
                  <div key={draft.id} style={{
                    background: "#1E293B",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}>
                    <p style={{
                      color: "#CBD5E1",
                      margin: 0,
                      maxWidth: "70%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>{draft.content}</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleLoadDraft(draft.content)} style={{
                        background: "#60A5FA", color: "white", borderRadius: "5px", padding: "6px 12px", border: "none"
                      }}>Load</button>
                      <button onClick={() => handleDeleteDraft(draft.id)} style={{
                        background: "#EF4444", color: "white", borderRadius: "5px", padding: "6px 12px", border: "none"
                      }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {view === "drive" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", color: "#F97316", marginBottom: "1rem" }}>☁️ Drive Entries</h3>
              {savedLetters.length === 0 ? (
                <p>No entries yet.</p>
              ) : (
                savedLetters.map((file) => (
                  <div key={file.id} style={{
                    background: "#1E293B",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <p style={{ margin: 0, color: "#E2E8F0" }}>{file.name}</p>
                    <a href={file.webViewLink} target="_blank" rel="noreferrer" style={{
                      background: "#3B82F6",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      textDecoration: "none"
                    }}>View</a>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
