import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import BookingWizard from './pages/BookingWizard';
import Menu from './pages/Menu';
import Info from './pages/Info';
import Admin from './pages/Admin';

function App() {
  return (
    <Router basename="/urbani">
      <div className="font-sans antialiased relative min-h-[100dvh] bg-background flex flex-col md:pt-16">
        {/* Main Content Area */}
        <main className="w-full flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prenota" element={<BookingWizard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <Routes>
          <Route path="/admin" element={null} />
          <Route path="*" element={<Navigation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
