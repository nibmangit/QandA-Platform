import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiPublic from "../api/axiosPublic";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
    setStatus({ type: "error", msg: "Please fill out all input fields!" });
    return;
  }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setStatus({ 
        type: "error", 
        msg: "Password must be at least 6 characters and include letters and numbers." 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try { 
      const cleanToken = token.replace(/[\s=]/g, ""); 
      const cleanUid = uid.replace(/[\s=]/g, "");
      const response = await apiPublic.post("/user/password-reset-confirm/", {
        uid: cleanUid,
        token: cleanToken,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      setStatus({ 
        type: "success", 
        msg: response.data.message || "Password successfully reset!" 
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/", { state: { triggerLogin: true } });
    }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "The reset link is invalid or has expired.";
      setStatus({ type: "error", msg: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F172A] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        
        {/* Security Accent Bar */}
        <div className="h-2 w-full bg-green-500"></div>

        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
              <Lock className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Set New Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
              Almost there! Choose a strong password to secure your account.
            </p>
          </div>

          {status.msg && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 ${
              status.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400" 
              : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
              <p className="text-xs font-bold leading-tight uppercase tracking-tight">{status.msg}</p>
            </div>
          )}

          {status.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-5 pr-12 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-5 pr-12 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-[#0F172A] rounded-xl font-black text-sm uppercase tracking-widest shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 animate-spin rounded-full" />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest animate-bounce">
                Redirecting to login <ArrowRight size={14} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;