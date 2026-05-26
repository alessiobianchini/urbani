import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inizializza con la data di oggi nel formato YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [dailyLimitLettini, setDailyLimitLettini] = useState('');
  const [dailyLimitOmbrelloni, setDailyLimitOmbrelloni] = useState('');
  const [savingLimit, setSavingLimit] = useState(false);

  // Fetch limit when date changes
  useEffect(() => {
    if (selectedDate && isAuthenticated) {
      const fetchLimit = async () => {
        try {
          const docRef = doc(db, 'limiti_giornalieri', selectedDate);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDailyLimitLettini(data.maxLettini !== undefined ? data.maxLettini.toString() : '30');
            setDailyLimitOmbrelloni(data.maxOmbrelloni !== undefined ? data.maxOmbrelloni.toString() : '10');
          } else {
            setDailyLimitLettini('30');
            setDailyLimitOmbrelloni('10');
          }
        } catch (e) {
          console.error("Errore recupero limite:", e);
        }
      };
      fetchLimit();
    }
  }, [selectedDate, isAuthenticated]);

  const handleSaveLimit = async () => {
    if (!selectedDate) return;
    setSavingLimit(true);
    try {
      const docRef = doc(db, 'limiti_giornalieri', selectedDate);
      const limitL = dailyLimitLettini === '' ? 30 : parseInt(dailyLimitLettini, 10);
      const limitO = dailyLimitOmbrelloni === '' ? 10 : parseInt(dailyLimitOmbrelloni, 10);
      await setDoc(docRef, { maxLettini: limitL, maxOmbrelloni: limitO });
      alert('Limiti aggiornati con successo per il ' + new Date(selectedDate).toLocaleDateString('it-IT'));
    } catch (e) {
      console.error(e);
      alert('Errore nel salvataggio dei limiti');
    }
    setSavingLimit(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Password fissa per semplicità (cambiala se vuoi!)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      alert('Password errata');
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'prenotazioni'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(data);
    } catch (error) {
      console.error("Errore nel recupero dati:", error);
      alert("Errore di connessione a Firebase. Assicurati di aver configurato src/firebase.js");
    }
    setLoading(false);
  };

  const filteredBookings = selectedDate 
    ? bookings.filter(b => b.date === selectedDate)
    : bookings;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-serif mb-6 text-textPrimary">Area Riservata</h1>
        <form onSubmit={handleLogin} className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:ring-accent focus:border-accent outline-none"
          />
          <button type="submit" className="w-full bg-cta text-white py-3 rounded-xl font-semibold">
            Accedi
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-12 pt-8 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mt-4 gap-4">
        <h1 className="text-2xl md:text-4xl font-serif text-textPrimary">Prenotazioni</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 md:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <button onClick={fetchBookings} className="text-sm md:text-base bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">Aggiorna Dati</button>
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="font-semibold text-textPrimary text-lg">Limiti del {new Date(selectedDate).toLocaleDateString('it-IT')}</h2>
            <p className="text-sm text-gray-500">Default: 30 lettini, 10 ombrelloni. Imposta a 0 per esaurire.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Max Lettini</label>
              <input 
                type="number" 
                value={dailyLimitLettini}
                onChange={(e) => setDailyLimitLettini(e.target.value)}
                className="w-full md:w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                min="0"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Max Ombrelloni</label>
              <input 
                type="number" 
                value={dailyLimitOmbrelloni}
                onChange={(e) => setDailyLimitOmbrelloni(e.target.value)}
                className="w-full md:w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                min="0"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button 
                onClick={handleSaveLimit} 
                disabled={savingLimit}
                className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 min-w-max hover:bg-red-800 transition-colors h-[38px]"
              >
                {savingLimit ? '...' : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-10 md:text-lg">Caricamento in corso...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 md:text-lg">
          {selectedDate ? `Nessuna prenotazione trovata per la data selezionata.` : `Nessuna prenotazione trovata.`}
        </p>
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg md:text-xl text-textPrimary">{booking.name}</h3>
                <span className="bg-gray-100 text-xs md:text-sm px-3 py-1 rounded-full font-semibold text-gray-700">
                  {new Date(booking.date).toLocaleDateString('it-IT')}
                </span>
              </div>
              <p className="text-gray-600 text-sm md:text-base mb-1 flex items-center">✉️ <span className="ml-2 text-xs md:text-sm">{booking.email || 'N/A'}</span></p>
              <p className="text-gray-600 text-sm md:text-base mb-1 flex items-center">📞 <span className="ml-2 font-medium">{booking.phone}</span></p>
              <p className="text-gray-600 text-sm md:text-base mb-4 flex-1 flex items-center">👥 <span className="ml-2 font-medium">{booking.adults} Adulti, {booking.children} Bambini</span></p>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-wider">{booking.packageId}</span>
                <span className="font-bold text-md text-textPrimary">
                  {booking.area === 'lettini' ? `Lettini: ${booking.lettiniCount || 0} | Ombr: ${booking.ombrelloniCount || 0}` : 'Prato'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
