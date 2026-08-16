"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa6";
import { signIn } from "next-auth/react";
export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      switch (response.status) {
        case 200:
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          router.push("/products");
          return;

        case 400:
          setError(data.message);
          return;

        case 401:
          setError(data.message);
          return;

        case 403:
          setError(data.message);
          return;

        case 423:
          setError(data.message);
          return;

        case 429:
          setError("Too many login attempts");
          return;

        case 500:
          setError("Internal server error");
          return;

        default:
          setError("Unexpected error");
      }
    } catch {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

const handleSocialLogin = (provider: string) => {
  const user = {
    id: Date.now(),
    name: `${provider} User`,
    email: `${provider.toLowerCase()}@demo.com`,
    provider,
  };

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  router.push("/products");
};

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
     <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl grid md:grid-cols-2">

       {/* LEFT PANEL */}
       <div
         className="hidden md:flex flex-col justify-center items-center p-12 text-white"
         style={{
           background:
             "linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%)",
         }}
       >
         <div className="text-7xl mb-6">🛍️</div>

         <h1 className="text-5xl font-bold mb-4">
           ShopKart
         </h1>

         <p className="text-center text-blue-100 text-lg leading-relaxed max-w-sm">
           Discover thousands of products,
           exclusive deals and the latest trends.
         </p>
       </div>

       {/* RIGHT PANEL */}
       <div className="p-10 md:p-14 flex flex-col justify-center">
         <h2 className="text-4xl font-bold text-gray-800 mb-2">
           Welcome Back
         </h2>

         <p className="text-gray-500 mb-8">
           Sign in to continue shopping
         </p>

         <form onSubmit={handleLogin}>
           <input
             type="email"
             placeholder="Email Address"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full rounded-xl border border-gray-300 px-4 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-700"
           />

           <input
             type="password"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="w-full rounded-xl border border-gray-300 px-4 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-700"

          />

          {error && (
            <p className="mb-4 text-red-500">
              {error}
            </p>
          )}

           <button
             type="submit"
             disabled={loading}
             className="
               w-full
               py-4
               rounded-xl
               text-white
               font-semibold
               text-lg
               hover:scale-[1.02]
               transition-all
               shadow-lg
             "
             style={{
               backgroundColor: "#1e3a8a"
             }}
           >
             {loading ? "Signing In..." : "Login"}
           </button>

<div className="my-6 flex items-center">
  <div className="flex-1 border-t border-gray-300"></div>
  <span className="px-4 text-gray-500 text-sm">OR</span>
  <div className="flex-1 border-t border-gray-300"></div>
</div>

<div className="flex justify-center gap-5">
  <button
    type="button"
    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md hover:scale-105 transition"

     onClick={() => handleSocialLogin("Google")}>
    <FcGoogle size={24}/>
  </button>

  <button
    type="button"
    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md hover:scale-105 transition"
  onClick={() => handleSocialLogin("facebook")}
  >
    <FaFacebook size={22} color="#1877F2" />
  </button>

  <button
    type="button"
    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md hover:scale-105 transition"
  onClick={() => handleSocialLogin("mocrosoft")}>
    <FaMicrosoft size={20} color="#00A4EF" />
  </button>
</div>

<p className="text-center text-sm text-gray-500 mt-3">
  Continue with social account
</p>
           `<div className="mt-6 text-center">
              <span className="text-gray-600">
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="ml-2 font-semibold hover:underline" style={{ color: "#1e3a8a" }}
              >
                Sign Up
              </button>
            </div>
         </form>
       </div>
     </div>
   </div>
   );
   }