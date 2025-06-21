import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import logo from "../assets/warrantmelogo.svg";

const Login = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth", {
        token: credentialResponse.credential,
      });

      const token = res.data.accessToken;
      localStorage.setItem("token", token);

      window.location.href = `http://localhost:5000/api/auth/init?token=${token}&redirectUrl=http://localhost:5173/dashboard`;
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #facc15, #eab308)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            maxWidth: "1000px",
            width: "100%",
            display: "flex",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#fff",
          }}
        >
          {/* Left Section */}
          <div
            style={{
              flex: 1,
              padding: "3rem",
              background: "#1f2937", // dark background
              color: "#fef3c7",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                fontWeight: "700",
                fontFamily: "'Great Vibes', cursive",
                color: "#fde68a",
              }}
            >
              Smart Diary
            </h1>
            <p
              style={{
                color: "#d1d5db",
                fontSize: "1.1rem",
                marginBottom: "1rem",
              }}
            >
              Capture your thoughts, memories, and reflections — beautifully
              stored forever in your private digital diary.
            </p>
            <p
              style={{
                fontStyle: "italic",
                color: "#facc15",
                fontSize: "1.05rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderRight: "2px solid #facc15",
                animation:
                  "typing 4s steps(40, end), blink .75s step-end infinite alternate",
              }}
            >
              “Write what should not be forgotten.” – Isabel Allende
            </p>

            <style>
              {`
                @keyframes typing {
                  from { width: 0 }
                  to { width: 100% }
                }
                @keyframes blink {
                  50% { border-color: transparent }
                }
              `}
            </style>
          </div>

          {/* Right Section */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {/* <img
              src={logo}
              alt="Smart Diary Logo"
              style={{ width: "60px", marginBottom: "1rem" }}
            /> */}
            <h2
              style={{
                color: "#1C1E22",
                marginBottom: "0.5rem",
                fontSize: "1.5rem",
              }}
            >
              Sign in to Smart Diary
            </h2>
            <p
              style={{
                color: "#6B7280",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Sign in with Google to begin writing and cherishing your daily
              moments.
            </p>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => alert("Login Failed")}
            />
            <p
              style={{
                marginTop: "2rem",
                color: "#9CA3AF",
                fontSize: "0.85rem",
              }}
            >
              © 2025 Smart Diary — Your Private Thought Space
            </p>
          </div>
        </div>
      </>
    </div>
  );
};

export default Login;
