import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ContextApp from './ContextApp';

function ContextProvider({ children }) {
  const [meals, setMeals] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [allDrinks, setAllDrinks] = useState([]);
  const [mealCategories, setMealCategories] = useState([]);
  const [drinkCategories, setDrinkCategories] = useState([]);
  const twelve = 12;
  const five = 5;

  useEffect(() => {
    async function loadMealRecipes() {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      setAllMeals(data.meals);
      const mealRecipes = data.meals.slice(0, twelve);
      setMeals(mealRecipes);
    }

    async function loadDrinkRecipes() {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      setAllDrinks(data.drinks);
      const drinkRecipes = data.drinks.slice(0, twelve);
      setDrinks(drinkRecipes);
    }

    async function loadMealCategories() {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      const data = await response.json();
      const categories = data.meals.slice(0, five);
      setMealCategories(categories);
    }

    async function loadDrinkCategories() {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
      const data = await response.json();
      const categories = data.drinks.slice(0, five);
      setDrinkCategories(categories);
    }

    loadMealCategories();
    loadDrinkCategories();
    loadMealRecipes();
    loadDrinkRecipes();
  }, []);

  const filterRecipesByCategory = useCallback(async (category, type) => {
    try {
      let url = '';
      if (type === 'meals') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else {
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (type === 'meals') {
        setMeals(data.meals.slice(0, twelve));
      } else {
        setDrinks(data.drinks.slice(0, twelve));
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }, [setMeals, setDrinks]);

  const resetRecipes = useCallback(() => {
    setMeals(allMeals.slice(0, twelve));
    setDrinks(allDrinks.slice(0, twelve));
  }, [allMeals, allDrinks]);

  const value = useMemo(() => ({
    setMeals,
    meals,
    setDrinks,
    drinks,
    allMeals,
    allDrinks,
    mealCategories,
    drinkCategories,
    filterRecipesByCategory,
    resetRecipes,
  }), [
    meals,
    drinks,
    allMeals,
    allDrinks,
    mealCategories,
    drinkCategories,
    filterRecipesByCategory,
    resetRecipes,
  ]);

  return (

    <ContextApp.Provider value={ value }>
      {children}
    </ContextApp.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
