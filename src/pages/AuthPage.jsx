import { useState } from "react";
import { Link } from 'react-router-dom';
import { BookOpen, Loader2, X } from "lucide-react";
import { BDU } from "../utils/css"; 
import { useAuth } from "../context/AuthContext";  
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = ({ isOpen, onClose, isRegister, setIsRegister }) => {
  const { login, register, loginWithGoogle, error, setError } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill out all input fields!");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await login(email, password); 
      if (response) {
        onClose(); 
      }else{
        setError("Invalid email or password.");
      }
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill out all input fields!");
      return;
    }
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
      setError("Name must be at least 2 letters and contain only letters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
      setError("Password must be at least 6 characters and include letters and numbers.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await register({ name, email, password });
      if (response) setIsRegister(false);
    } catch {
      setError("Registration failed. Email may already be in use.");  
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
  setError("");
  setEmail(""); 
  onClose();
};

  return ( 
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"> 
      <div className="relative flex flex-col md:flex-row w-full max-w-5xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
         
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
 
        <div className="hidden md:flex w-1/2 items-center justify-center p-12"
              style={{ background: `linear-gradient(135deg, ${BDU.NAVY} 0%, #004488 100%)` }}>
            <div className="text-center text-white">
              <BookOpen size={64} className="mx-auto mb-4" style={{ color: BDU.GOLD }} />

              <h2 className="text-3xl font-bold font-poppins mb-2">Empowering Curious Minds</h2>

              <p className="mt-2 text-sm opacity-90 font-roboto">
                Connect, learn, and share knowledge with BDU students.
              </p> 
              <div className="mt-6 flex flex-col space-y-2 text-left text-white text-sm font-roboto">
                <div className="flex items-center space-x-2"><span>📚</span><span>Ask & answer questions easily</span></div>
                <div className="flex items-center space-x-2"><span>⚡</span><span>Boost your reputation points</span></div>
                <div className="flex items-center space-x-2"><span>🏆</span><span>Earn badges for contributions</span></div>
                <div className="flex items-center space-x-2"><span>💬</span><span>Connect with other students</span></div>
              </div> 
              <div className="mt-6 w-24 h-2 bg-linear-to-r from-yellow-400 to-orange-500 mx-auto rounded-full animate-pulse"></div>
            </div>
        </div>
 
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-white dark:bg-[#1E293B]">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5">
            
            {isRegister && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

            {!isRegister && (
            <div className="text-right text-sm">
              <Link
                to="/forgot-password" 
                onClick={handleForgotPasswordClick}
                className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 text-white font-bold rounded-xl shadow-md hover:opacity-90 hover:scale-[1.02] transition transform flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: BDU.ACCENT,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                isRegister ? "Register" : "Login"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-900 dark:text-gray-100">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsRegister(!isRegister);
              }}
              className="ml-1 font-semibold hover:underline text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>

          <div className="mt-6">
  <div className="relative flex items-center justify-center mb-4">
    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
    <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">OR</span>
    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
  </div>

  <div className="w-full"> 
    <div className="block dark:hidden">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          setIsLoading(true);
          const success = await loginWithGoogle(credentialResponse.credential);
          if (success) onClose();
          setIsLoading(false);
        }}
        onError={() => setError("Google Login Failed")}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular" 
      />
    </div>
 
    <div className="hidden dark:block">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          setIsLoading(true);
          const success = await loginWithGoogle(credentialResponse.credential);
          if (success) onClose();
          setIsLoading(false);
        }}
        onError={() => setError("Google Login Failed")}
        theme="filled_black"
        size="large"
        text="continue_with"
        shape="rectangular" 
      />
    </div>
  </div>
</div>

          {/* Decorative background blur circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-yellow-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;