import { BookOpen } from "lucide-react";
import { BDU as BDU_COLORS } from "../utils/css";

const LoadingPage = () => {

    return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 
        bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <BookOpen className="w-16 h-16 animate-pulse" style={{ color: BDU_COLORS.GOLD }} />
        <h1 className="text-3xl font-bold mt-4 mb-8 text-bdu-navy dark:text-white">
            Loading BDU Q&A Hub...
        </h1> 
        <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full animate-bounce delay-0" style={{ backgroundColor: BDU_COLORS.NAVY }}></div>
            <div className="w-4 h-4 rounded-full animate-bounce delay-150" style={{ backgroundColor: BDU_COLORS.GOLD }}></div>
            <div className="w-4 h-4 rounded-full animate-bounce delay-300" style={{ backgroundColor: BDU_COLORS.NAVY }}></div>
        </div>
        <style>{`
            @keyframes bounce {
                0%, 100% {
                    transform: translateY(-25%);
                    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                }
                50% {
                    transform: translateY(0);
                    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                }
            }
            .animate-bounce {
                animation: bounce 1s infinite;
            }
            .delay-150 { animation-delay: -0.15s; }
            .delay-300 { animation-delay: -0.3s; }
        `}</style>
    </div>
    );
};

export default LoadingPage;