# Google Authentication in React

This project demonstrates how to integrate Google Authentication in a React application using the `@react-oauth/google` library.

## Libraries Used
- **`@react-oauth/google`**: Official Google Identity Services wrapper for React.
- **`jwt-decode`**: Used to decode the JWT credential received from Google to extract user profile information.
- **Tailwind CSS**: For styling the UI.

## Step-by-Step Implementation Guide

### 1. Installation
Install the necessary dependencies:
```bash
npm install @react-oauth/google jwt-decode
```

### 2. Setup Google Client ID
Get a Google Client ID from the Google Cloud Console.
Add it to your `.env` file (ensure you replace with your actual ID):
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

### 3. Wrap App with `GoogleOAuthProvider`
In your `App.jsx`, wrap the components where you need Google Auth with `GoogleOAuthProvider` and provide the client ID from environment variables.
```jsx
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Your application components */}
    </GoogleOAuthProvider>
  );
}
```

### 4. Implement `GoogleLogin` Component
Use the `GoogleLogin` component to render the standard Google sign-in button. Define the `onSuccess` callback to handle the authentication response and decode the JWT to get user details.
```jsx
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (credentialResponse) => {
    // Decode the credential to get user data (name, email, picture, etc.)
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    localStorage.setItem("google_user", JSON.stringify(decoded)); // Persist user session
    console.log("Logged in:", decoded);
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => alert("Login Failed")}
    />
  );
}
```

### 5. Handle Logout
To log a user out, simply clear the user state and remove the saved session data from `localStorage`.
```jsx
const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("google_user");
};
```

### 6. Persist Session on Reload
Use a `useEffect` hook to load the user from `localStorage` when the component mounts, so the user stays logged in across page reloads.
```jsx
import { useEffect } from "react";

useEffect(() => {
  const savedUser = localStorage.getItem("google_user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);
```
