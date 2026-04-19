import React, { useState } from 'react';
import './App.css';
import IrisDashboard from './components/IrisDashboard';
import MtcarsDashboard from './components/MtcarsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('iris');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Data Dashboard</h1>
        <p>Interactive visualisations — Iris &amp; MTCars datasets</p>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn${activeTab === 'iris' ? ' active' : ''}`}
          onClick={() => setActiveTab('iris')}
        >
          🌸 Iris Dataset
        </button>
        <button
          className={`tab-btn${activeTab === 'mtcars' ? ' active' : ''}`}
          onClick={() => setActiveTab('mtcars')}
        >
          🚗 MTCars Dataset
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'iris' ? <IrisDashboard /> : <MtcarsDashboard />}
      </main>

      <footer className="app-footer">
        Data Dashboard · Iris &amp; MTCars Datasets · Built with React &amp; Recharts
      </footer>
    </div>
  );
}

export default App;
