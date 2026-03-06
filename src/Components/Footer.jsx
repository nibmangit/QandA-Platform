import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BDU } from "../utils/css"; 
import { getCategories } from "../api/questionService";

const Footer = () => { 
  const {isLoggedIn} = useAuth();
  const [category, setCategory]= useState([])

    useEffect(() => {
    const fetchAllData = async () => {
      try { 
        const catData = await getCategories() 
        setCategory(catData); 
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }  
    };
    fetchAllData();
  }, []);

  return (
    <footer
      className="mt-12 py-10 border-t border-gray-200 min-w-0 lg:ml-64"
      style={{ backgroundColor: BDU.NAVY }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
         
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           
          <div>
            <h5 className="font-semibold mb-3" style={{ color: BDU.GOLD }}>
              BDU Q&A Connect
            </h5>
            <p className="text-sm text-gray-300 leading-5">
              A collaborative academic platform for students
              across Bahir Dar University.
            </p>
          </div>
 
          <div>
            <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1"
              style={{ color: BDU.GOLD }}
            >
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-gray-300">Home</a></li>
              <li><a href={isLoggedIn?"/ask-questions" : "/auth"} className="hover:text-gray-300">Ask Question</a></li>
              <li><a href="/categories" className="hover:text-gray-300">Categories</a></li>
              <li><a href="/leaderboard" className="hover:text-gray-300">Leaderboard</a></li>
              <li><a href="/help" className="hover:text-gray-300">Help / FAQ</a></li>
            </ul>
          </div>
 
          <div>
            <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1"
              style={{ color: BDU.GOLD }}
            >
              Popular Fields
            </h5>
            <ul className="space-y-2 text-sm">
              {category.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <a href={`/categories`} className="hover:text-gray-300">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1"
              style={{ color: BDU.GOLD }}
            >
              Contact
            </h5>
            <p className="text-sm">BDU Q and A Platform</p> 
            <p className="text-sm">Email: nibretu@gmail.com</p>
            <p className="text-sm">Phone: +251 58 *******</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BDU Q&A Connect — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
