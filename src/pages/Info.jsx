import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Info = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-6 px-4">
      <h1 className="text-3xl font-serif text-center text-textPrimary mb-8">Info & Contatti</h1>
      
      <div className="space-y-4">
        {/* Contact Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-semibold mb-4 text-accent">Agriturismo Faro Rosso</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="text-gray-400 mt-1 mr-3 flex-shrink-0" size={20} />
              <p className="text-gray-600 text-sm">
                Strada del Faro, 12<br />
                06100 Perugia (PG)<br />
                Umbria, Italia
              </p>
            </div>
            
            <div className="flex items-center">
              <Phone className="text-gray-400 mr-3 flex-shrink-0" size={20} />
              <a href="tel:+390751234567" className="text-gray-600 text-sm hover:text-accent transition-colors">+39 075 1234567</a>
            </div>
            
            <div className="flex items-center">
              <Mail className="text-gray-400 mr-3 flex-shrink-0" size={20} />
              <a href="mailto:info@agriturismofarorosso.it" className="text-gray-600 text-sm hover:text-accent transition-colors">info@agriturismofarorosso.it</a>
            </div>
          </div>
        </div>

        {/* Orari Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-semibold mb-4 text-accent flex items-center">
            <Clock size={20} className="mr-2" /> Orari
          </h2>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span>Area Solarium & Piscina</span>
              <span className="font-medium text-textPrimary">09:00 - 19:00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span>Bistrot Km0 (Pranzo)</span>
              <span className="font-medium text-textPrimary">12:30 - 14:30</span>
            </div>
            <div className="flex justify-between pt-2">
              <span>Lounge Bar (Aperitivo)</span>
              <span className="font-medium text-textPrimary">18:00 - 21:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
