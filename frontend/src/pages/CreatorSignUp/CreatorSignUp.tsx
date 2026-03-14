import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader, FiCamera, FiFileText, FiCheck } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";

const CreatorSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { error, loading, signup } = useSignup();
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Medium", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password || !bio) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (!picture) {
      setLocalError("Please upload a profile picture");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    await signup(name, email, password, 1, bio, picture);
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocalError("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPicture(reader.result as string);
      };
      reader.onerror = () => {
        setLocalError("Error uploading image. Please try again.");
      };
    }
  };

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  return (
    <div className="h-full rounded-xl bg-[#1E1C1A] overflow-hidden">
      <div className="h-full lg:grid lg:grid-cols-2">
        {/* Left Panel - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col justify-center min-h-[160px] lg:h-full p-8 lg:p-12 bg-gradient-to-br from-[#BE6F50] to-[#9A5840] overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl" />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4"
            >
              <LuChefHat className="text-4xl lg:text-5xl text-white" />
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white font-bold">
                Epicure
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg lg:text-xl xl:text-2xl text-white/90 font-light leading-relaxed max-w-md"
            >
              Share your culinary creations with food lovers around the world
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex flex-col gap-3 mt-8"
            >
              {[
                "Share unlimited recipes",
                "Build your follower base",
                "Monetize your content"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80">
                  <FiCheck className="text-white/60" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center p-6 lg:p-10 bg-[#1F1D1C] overflow-y-auto"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl lg:text-3xl text-white font-bold mb-2">Become a Chef</h2>
              <p className="text-gray-400 mb-6">Create your content creator account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center mb-2"
              >
                <label className="relative cursor-pointer group">
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-2 transition-colors ${
                    picture ? "border-[#BE6F50]" : "border-white/20 hover:border-[#BE6F50]/50"
                  }`}>
                    {picture ? (
                      <img src={picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <FiCamera className="text-2xl text-gray-500 group-hover:text-[#BE6F50] transition-colors" />
                      </div>
                    )}
                  </div>
                  {picture && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#BE6F50] rounded-full flex items-center justify-center">
                      <FiCheck className="text-white text-sm" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="hidden"
                  />
                </label>
              </motion.div>
              <p className="text-center text-xs text-gray-500 mb-4">
                {picture ? "Click to change photo" : "Upload profile photo"}
              </p>

              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Chef Name</label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focusedField === "name"
                      ? "border-[#BE6F50] bg-[#BE6F50]/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <FiUser className={`ml-4 transition-colors ${focusedField === "name" ? "text-[#BE6F50]" : "text-gray-500"}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your chef name"
                    className="flex-1 bg-transparent text-white px-3 py-3 outline-none placeholder:text-gray-500"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focusedField === "email"
                      ? "border-[#BE6F50] bg-[#BE6F50]/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <FiMail className={`ml-4 transition-colors ${focusedField === "email" ? "text-[#BE6F50]" : "text-gray-500"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-white px-3 py-3 outline-none placeholder:text-gray-500"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    focusedField === "password"
                      ? "border-[#BE6F50] bg-[#BE6F50]/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <FiLock className={`ml-4 transition-colors ${focusedField === "password" ? "text-[#BE6F50]" : "text-gray-500"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                    className="flex-1 bg-transparent text-white px-3 py-3 outline-none placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          className={`h-full ${passwordStrength.color} rounded-full`}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`text-xs ${
                        passwordStrength.label === "Weak" ? "text-red-400" :
                        passwordStrength.label === "Medium" ? "text-yellow-400" : "text-green-400"
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Bio Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <div
                  className={`relative rounded-xl border transition-all duration-200 ${
                    focusedField === "bio"
                      ? "border-[#BE6F50] bg-[#BE6F50]/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start pt-3">
                    <FiFileText className={`ml-4 mt-0.5 transition-colors ${focusedField === "bio" ? "text-[#BE6F50]" : "text-gray-500"}`} />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onFocus={() => setFocusedField("bio")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us about yourself and your cooking style..."
                      rows={3}
                      className="flex-1 bg-transparent text-white px-3 pb-3 outline-none placeholder:text-gray-500 resize-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {localError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <FiAlertCircle className="flex-shrink-0" />
                    <span>{localError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#BE6F50] hover:bg-[#A85D40] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <LuChefHat />
                    <span>Start cooking</span>
                  </>
                )}
              </motion.button>

              {/* Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="space-y-2 pt-2"
              >
                <p className="text-center text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#BE6F50] hover:text-[#E8956E] font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="text-center text-gray-400 text-sm">
                  Just want to browse?{" "}
                  <Link
                    to="/signup"
                    className="text-[#BE6F50] hover:text-[#E8956E] font-medium transition-colors"
                  >
                    Sign up as user
                  </Link>
                </p>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorSignUp;
