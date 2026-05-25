import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PACKAGES = [
  {
    id: 'solo-ingresso',
    name: 'Solo Ingresso',
    description: 'Lettino e ombrellone nell\'area solarium panoramica.',
    price: 25,
  },
  {
    id: 'pranzo',
    name: 'Ingresso + Pranzo',
    description: 'Ingresso in piscina e pranzo al Bistrot Km0 (antipasto, primo, acqua e caffè).',
    price: 55,
  },
  {
    id: 'aperitivo',
    name: 'Ingresso + Aperitivo',
    description: 'Ingresso in piscina e aperitivo al tramonto con drink e tagliere della casa.',
    price: 40,
  }
];

const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [soldOutMessage, setSoldOutMessage] = useState('');

  const WHATSAPP_NUMBER = "393331234567"; // Sostituisci in futuro
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ciao, vorrei avere informazioni sulla disponibilità per la data del ")}`;

  const calculateTotal = () => {
    const pkg = PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg) return 0;
    return pkg.price * adults + (pkg.price * 0.5) * children;
  };

  const handleNext = async () => {
    if (step === 1 && date && adults > 0 && name && phone) {
      setCheckingAvailability(true);
      setSoldOutMessage('');
      
      try {
        // 1. Fetch daily limit
        const limitRef = doc(db, 'limiti_giornalieri', date);
        const limitSnap = await getDoc(limitRef);
        let maxGuests = -1; // -1 means infinite
        
        if (limitSnap.exists() && limitSnap.data().maxGuests !== undefined) {
          maxGuests = limitSnap.data().maxGuests;
        }

        if (maxGuests === 0) {
          setSoldOutMessage(`Per la data selezionata siamo al completo. Non è possibile effettuare prenotazioni online.`);
          setCheckingAvailability(false);
          return;
        }

        // 2. Count current guests if there is a limit
        if (maxGuests > 0) {
          const q = query(collection(db, 'prenotazioni'), where('date', '==', date));
          const querySnapshot = await getDocs(q);
          
          let currentGuests = 0;
          querySnapshot.forEach((doc) => {
            const b = doc.data();
            currentGuests += (b.adults || 0) + (b.children || 0);
          });

          const requestedGuests = adults + children;

          if (currentGuests + requestedGuests > maxGuests) {
            const remaining = Math.max(0, maxGuests - currentGuests);
            if (remaining === 0) {
              setSoldOutMessage(`Per la data selezionata non ci sono più posti disponibili online.`);
            } else {
              setSoldOutMessage(`Per la data selezionata rimangono solo ${remaining} posti online, ma tu ne hai richiesti ${requestedGuests}.`);
            }
            setCheckingAvailability(false);
            return;
          }
        }

        setStep(2);
      } catch (e) {
        console.error("Errore disponibilità:", e);
        alert("Errore durante la verifica della disponibilità. Riprova.");
      }
      setCheckingAvailability(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'prenotazioni'), {
        name,
        phone,
        date,
        adults,
        children,
        packageId: selectedPackage,
        total: calculateTotal(),
        timestamp: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Si è verificato un errore. Assicurati di aver configurato correttamente firebase.js");
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white mb-6">
          <Check size={40} />
        </div>
        <h1 className="text-3xl font-serif text-textPrimary mb-2">Prenotazione Confermata!</h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Grazie {name.split(' ')[0]}, ti aspettiamo il {new Date(date).toLocaleDateString('it-IT')} all'Agriturismo Faro Rosso.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-cta text-white py-3 px-8 rounded-xl font-semibold shadow-md"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-24 pt-8 px-4 w-full md:max-w-2xl md:mx-auto md:mt-8">
      <h1 className="text-3xl font-serif text-center text-textPrimary mb-2">Prenotazione</h1>
      
      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`h-1 w-12 ${step >= 2 ? 'bg-accent' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
      </div>

      {/* Step 1: Dati e Ospiti */}
      {step === 1 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm md:shadow-md border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">I tuoi dettagli</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-accent focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cellulare</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 333 1234567"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-accent focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data arrivo</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-accent focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="font-medium text-lg">Adulti</p>
                <p className="text-sm text-gray-500">Oltre 12 anni</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 hover:bg-gray-50 transition-colors shadow-sm font-bold text-lg"
                >-</button>
                <span className="w-4 text-center font-bold text-lg">{adults}</span>
                <button 
                  onClick={() => setAdults(adults + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 hover:bg-gray-50 transition-colors shadow-sm font-bold text-lg"
                >+</button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="font-medium text-lg">Bambini</p>
                <p className="text-sm text-gray-500">Sotto i 12 anni (sconto 50%)</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 hover:bg-gray-50 transition-colors shadow-sm font-bold text-lg"
                >-</button>
                <span className="w-4 text-center font-bold text-lg">{children}</span>
                <button 
                  onClick={() => setChildren(children + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 hover:bg-gray-50 transition-colors shadow-sm font-bold text-lg"
                >+</button>
              </div>
            </div>
          </div>

          {soldOutMessage && (
            <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-bottom-2 shadow-sm">
              <p className="text-red-800 font-medium text-center mb-4">{soldOutMessage}</p>
              <a 
                href={WHATSAPP_LINK + new Date(date).toLocaleDateString('it-IT')}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#20bd5a] transition-colors"
              >
                Contattaci su WhatsApp
              </a>
            </div>
          )}

          <button 
            onClick={handleNext}
            disabled={!date || !name || !phone || checkingAvailability}
            className="w-full bg-cta text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 transition-all hover:bg-red-800 shadow-md"
          >
            {checkingAvailability ? 'Verifica disponibilità...' : 'Avanti'}
          </button>
        </div>
      )}

      {/* Step 2: Packages */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-48 md:pb-0">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 px-2">Scegli la tua esperienza</h2>
          
          <div className="space-y-4 mb-8">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white hover:border-accent/50 ${
                  selectedPackage === pkg.id 
                    ? 'border-accent shadow-md scale-[1.01]' 
                    : 'border-transparent shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-bold text-lg md:text-xl">{pkg.name}</h3>
                  <span className="font-semibold text-accent text-lg">€{pkg.price}</span>
                </div>
                <p className="text-sm md:text-base text-gray-600 pr-8 leading-relaxed">{pkg.description}</p>
                {selectedPackage === pkg.id && (
                  <div className="mt-4 flex items-center text-accent text-sm font-medium">
                    <Check size={18} className="mr-1" /> Selezionato
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop uses standard div instead of fixed bottom bar */}
          <div className="fixed md:static bottom-16 md:bottom-auto left-0 right-0 md:max-w-none max-w-md mx-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 p-4 md:p-0 pb-8 md:pb-0 z-40 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:shadow-none">
            <div className="flex md:flex-col justify-between items-center md:items-start mb-4 md:mb-6 md:bg-white md:p-6 md:rounded-2xl md:shadow-sm">
              <span className="text-gray-600 font-medium md:mb-1">Totale stimato per {adults} adulti e {children} bambini:</span>
              <span className="text-2xl md:text-3xl font-bold text-textPrimary">€{calculateTotal()}</span>
            </div>
            <div className="flex gap-3 md:gap-4">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 md:py-4 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Indietro
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!selectedPackage || isSubmitting}
                className="flex-1 bg-cta text-white py-3 md:py-4 rounded-xl font-semibold text-lg disabled:opacity-50 hover:bg-red-800 transition-colors shadow-md"
              >
                {isSubmitting ? 'Salvataggio...' : 'Conferma Prenotazione'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
