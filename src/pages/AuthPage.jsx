import { useState } from "react";
import { BookOpen } from "lucide-react";
import { BDU } from "../utils/css"; 
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const AuthPage = ({ isRegister, setIsRegister }) => {
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill out all input fields!");
      return;
    }
    try{
      setIsLoading(true);
      const response = await login(email, password);
      console.log("Login response:", response);
      if(response){
       navigate("/dashboard"); 
      } 
    } catch {
      setError("Invalid email or password.");
    }finally{
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
    setError(
      "Password must be at least 6 characters and include letters and numbers."
    );
    return;
  }
  try{
    setIsLoading(true);
    const response = await register({ name, email, password });
     if(response) {setIsRegister(false)};
  }catch {
    setError("Registration failed. Email may already be in use.");  
  }finally{
    setIsLoading(false);
  }
  };

  return (
    <div className="max-h-screen flex items-center justify-center p-1 bg-gray-100 dark:bg-[#0F172A] transition-colors">
      <div className="flex flex-col mt-0 md:flex-row w-full max-w-5xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden">
        
        
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

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
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

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {!isRegister && (
              <div className="text-right text-sm">
                <button type="button" className="hover:underline text-blue-600 dark:text-blue-400 cursor-pointer">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-4 text-white font-bold rounded-xl shadow-md hover:opacity-90 hover:scale-[1.02] transition transform"
              style={{ backgroundColor: BDU.ACCENT }}
            >
              {isLoading ? "Processing..." : isRegister ? "Register" : "Login"}
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
              className="ml-1 font-semibold hover:underline text-blue-600 dark:text-blue-400"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>

          {/* Decorative background blur circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-yellow-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
