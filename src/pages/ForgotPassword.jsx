import { useState } from "react";
import apiPublic from "../api/axiosPublic";
// import axios  from "axios";
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" }); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const response = await apiPublic.post("/user/password-reset-request/", { email });
      setStatus({ 
        type: "success", 
        msg: response.data.message || "A recovery link has been sent to your email address." 
      });
    } catch (error) {
      // Handle different error states
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || "An error occurred.";
      setStatus({ type: "error", msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden p-6">
      <div className="w-full max-w-lg h-[600px] text-center flex flex-col justify-between space-y-4 p-6 sm:p-8 rounded-xl bg-gray-50 shadow-2xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-none border-2 border-transparent dark:border-gray-700">
        
        <div className="flex justify-center mt-2">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center rotate-3 transition-colors duration-500">
            <ShieldCheck size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
            Forgot Password?
          </h1>

          <p className="text-base text-gray-500 dark:text-gray-400 px-4 leading-relaxed">
            Enter the email address associated with your account and we'll send a reset link to your inbox.
          </p>

          {status.msg && (
            <div className={`mx-auto w-full max-w-sm p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${
              status.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800" 
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
            }`}>
              {status.type === "success" && <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
              <p className="text-xs font-bold leading-tight uppercase tracking-tight text-left">{status.msg}</p>
            </div>
          )}

          {status.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-6 px-2">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.03] active:scale-100 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center">
               <button 
                onClick={() => setStatus({type: "", msg: ""})}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
               >
                 Try a different email
               </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Link 
            to="/"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
          
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            If you believe this is an error, try searching for your topic again!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;