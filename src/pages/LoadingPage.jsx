import { BookOpen } from "lucide-react";
import { BDU as BDU_COLORS } from "../utils/css";

const LoadingPage = ({ message = "Loading BDU Q&A Hub...", isFullPage = true }) => {
    return (
        <div className={`flex flex-col items-center justify-center transition-colors duration-500 
            ${isFullPage 
                ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900" 
                : "w-full py-12 bg-transparent"
            }`}
        >
            <BookOpen 
                className={`${isFullPage ? "w-16 h-16" : "w-12 h-12"} animate-pulse`} 
                style={{ color: BDU_COLORS.GOLD }} 
            />
            
            <h1 className={`${isFullPage ? "text-3xl" : "text-xl"} font-bold mt-4 mb-8 text-bdu-navy dark:text-white text-center px-4`}>
                {message}
            </h1> 

            <div className="flex space-x-2">
                <div className="w-4 h-4 rounded-full animate-bounce-custom" style={{ backgroundColor: BDU_COLORS.NAVY, animationDelay: '0ms' }}></div>
                <div className="w-4 h-4 rounded-full animate-bounce-custom" style={{ backgroundColor: BDU_COLORS.GOLD, animationDelay: '150ms' }}></div>
                <div className="w-4 h-4 rounded-full animate-bounce-custom" style={{ backgroundColor: BDU_COLORS.NAVY, animationDelay: '300ms' }}></div>
            </div>

            <style>{`
                @keyframes bounce-custom {
                    0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
                .animate-bounce-custom {
                    animation: bounce-custom 1s infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingPage;