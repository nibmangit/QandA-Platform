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

  const handleLogin = (e) => {
    console.log("email:", email, "Password:", password)
    e.preventDefault();
    const success = login(email, password);
    if (success) navigate("/");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill out all input fields!");
      return;
    }

    const success = register({ name, email, password });
    if (success) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-[#0F172A] transition-colors">
      <div className="flex w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-[#1E293B] transition-colors">

        {/* LEFT SIDE */}
        <div
          className="hidden md:flex w-1/2 items-center justify-center p-12"
          style={{ background: `linear-gradient(45deg, ${BDU.NAVY} 0%, #004488 100%)` }}
        >
          <div className="text-white text-center">
            <BookOpen size={64} className="mx-auto mb-4" style={{ color: BDU.GOLD }} />
            <h2 className="text-3xl font-bold font-poppins">The Pursuit of Knowledge</h2>
            <p className="mt-2 text-sm opacity-90 font-roboto">
              Join the BDU community to share and discover answers.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="space-y-4"
          >
            {isRegister && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-[#0F172A] dark:text-gray-100"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {!isRegister && (
              <div className="text-right text-sm">
                <button type="button" className="hover:underline text-blue-600 dark:text-blue-400 hover:cursor-pointer">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-4 text-white font-bold rounded-xl shadow-md hover:opacity-90"
              style={{ backgroundColor: BDU.ACCENT }}
            >
              {isRegister ? "Register" : "Login"}
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
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
