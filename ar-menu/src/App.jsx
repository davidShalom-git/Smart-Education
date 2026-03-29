import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ARViewPage from './pages/ARViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:id" element={<ARViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
