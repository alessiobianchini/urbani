import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-background pb-12 pt-8 px-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-textPrimary">Prenotazioni</h1>
        <button onClick={fetchBookings} className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-lg">Aggiorna</button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Caricamento in corso...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nessuna prenotazione trovata.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{booking.name}</h3>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded-full font-medium">
                  {new Date(booking.date).toLocaleDateString('it-IT')}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">📞 {booking.phone}</p>
              <p className="text-gray-600 text-sm mb-3">👥 {booking.adults} Adulti, {booking.children} Bambini</p>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
                <span className="text-xs font-medium text-accent uppercase">{booking.packageId}</span>
                <span className="font-bold text-textPrimary">€ {booking.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
