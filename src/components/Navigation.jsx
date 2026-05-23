import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarPlus, Utensils, Info } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'Prenota', path: '/prenota', icon: <CalendarPlus size={24} /> },
    { name: 'Menù', path: '/menu', icon: <Utensils size={24} /> },
    { name: 'Info', path: '/info', icon: <Info size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 bg-white border-t md:border-t-0 md:border-b border-gray-200 pb-safe md:pb-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:shadow-sm z-50">
      <div className="flex justify-around md:justify-between items-center h-16 md:px-8 max-w-7xl mx-auto">
        
        {/* Desktop Logo (hidden on mobile) */}
        <div className="hidden md:flex items-center">
          <NavLink to="/">
            <img 
              src="https://cdn.prod.website-files.com/60ab9fd2e19e64f8d6fdc269/60b9fa8f206702aafac712dd_Logo%20Sito%20-%20Faro%20Rosso.svg" 
              alt="Faro Rosso Logo" 
              className="h-10"
            />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-around md:justify-end md:gap-8 w-full md:w-auto h-full items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col md:flex-row md:gap-2 items-center justify-center w-full md:w-auto h-full transition-colors ${
                  isActive ? 'text-accent' : 'text-gray-500 hover:text-accent'
                }`
              }
            >
              <div className="md:hidden">{item.icon}</div>
              <span className="text-[10px] md:text-sm mt-1 md:mt-0 font-medium md:font-semibold uppercase tracking-wider">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
