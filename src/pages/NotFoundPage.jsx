import { RefreshCcw, Sun, Moon, Link as LinkIcon, MessageSquareOff } from 'lucide-react';

import { useNavigate } from "react-router-dom";


const BDU_NAVY = '#003366';
const BDU_GOLD = '#FDB813';
const NotFoundIllustration = () => (
  <div className="relative w-40 h-20 md:w-48 md:h-48">
    {/* Broken Link Icon - Main Element */}
    <LinkIcon 
      size={100} 
      className={`absolute inset-0 m-auto rotate-45 dark:text-gray-600 text-gray-300 transition-colors duration-500`} 
      strokeWidth={1.5}
    />
     
    <div className={`absolute top-0 left-0 text-xl font-bold transition-transform duration-1000 dark:text-gray-400 text-gray-500 animate-pulse`} 
         style={{ animationDelay: '0s' }}>
      ?
    </div>
     
    <MessageSquareOff 
      size={32} 
      className={`absolute bottom-0 right-0 transition-transform duration-1000 dark:text-gray-400 text-gray-500 animate-bounce`} 
      style={{ animationDelay: '0.5s' }}
    />
     
    <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50 transform translate-x-12 -translate-y-8 animate-ping-once"></div>
  </div>
);

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center 
                    bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white 
                    overflow-hidden">
      {/* Card with fixed height */}
      <div className="w-full max-w-lg h-[600px] sm:h-[600px] text-center flex flex-col justify-between 
                      space-y-4 p-6 sm:p-8 rounded-xl 
                      bg-gray-50 shadow-2xl shadow-gray-200/50 
                      dark:bg-gray-800 dark:shadow-none border-2 border-transparent dark:border-gray-700">
        
        {/* Illustration */}
        <div className="flex justify-center mt-2">
          <NotFoundIllustration />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight" style={{ color: BDU_GOLD }}>
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: BDU_NAVY }}>
            <span className="dark:text-white">Page Not Found</span>
          </h2>

          <p className="text-base text-gray-500 dark:text-gray-400 px-2">
            Oops! It seems this question or answer link got lost in the vast expanse of BDU Q&A knowledge. 
            Don't worry, the path to learning is still open.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 
                       text-gray-900 hover:scale-[1.03] active:scale-100 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 cursor-pointer"
            style={{ backgroundColor: BDU_GOLD }}
          >
            Return to Homepage
          </button>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          If you believe this is an error, try searching for your topic again!
        </p>
      </div>
    </div>
  );
}




export default NotFoundPage;