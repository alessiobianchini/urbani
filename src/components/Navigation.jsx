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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
