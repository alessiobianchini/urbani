import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-gray-300">
        <img
          src="https://cdn.prod.website-files.com/60ab9fd2e19e64f8d6fdc269/62558ca403dcafa4c27943f7_Area%20Solarium.jpg"
          alt="Piscina Panoramica"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <img 
            src="https://cdn.prod.website-files.com/60ab9fd2e19e64f8d6fdc269/62150faf674b4e3ae860a1a5_Logo%20.svg" 
            alt="Agriturismo Faro Rosso" 
            className="w-48 mb-6 drop-shadow-md"
          />
          <p className="text-lg text-white/90 font-light max-w-md drop-shadow-md">
            Relax a 730m di altezza. La tua oasi di pace nella natura umbra.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-background rounded-t-[2rem] -mt-8 relative z-10 px-6 py-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-serif text-textPrimary mb-4">
          Area Solarium Panoramica
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Goditi una giornata di puro relax a bordo piscina, circondato dai suoni della natura e da una vista mozzafiato. Scopri i nostri pacchetti che includono i sapori autentici del nostro Bistrot Km0.
        </p>
        
        <button
          onClick={() => navigate('/prenota')}
          className="bg-cta text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:bg-red-800 transition-colors w-full max-w-sm active:scale-95 transform"
        >
          Prenota il tuo ingresso
        </button>
      </div>
    </div>
  );
};

export default Home;
