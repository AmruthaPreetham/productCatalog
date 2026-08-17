"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
const validateForm = () => {
  const newErrors = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  };

  let isValid = true;

  // Full Name
  if (!name.trim()) {
    newErrors.name = "Full Name is required";
    isValid = false;
  }

  // Email
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    newErrors.email = "Email Address is required";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    newErrors.email =
      "Please enter a valid email address";
    isValid = false;
  }

  // Mobile
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobile.trim()) {
    newErrors.mobile = "Mobile Number is required";
    isValid = false;
  } else if (!mobileRegex.test(mobile)) {
    newErrors.mobile =
      "Please enter a valid 10-digit mobile number";
    isValid = false;
  }

  // Password
  if (!password) {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (password.length < 8) {
    newErrors.password =
      "Password must be at least 8 characters";
    isValid = false;
  } else if (
    !/(?=.*[A-Z])/.test(password)
  ) {
    newErrors.password =
      "Password must contain at least one uppercase letter";
    isValid = false;
  } else if (
    !/(?=.*[0-9])/.test(password)
  ) {
    newErrors.password =
      "Password must contain at least one number";
    isValid = false;
  } else if (
    !/(?=.*[!@#$%^&*])/.test(password)
  ) {
    newErrors.password =
      "Password must contain at least one special character";
    isValid = false;
  }

  // Confirm Password
  if (!confirmPassword) {
    newErrors.confirmPassword =
      "Confirm Password is required";
    isValid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword =
      "Passwords do not match";
    isValid = false;
  }

  setErrors(newErrors);

  return isValid;
};
  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();


    setSuccess("");
if (!validateForm()) {
  return;
}


    try {
      setLoading(true);

      // Check existing email
      const checkResponse = await fetch(
        `${API_BASE_URL}/users?email=${email}`
      );

      const existingUsers =
        await checkResponse.json();

      if (existingUsers.length > 0) {
        setErrors(
          "An account already exists with this email"
        );
        return;
      }

      // Save user in json-server
      const response = await fetch(
        `${API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            mobile,
            password,
            status: "ACTIVE",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to create account"
        );
      }

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(
        "Unable to connect to server"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl grid md:grid-cols-2">

        {/* Left Panel */}
        <div
          className="hidden md:flex flex-col justify-center items-center text-white p-12"
          style={{
            background:
              "linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%)",
          }}
        >
          <div className="text-7xl mb-6">
            🛍️
          </div>

          <h1 className="text-5xl font-bold mb-6">
            ShopKart
          </h1>

          <p className="text-center text-xl leading-relaxed">
            Join thousands of customers and
            discover exclusive deals every day.
          </p>

          <div className="mt-10 space-y-3 text-lg">
            <p>✓ 10,000+ Products</p>
            <p>✓ Secure Shopping</p>
            <p>✓ Fast Delivery</p>
            <p>✓ Daily Offers</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-8">
            Start shopping with ShopKart
          </p>

          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
           /> {errors.name && (
            <p className="text-red-500 text-sm mt-1">
            {errors.name}
            </p>)}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
      />     {errors.email && (
             <p className="text-red-500 text-sm mt-1">
               {errors.email}
             </p>
           )}

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />  {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile}
              </p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
         />  {errors.password && (
             <p className="text-red-500 text-sm mt-1">
               {errors.password}
             </p>
           )}

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
           /> {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}



            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
              style={{
                backgroundColor: "#1e3a8a",
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                router.push("/login")
              }
              className="ml-2 font-semibold hover:underline"
              style={{ color: "#1e3a8a" }}
            >
              Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}