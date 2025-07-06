import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";
import axios from 'axios';
import bg from "../assets/auth.png";

const Signup = () => {
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name,
        email,
        password
      }, { withCredentials: true });

      setUserData(result.data);
      navigate("/customize");
    } catch (error) {
      setUserData(null);
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-center bg-cover bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignup}
        className="w-[90%] max-w-[500px] bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl flex flex-col gap-5 transition-all duration-500"
      >
        <h1 className="text-white text-3xl font-bold text-center">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full h-[55px] rounded-full px-5 text-white bg-white/10 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full h-[55px] rounded-full px-5 text-white bg-white/10 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[55px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            className="w-full h-full rounded-full px-5 pr-12 text-white bg-white/10 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <HiMiniEyeSlash
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
              size={22}
            />
          ) : (
            <IoEyeSharp
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
              size={22}
            />
          )}
        </div>

        {err && <p className="text-red-400 text-sm -mt-2">* {err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-white text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 underline cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
