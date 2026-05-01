import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("google_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    localStorage.setItem("google_user", JSON.stringify(decoded)); // Save to localStorage
    console.log("Logged in:", decoded);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("google_user"); // Remove from localStorage
  };

  return (
    <section
      style={{
        display: "grid",
        gap: "50px",
      }}
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          {!user ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
              <GoogleLogin
                onSuccess={handleLogin}
                onError={() => alert("Login Failed")}
              />
            </div>
          ) : (
            <>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, {user.name}!
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </GoogleOAuthProvider>
    </section>
  );
}

export default App;
