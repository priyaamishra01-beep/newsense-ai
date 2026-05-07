import { useState } from "react";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function AuthPage({ setUser }) {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* =================================
     NORMAL LOGIN / SIGNUP
  ================================= */

  const handleSubmit = async () => {

    // ✅ Email Validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      alert("Enter valid email");

      return;
    }

    try {

      const endpoint = isLogin ? "login" : "signup";

      const response = await fetch(
        `https://newsense-ai-xzx5.onrender.com/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Server error");

    }
  };

  /* =================================
     GOOGLE LOGIN
  ================================= */

  const handleGoogleLogin = async () => {

    try {

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = {
        name: result.user.displayName,
        email: result.user.email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

    } catch (error) {

      console.log(error);

      alert("Google Login Failed");

    }
  };

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          bg-slate-900
          p-10
          rounded-2xl
          shadow-2xl
          w-[400px]
          border
          border-slate-700
        "
      >

        {/* TITLE */}

        <h1
          className="
            text-3xl
            font-bold
            text-center
            text-white
            mb-2
          "
        >
          🧠 NewsSense AI
        </h1>

        <p
          className="
            text-slate-400
            text-center
            mb-8
          "
        >
          AI Powered News Summarizer
        </p>

        {/* NAME */}

        {!isLogin && (

          <input
            type="text"
            placeholder="Enter Name"
            className="
              w-full
              p-3
              rounded-lg
              bg-slate-800
              text-white
              border
              border-slate-600
              mb-4
              outline-none
            "
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        )}

        {/* EMAIL */}

        <input
  type="email"
  placeholder="Enter Email"
  autoComplete="off"
  className="
    w-full
    p-3
    rounded-lg
    bg-slate-800
    text-white
    border
    border-slate-600
    mb-4
    outline-none
  "
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

        {/* PASSWORD */}

        <input
  type="password"
  placeholder="Enter Password"
  autoComplete="new-password"
  className="
    w-full
    p-3
    rounded-lg
    bg-slate-800
    text-white
    border
    border-slate-600
    mb-6
    outline-none
  "
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        {/* LOGIN BUTTON */}

        <button
          onClick={handleSubmit}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            transition-all
            p-3
            rounded-lg
            text-white
            font-semibold
          "
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        {/* OR LINE */}

        <div className="flex items-center my-6">

          <div className="flex-1 h-[1px] bg-slate-700"></div>

          <p className="px-4 text-slate-400 text-sm">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-slate-700"></div>

        </div>

        {/* GOOGLE BUTTON */}

        <button
          onClick={handleGoogleLogin}
          className="
            w-full
            bg-white
            text-black
            p-3
            rounded-lg
            flex
            items-center
            justify-center
            gap-3
            hover:bg-slate-200
            transition-all
            font-semibold
          "
        >

          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google

        </button>

        {/* TOGGLE LOGIN/SIGNUP */}

        <p
  className="
    text-center
    text-blue-400
    mt-6
    cursor-pointer
  "
  onClick={() => {

    setIsLogin(!isLogin);

    // Clear input fields
    setName("");
    setEmail("");
    setPassword("");

  }}
>
  {isLogin
    ? "Don't have an account? Signup"
    : "Already have an account? Login"}
</p>
      </div>

    </div>

  );
}

export default AuthPage;