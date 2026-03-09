import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiPublic from "../api/axiosPublic";
// import axios from "axios";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden p-6">
      <div className="w-full max-w-lg h-[600px] text-center flex flex-col justify-between p-6 sm:p-8 rounded-xl bg-gray-50 shadow-2xl shadow-gray-200/50 dark:bg-gray-800 dark:shadow-none border-2 border-transparent dark:border-gray-700">
        
        <div className="flex justify-center mt-2">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center -rotate-3 transition-colors duration-500">
            <Lock size={48} className="text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-400">
            Set New Password
          </h1>

          <p className="text-base text-gray-500 dark:text-gray-400 px-4 leading-relaxed">
            Almost there! Choose a strong password to secure your account and regain access.
          </p>

          {status.msg && (
            <div className={`mx-auto w-full max-w-sm p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${
              status.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800" 
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <p className="text-xs font-bold leading-tight uppercase tracking-tight text-left">{status.msg}</p>
            </div>
          )}

          {status.type !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full pl-6 pr-12 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all font-medium"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full pl-6 pr-12 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white hover:scale-[1.03] active:scale-100 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-widest animate-bounce">
                Redirecting to login <ArrowRight size={16} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Secure your account with a unique password.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            BDU Q&A Security Protocol enabled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;