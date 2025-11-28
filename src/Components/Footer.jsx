

import {BDU} from "../utils/css";
import { MOCK_CATEGORIES } from "../utils/mock/mockData";
const Footer = () => {

    return(
  <footer className="mt-12 py-10 border-t border-gray-200" style={{ backgroundColor: BDU.NAVY }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1" style={{ color: BDU.GOLD }}>Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-300 transition-colors">About BDU</a></li>
            <li><a href="#" className="hover:text-gray-300 transition-colors">Academic Calendar</a></li>
            <li><a href="#" className="hover:text-gray-300 transition-colors">Platform Help</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1" style={{ color: BDU.GOLD }}>Departments</h5>
          <ul className="space-y-2 text-sm">
            {MOCK_CATEGORIES.slice(0, 4).map(c => (
              <li key={c.id}><a href="#" className="hover:text-gray-300 transition-colors">{c.name}</a></li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h5 className="font-semibold mb-3 border-b border-yellow-500/50 pb-1" style={{ color: BDU.GOLD }}>Contact</h5>
          <p className="text-sm">Bahir Dar University</p>
          <p className="text-sm">Main Campus, Bahir Dar, Ethiopia</p>
          <p className="text-sm">Email: info@bdu.edu.et</p>
          <p className="text-sm">Phone: +251 58 220 6001</p>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Bahir Dar University Q&A Connect. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
};

export default Footer;
