import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full bg-gray-300">
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
            className="w-48 md:w-72 mb-6 drop-shadow-md"
          />
          <p className="text-lg md:text-2xl text-white/90 font-light max-w-md md:max-w-2xl drop-shadow-md">
            Relax a 730m di altezza. La tua oasi di pace nella natura umbra.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-background rounded-t-[2rem] md:rounded-3xl md:shadow-2xl -mt-8 md:-mt-16 relative z-10 px-6 py-10 md:py-16 flex flex-col items-center text-center md:max-w-4xl md:mx-auto md:w-full md:mb-12">
        <h2 className="text-2xl md:text-4xl font-serif text-textPrimary mb-4 md:mb-6">
          Area Solarium Panoramica
        </h2>
        <p className="text-gray-600 md:text-xl mb-8 md:mb-12 max-w-2xl leading-relaxed">
          Goditi una giornata di puro relax a bordo piscina, circondato dai suoni della natura e da una vista mozzafiato. Scopri i nostri pacchetti che includono i sapori autentici del nostro Bistrot Km0.
        </p>
        
        <button
          onClick={() => navigate('/prenota')}
          className="bg-cta text-white font-semibold md:text-lg py-4 px-8 md:px-12 rounded-full shadow-lg hover:bg-red-800 transition-all w-full max-w-sm md:max-w-md active:scale-95 transform hover:scale-105"
        >
          Prenota il tuo ingresso
        </button>
      </div>
    </div>
  );
};

export default Home;
