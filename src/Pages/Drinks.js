import React from 'react';
import Footer from '../components/Footer';
import ContextProvider from '../context/ContextProvider';
import Recipe from '../components/Recipes';
import Header from '../components/Header';

function Drinks() {
  return (
    <ContextProvider>
      <div
        className="flex flex-col items-center min-h-screen
      bg-gradient-to-r from-customOrange to-customRed"
      >
        <Header />
        <Footer />

        <Recipe type="drinks" />

      </div>
    </ContextProvider>

  );
}
export default Drinks;
