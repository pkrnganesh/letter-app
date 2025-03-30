// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import logo from "../assets/warrantmelogo.svg";

// const Login = () => {
//   const handleSuccess = async (credentialResponse) => {
//     try {
//       const res = await axios.post("https://letter-app-t13p.onrender.com/api/auth", {
//         token: credentialResponse.credential,
//       });
//       localStorage.setItem("token", res.data.accessToken);
//       window.location.href = `https://letter-app-t13p.onrender.com/api/auth/init?token=${res.data.accessToken}`;
//     } catch (err) {
//       console.error(err);
//       alert("Login Failed!");
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         backgroundColor: "#0F1115",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         color: "white",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1200px",
//           width: "100%",
//           display: "flex",
//           backgroundColor: "#1C1E22",
//           borderRadius: "10px",
//           overflow: "hidden",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
//         }}
//       >
//         {/* Left Section */}
//         <div
//           style={{
//             flex: 1,
//             padding: "3rem",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", lineHeight: "1.3" }}>
//             One stop solution <br /> to all your <span style={{ color: "#F97316" }}>Letter</span> needs
//           </h1>
//           <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
//             Login securely & save your letters directly to your Google Drive with WarrantyMe.
//           </p>
//         </div>

//         {/* Right Section */}
//         <div
//           style={{
//             flex: 1,
//             backgroundColor: "white",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "2rem",
//           }}
//         >
//           <img src={logo} alt="WarrantyMe Logo" style={{ width: "60px", marginBottom: "1rem" }} />
//           <h2 style={{ color: "#1C1E22", marginBottom: "0.5rem" }}>WarrantyMe Letters</h2>
//           <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>Sign in to continue</p>
//           <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Login Failed")} />
//           <p style={{ marginTop: "2rem", color: "#9CA3AF", fontSize: "0.9rem" }}>
//             © 2025 WarrantyMe Letters
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import logo from "../assets/warrantmelogo.svg";

const Login = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      // Step 1: Login → Get JWT token
      const res = await axios.post(
        "https://letter-app-t13p.onrender.com/api/auth",
        { token: credentialResponse.credential }
      );

      const token = res.data.accessToken;
      localStorage.setItem("token", token);

      // Step 2: Start Drive Consent Flow with redirect URL
      window.location.href = `https://letter-app-t13p.onrender.com/api/auth/init?token=${token}&redirectUrl=https://letter-app-beta.vercel.app/dashboard`;
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F1115",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          backgroundColor: "#1C1E22",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            flex: 1,
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", lineHeight: "1.3" }}>
            One stop solution <br /> to all your{" "}
            <span style={{ color: "#F97316" }}>Letter</span> needs
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "1.1rem" }}>
            Login securely & save your letters directly to your Google Drive with WarrantyMe.
          </p>
        </div>

        {/* Right Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <img src={logo} alt="WarrantyMe Logo" style={{ width: "60px", marginBottom: "1rem" }} />
          <h2 style={{ color: "#1C1E22", marginBottom: "0.5rem" }}>WarrantyMe Letters</h2>
          <p style={{ color: "#6B7280", marginBottom: "1.5rem" }}>Sign in to continue</p>
          <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Login Failed")} />
          <p style={{ marginTop: "2rem", color: "#9CA3AF", fontSize: "0.9rem" }}>
            © 2025 WarrantyMe Letters
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
