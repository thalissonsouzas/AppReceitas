import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContextProvider from '../context/ContextProvider';
import Recipe from '../components/Recipes';

export default function Meals() {
  return (
    <ContextProvider>
      <div
        className="flex flex-col items-center min-h-screen
      bg-gradient-to-r from-customOrange to-customRed"
      >
        <Header />
        <Footer />

        <Recipe type="meals" />
      </div>
    </ContextProvider>
  );
}
