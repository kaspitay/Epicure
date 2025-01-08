import { useState, useEffect } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSighnup";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./CreatorSignUp.css";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreatorSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, signup } = useSignup();
  const [showError, setShowError] = useState(false);
  const [charError, setCharError] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !bio) {
      setCharError("All fields are required");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    if (name.length > 32 || email.length > 32 || password.length > 32) {
      setCharError("Input cannot exceed 32 characters");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    if (!picture) {
      setCharError("Please upload a profile picture");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const success = await signup(name, email, password, 1, bio, picture);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setPicture(reader.result);
        setImageUploaded(true);
        setCharError("");
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
        setPicture(null);
        setImageUploaded(false);
        setCharError("Error uploading image. Please try again.");
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      };
    } else {
      setPicture(null);
      setImageUploaded(false);
      setCharError("Please select an image file.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleNameChange = (e) => {
    if (e.target.value.length <= 32) {
      setName(e.target.value);
      setCharError("");
    } else {
      setCharError("Name cannot exceed 32 characters");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 32) {
      setEmail(e.target.value);
      setCharError("");
    } else {
      setCharError("Email cannot exceed 32 characters");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handlePasswordChange = (e) => {
    if (e.target.value.length <= 32) {
      setPassword(e.target.value);
      setCharError("");
    } else {
      setCharError("Password cannot exceed 32 characters");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="h-full rounded-lg bg-[#1E1C1A]">
      <div className="font-syne h-full rounded-lg lg:grid lg:grid-cols-2">
        <div className="relative flex flex-col justify-center md:h-[250px] lg:h-full lg:rounded-lg gap-10 p-10 bg-[#BE6F50] overflow-hidden">
          <div className="absolute -top-5 -left-5 w-52 h-52 rounded-full bg-[#F6C388] filter blur-2xl opacity-30 lg:opacity-50 z-10 overflow-hidden"></div>
          <div className="absolute -bottom-10 -left-5 w-64 h-52 rounded-full bg-[#F6C388] filter blur-2xl opacity-30 lg:opacity-50 z-10 overflow-hidden"></div>
          <div className="absolute -bottom-5 -right-5 w-52 h-96 rounded-full bg-[#F6C388] filter blur-2xl opacity-30 lg:opacity-50 z-10 overflow-hidden"></div>{" "}
          <h1 className="md:text-[35px] lg:text-[50px] xl:text-[60px] text-white font-bold">
            Epicure
          </h1>
          <h2 className="font-syne lg:text-[35px] xl:text-[45px] text-white">
            Feast Your Senses Culinary Creators on Exclusive Hub
          </h2>
        </div>
        <div className="grid items-center md:h-[550px] lg:h-full lg:rounded-lg bg-[#1F1D1C]">
          <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl text-white font-bold mb-4">
              Sign up as
              <br></br>content creator
            </h2>
            <form onSubmit={handleSubmit} className="">
              <div className="mb-4">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                  className={`mt-1 p-2 block w-full border border-gray-300 bg-[#8f8f8f00] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    name ? "text-white" : ""
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={handleEmailChange}
                  className={`mt-1 p-2 block w-full border border-gray-300 bg-[#8f8f8f00] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    email ? "text-white" : ""
                  }`}
                  required
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  className={`mt-1 p-2 block w-full border border-gray-300 bg-[#8f8f8f00] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    password ? "text-white" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent text-[#e1e1e1]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mb-4">
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Your biography"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`mt-1 p-2 block w-full border border-gray-300 bg-[#8f8f8f00] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 ${
                    bio ? "text-white" : ""
                  }`}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={imageUploaded ? null : <CloudUploadIcon />}
                  style={{
                    backgroundColor: imageUploaded ? "#4CAF50" : undefined,
                  }}
                >
                  {imageUploaded ? "Image Uploaded" : "Upload image"}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handlePictureChange}
                    accept="image/*"
                  />
                </Button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#8F8F8F] text-white py-2 px-4 rounded-md hover:bg-[#BE6F50] focus:outline-none focus:bg-blue-600"
                disabled={loading}
              >
                Sign up
              </button>
              {showError && (
                <>
                  <div
                    className={`error-backdrop ${!showError ? "hidden" : ""}`}
                  ></div>
                  <div className={`error-modal ${!showError ? "hidden" : ""}`}>
                    {charError || error}
                  </div>
                </>
              )}
              <p className="text-white text-center mt-5">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="underline text-[#BE6F50]">Log in</span>
                </Link>
              </p>
              <p className="text-white text-center mt-5">
                User?{" "}
                <Link to="/signup">
                  <span className="underline text-[#BE6F50]">
                    Sign up as a user{" "}
                  </span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSignUp;
