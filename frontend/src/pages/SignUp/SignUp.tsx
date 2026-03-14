import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!name || !email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (name.length > 50) {
      setLocalError("Name is too long");
      return;
    }

    if (email.length > 64) {
      setLocalError("Email is too long");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    await signup(name, email, password, 0);
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
          className="relative flex flex-col justify-center min-h-[180px] lg:h-full p-8 lg:p-12 bg-gradient-to-br from-[#BE6F50] to-[#9A5840] overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#F6C388] opacity-20 blur-3xl" />
          <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl" />

          {/* Content */}
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl xl:text-6xl text-white font-bold mb-4"
            >
              Epicure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg lg:text-xl xl:text-2xl text-white/90 font-light leading-relaxed max-w-md"
            >
              Join our community of food lovers and discover amazing recipes
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex flex-col gap-3 mt-8"
            >
              {[
                "Save your favorite recipes",
                "Create personal cookbooks",
                "Connect with talented chefs"
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
          className="flex items-center justify-center p-6 lg:p-12 bg-[#1F1D1C]"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl text-white font-bold mb-2">Create account</h2>
              <p className="text-gray-400 mb-8">Start your culinary journey today</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Name</label>
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
                    placeholder="Enter your name"
                    className="flex-1 bg-transparent text-white px-3 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
                    className="flex-1 bg-transparent text-white px-3 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
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
                    className="flex-1 bg-transparent text-white px-3 py-3.5 outline-none placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
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
                transition={{ delay: 0.5 }}
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
                  <span>Create account</span>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#1F1D1C] text-gray-500 text-sm">or</span>
                </div>
              </div>

              {/* Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="space-y-3"
              >
                <p className="text-center text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#BE6F50] hover:text-[#E8956E] font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="text-center text-gray-400">
                  Want to share recipes?{" "}
                  <Link
                    to="/creatorSignup"
                    className="text-[#BE6F50] hover:text-[#E8956E] font-medium transition-colors"
                  >
                    Join as a chef
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

export default SignUp;
