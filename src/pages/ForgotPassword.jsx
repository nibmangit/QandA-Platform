import { useState } from "react";
import apiPublic from "../api/axiosPublic";
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
      const errorMsg = error.response?.data?.detail || "We couldn't find an account with that email.";
      setStatus({ type: "error", msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Full Page Wrapper with your theme's background */
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F172A] p-6">
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-blue-600"></div>

        <div className="p-8 sm:p-10">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
              Enter the email address associated with your account and we'll send a reset link.
            </p>
          </div>

          {/* Alert Messaging */}
          {status.msg && (
            <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 ${
              status.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400" 
              : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : null}
              <p className="text-xs font-bold leading-tight uppercase tracking-tight">{status.msg}</p>
            </div>
          )}

          {/* Form - Only show if not successful to keep focus on the confirmation */}
          {status.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </form>
          ) : (
            /* Success State - CTA to go check email */
            <div className="text-center">
               <p className="text-xs text-gray-400 mb-6">Didn't receive the email? Check your spam folder or try again.</p>
               <button 
                onClick={() => setStatus({type: "", msg: ""})}
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
               >
                 Try a different email
               </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <Link 
              to="/login"
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;