import { useState, useEffect } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./Login.css"; // Import CSS file if needed
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const { error, loading, login } = useLogin();
  const [showError, setShowError] = useState(false);
  const [charError, setCharError] = useState(""); // State to manage character length error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    if (email.length > 32 || password.length > 32) {
      setCharError("Input cannot exceed 32 characters");
      setTimeout(() => setCharError(""), 2000);
      return;
    }
    const success = await login(email, password);
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleEmailChange = (e) => {
    if (e.target.value.length <= 32) {
      setEmail(e.target.value);
      setCharError("");
    } else {
      setCharError("Email cannot exceed 32 characters");
      setTimeout(() => setCharError(""), 2000);
    }
  };

  const handlePasswordChange = (e) => {
    if (e.target.value.length <= 32) {
      setPassword(e.target.value);
      setCharError("");
    } else {
      setCharError("Password cannot exceed 32 characters");
      setTimeout(() => setCharError(""), 2000);
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
            <h2 className="text-2xl text-white font-bold mb-4">Log in</h2>
            <form onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  className={`mt-1 p-2 pr-10 block w-full border border-gray-300 bg-[#8f8f8f00] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    password ? "text-white" : ""
                  }`}
                  required
                />
                {/* Eye icon button to toggle password visibility */}
                <button
                  type="button"
                  className="absolute text-[#e1e1e1] inset-y-0 right-0 flex items-center px-3 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#8F8F8F] text-white py-2 px-4 rounded-md hover:bg-[#BE6F50] focus:outline-none focus:bg-blue-600"
              >
                Log in
              </button>
              {showError && (
                <>
                  <div
                    className={`error-backdrop ${!showError ? "hidden" : ""}`}
                  ></div>
                  <div className={`error-modal ${!showError ? "hidden" : ""}`}>
                    {error}
                  </div>
                </>
              )}
              {charError && (
                <>
                  <div
                    className={`error-backdrop ${!charError ? "hidden" : ""}`}
                  ></div>
                  <div className={`error-modal ${!charError ? "hidden" : ""}`}>
                    {charError}
                  </div>
                </>
              )}
              <p className="text-white text-center mt-5">
                Dont have an account?{" "}
                <Link to="/signup">
                  <span className="underline text-[#BE6F50]">Sign up</span>
                </Link>{" "}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
