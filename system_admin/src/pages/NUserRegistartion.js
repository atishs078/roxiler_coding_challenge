// src/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NUserRegistration = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normalUser", // ✅ default role
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onhandlechange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // ✅ Validation Function
  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

    if (!formdata.name) newErrors.name = "Name is required";

    if (!formdata.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formdata.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formdata.password) {
      newErrors.password = "Password is required";
    } else if (!passwordPattern.test(formdata.password)) {
      newErrors.password =
        "Password must be at least 6 characters, include 1 uppercase, 1 number, and 1 special character";
    }

    if (!formdata.address) {
      newErrors.address = "Address is required";
    } else if (formdata.address.length <= 10) {
      newErrors.address = "Address must be more than 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        alert("Signup successful 🎉");
        navigate("/login");
      } else {
        setErrors({ api: data.msg || "Signup failed" });
      }
    } catch (error) {
      console.error(error);
      setErrors({ api: "Server error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen px-4">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter name"
              name="name"
              value={formdata.name}
              onChange={onhandlechange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter email"
              name="email"
              value={formdata.email}
              onChange={onhandlechange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password"
              name="password"
              value={formdata.password}
              onChange={onhandlechange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter address"
              name="address"
              value={formdata.address}
              onChange={onhandlechange}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* API Error */}
          {errors.api && (
            <p className="text-red-500 text-sm text-center">{errors.api}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default NUserRegistration;
