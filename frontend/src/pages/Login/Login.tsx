import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { error, loading, login } = useLogin();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (email.length > 64) {
      setLocalError("Email is too long");
      return;
    }

    await login(email, password);
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
          className="relative flex flex-col justify-center min-h-[200px] lg:h-full p-8 lg:p-12 bg-gradient-to-br from-[#BE6F50] to-[#9A5840] overflow-hidden"
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
              Feast Your Senses on Culinary Creations from Exclusive Chefs
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex flex-col gap-3 mt-8"
            >
              {["Discover amazing recipes", "Follow your favorite chefs", "Create your own cookbooks"].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
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
              <h2 className="text-3xl text-white font-bold mb-2">Welcome back</h2>
              <p className="text-gray-400 mb-8">Sign in to continue to your account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Enter your password"
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#1F1D1C] text-gray-500 text-sm">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-gray-400"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#BE6F50] hover:text-[#E8956E] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
