import React, { useState } from 'react';
import { Check, Sun, TreePine } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';

const PACKAGES = [
  {
    id: 'solo-ingresso',
    name: 'Solo Ingresso',
    description: 'Ingresso nell\'area selezionata per tutta la giornata.'
  },
  {
    id: 'pranzo',
    name: 'Ingresso + Pranzo',
    description: 'Ingresso e pranzo al Bistrot Km0 (antipasto, primo, acqua e caffè).'
  },
  {
    id: 'aperitivo',
    name: 'Ingresso + Aperitivo',
    description: 'Ingresso e aperitivo al tramonto con drink e tagliere della casa.'
  }
];

const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const [area, setArea] = useState(''); 
  const [lettiniCount, setLettiniCount] = useState(2);
  const [ombrelloniCount, setOmbrelloniCount] = useState(1);
  const [availableLettini, setAvailableLettini] = useState(-1);
  const [availableOmbrelloni, setAvailableOmbrelloni] = useState(-1);

  const [selectedPackage, setSelectedPackage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [soldOutMessage, setSoldOutMessage] = useState('');

  const WHATSAPP_NUMBER = "393317329106";

  const handleStep1Next = async () => {
    if (date && adults > 0 && name && phone && email) {
      setCheckingAvailability(true);
      setSoldOutMessage('');
      
      try {
        const limitRef = doc(db, 'limiti_giornalieri', date);
        const limitSnap = await getDoc(limitRef);
        let maxL = 30;
        let maxO = 10;
        
        if (limitSnap.exists()) {
          const data = limitSnap.data();
          if (data.maxLettini !== undefined) maxL = data.maxLettini;
          if (data.maxOmbrelloni !== undefined) maxO = data.maxOmbrelloni;
        }

        const q = query(collection(db, 'prenotazioni'), where('date', '==', date));
        const querySnapshot = await getDocs(q);
        
        let bookedL = 0;
        let bookedO = 0;
        querySnapshot.forEach((doc) => {
          const b = doc.data();
          if (b.area === 'lettini') {
            bookedL += (b.lettiniCount || 0);
            bookedO += (b.ombrelloniCount || 0);
          }
        });

        const remL = Math.max(0, maxL - bookedL);
        const remO = Math.max(0, maxO - bookedO);
        
        setAvailableLettini(remL);
        setAvailableOmbrelloni(remO);

        if (remL === 0) {
          setSoldOutMessage(`Per la data selezionata i lettini sono esauriti. È possibile prenotare solo l'ingresso sul Prato.`);
          setArea('prato');
        } else {
          setLettiniCount(1);
          setOmbrelloniCount(Math.min(1, remO));
          setArea(''); 
        }

        setStep(2);
      } catch (e) {
        console.error("Errore disponibilità:", e);
        alert("Errore durante la verifica della disponibilità. Riprova.");
      }
      setCheckingAvailability(false);
    }
  };

  const handleStep2Next = () => {
    if (area === 'prato' || (area === 'lettini' && lettiniCount > 0)) {
      setStep(3);
    }
  };

  const sendEmailConfirmation = async (bookingData) => {
    try {
      const SERVICE_ID = "service_lkobs94";
      const TEMPLATE_ID = "template_rfruwzw";
      const PUBLIC_KEY = "q8QdVlQS0IRgQGa65";

      if (SERVICE_ID === "YOUR_SERVICE_ID") {
        console.log("EmailJS non configurato. Salto invio email.");
        return;
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: bookingData.email,
        to_name: bookingData.name,
        date: new Date(bookingData.date).toLocaleDateString('it-IT'),
        area: bookingData.area === 'lettini' ? `Area Solarium (${bookingData.lettiniCount} Lettini, ${bookingData.ombrelloniCount} Ombrelloni)` : 'Prato',
        package: PACKAGES.find(p => p.id === bookingData.packageId)?.name || '',
        guests: `${bookingData.adults} Adulti, ${bookingData.children} Bambini`
      }, PUBLIC_KEY);
    } catch (error) {
      console.error("Errore invio email:", error);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const bookingData = {
        name,
        email,
        phone,
        date,
        adults,
        children,
        area,
        lettiniCount: area === 'lettini' ? lettiniCount : 0,
        ombrelloniCount: area === 'lettini' ? ombrelloniCount : 0,
        packageId: selectedPackage,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'prenotazioni'), bookingData);
      await sendEmailConfirmation(bookingData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Si è verificato un errore. Assicurati di aver configurato correttamente firebase.js");
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white mb-6">
          <Check size={40} />
        </div>
        <h1 className="text-3xl font-serif text-textPrimary mb-2">Prenotazione Inviata!</h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Grazie {name.split(' ')[0]}, la tua richiesta per il {new Date(date).toLocaleDateString('it-IT')} è stata registrata. Riceverai a breve un'email di conferma.
          <br /><br />
          <span className="text-sm font-medium text-gray-500">Se non la vedi entro pochi minuti, controlla la cartella Spam o Posta Indesiderata.</span>
        </p>
        <button 
          onClick={() => window.location.href = '/faro-rosso-pwa/'}
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
        <div className={`h-1 w-8 ${step >= 2 ? 'bg-accent' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className={`h-1 w-8 ${step >= 3 ? 'bg-accent' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario@example.com"
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
                <p className="text-sm text-gray-500">Sotto i 12 anni</p>
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

          <button 
            onClick={handleStep1Next}
            disabled={!date || !name || !phone || !email || checkingAvailability}
            className="w-full bg-cta text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 transition-all hover:bg-red-800 shadow-md"
          >
            {checkingAvailability ? 'Verifica disponibilità...' : 'Avanti'}
          </button>
        </div>
      )}

      {/* Step 2: Area Selection */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 px-2">Dove vuoi stare?</h2>
          
          {soldOutMessage && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-orange-800 font-medium text-center text-sm">{soldOutMessage}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div 
              onClick={() => setArea('prato')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white flex items-center gap-4 ${
                area === 'prato' ? 'border-accent shadow-md bg-orange-50/50' : 'border-gray-200 shadow-sm hover:border-accent/50'
              }`}
            >
              <div className={`p-3 rounded-full ${area === 'prato' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                <TreePine size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg">Prato Panoramico</h3>
                <p className="text-sm text-gray-600">Posto libero sul prato. Porta il tuo telo mare.</p>
              </div>
            </div>

            <div 
              onClick={() => availableLettini > 0 && setArea('lettini')}
              className={`p-5 rounded-2xl border-2 transition-all ${
                availableLettini === 0 ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' :
                area === 'lettini' ? 'border-accent shadow-md bg-orange-50/50 cursor-pointer' : 'border-gray-200 shadow-sm hover:border-accent/50 cursor-pointer bg-white'
              } flex flex-col gap-4`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${area === 'lettini' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Sun size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-lg">Area Solarium (Lettini)</h3>
                  <p className="text-sm text-gray-600">Postazione a bordo piscina con lettini e ombrellone.</p>
                  {availableLettini > 0 && availableLettini <= 5 && (
                    <p className="text-xs text-red-500 font-medium mt-1">Solo {availableLettini} lettini rimasti!</p>
                  )}
                </div>
              </div>
              
              {area === 'lettini' && (
                <div className="pt-4 border-t border-gray-200 space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Lettino (Max 1)</span>
                    <span className="font-bold text-accent">Incluso</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Aggiungi Ombrellone</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOmbrelloniCount(1); }} 
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${ombrelloniCount === 1 ? 'bg-accent text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Sì
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOmbrelloniCount(0); }} 
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${ombrelloniCount === 0 ? 'bg-accent text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-300 font-medium text-gray-700 bg-white">Indietro</button>
            <button 
              onClick={handleStep2Next}
              disabled={!area}
              className="flex-1 bg-cta text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
            >
              Avanti
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Packages */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-48 md:pb-0">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 px-2">Scegli l'esperienza</h2>
          
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

          <div className="fixed md:static bottom-16 md:bottom-auto left-0 right-0 md:max-w-none max-w-md mx-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 p-4 md:p-0 pb-8 md:pb-0 z-40 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:shadow-none">
            <div className="flex gap-3 md:gap-4">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 md:py-4 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors"
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
