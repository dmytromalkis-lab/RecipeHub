import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Components/Main/Header/Header.jsx';
import Footer from './Components/Main/Footer/Footer.jsx';
import './main.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 400px)' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
