import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/warrantmelogo.svg";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [savedLetters, setSavedLetters] = useState([]);

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("letterDrafts")) || [];
    setDrafts(savedDrafts);
  }, []);

  useEffect(() => {
    localStorage.setItem("letterDrafts", JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/letters/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedLetters(res.data.files);
      } catch (err) {
        console.error("Error fetching letters", err);
      }
    };

    fetchLetters();
  }, []);

  const handleSaveDraft = () => {
    if (content.trim()) {
      const newDraft = {
        id: Date.now(),
        content,
      };
      setDrafts([newDraft, ...drafts]);
      setContent("");
      alert("✅ Draft saved locally");
    }
  };

  const handleDeleteDraft = (id) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
  };

  const handleLoadDraft = (draftContent) => {
    setContent(draftContent);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/letters/save",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Letter saved to Google Drive!");
      console.log("File Info:", res.data.file);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F1115",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #27272a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="WarrantyMe" style={{ width: "40px" }} />
          <h2 style={{ margin: 0 }}>WarrantyMe Letters</h2>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* Editor */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "#F97316" }}>📄 Write Your Letter</h3>
        <textarea
          placeholder="Start writing here..."
          style={{
            width: "80%",
            maxWidth: "900px",
            height: "400px",
            padding: "1rem",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#1C1E22",
            color: "white",
            resize: "none",
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={handleSaveDraft}
            disabled={!content}
            style={{
              padding: "12px 20px",
              backgroundColor: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: !content ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            Save Draft
          </button>

          <button
            onClick={handleSave}
            disabled={loading || !content}
            style={{
              padding: "12px 20px",
              backgroundColor: loading ? "#a5b4fc" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Saving..." : "Save to Google Drive"}
          </button>
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div
            style={{
              marginTop: "3rem",
              width: "80%",
              maxWidth: "900px",
              textAlign: "left",
            }}
          >
            <h4 style={{ color: "#F97316" }}>📄 Saved Drafts</h4>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                style={{
                  backgroundColor: "#1C1E22",
                  padding: "1rem",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#eee",
                    maxWidth: "75%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {draft.content}
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleLoadDraft(draft.content)}
                    style={{
                      backgroundColor: "#4f46e5",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Letters */}
        {savedLetters.length > 0 && (
          <div
            style={{
              marginTop: "3rem",
              width: "80%",
              maxWidth: "900px",
              textAlign: "left",
            }}
          >
            <h4 style={{ color: "#F97316" }}>📂 Saved Letters in Drive</h4>
            {savedLetters.map((file) => (
              <div
                key={file.id}
                style={{
                  backgroundColor: "#1C1E22",
                  padding: "1rem",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ color: "#eee" }}>{file.name}</p>
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: "#4f46e5",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "1rem", color: "#9CA3AF" }}>
        © 2025 WarrantyMe Letters
      </footer>
    </div>
  );
};

export default Dashboard;
