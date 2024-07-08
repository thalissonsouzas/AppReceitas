import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ContextApp from '../context/ContextApp';

export default function Searchbar() {
  const { setMeals, setDrinks } = useContext(ContextApp);
  const history = useHistory();
  const linkAtual = history.location.pathname;
  const [searchInput, setSearchInput] = useState('');
  const [radioSearch, setRadioSearch] = useState('');

  // console.log(meals);
  const handleRadioChange = ({ target }) => {
    const selectedRadio = target.value;
    setRadioSearch(selectedRadio);
  };

  const handleInputChange = ({ target }) => {
    setSearchInput(target.value);
  };

  const firstLetter = 'first-letter';
  const fetchMeals = () => {
    let url = '';
    if (radioSearch === 'ingredient') {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;
    } else if (radioSearch === 'name') {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;
    } else if (radioSearch === firstLetter) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInput}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          setMeals(data.meals);

          if (data.meals.length === 1) {
            const mealId = data.meals[0].idMeal;
            history.push(`/meals/${mealId}`);
          }
        } else {
          global.alert('Sorry, we haven\'t found any recipes for these filters.');
        }
      });
  };

  const fetchDrinks = () => {
    let url = '';
    if (radioSearch === 'ingredient') {
      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInput}`;
    } else if (radioSearch === 'name') {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
    } else if (radioSearch === firstLetter) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${searchInput}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.drinks) {
          setDrinks(data.drinks.slice(0, Number('12')));

          if (data.drinks.length === 1) {
            const drinkId = data.drinks[0].idDrink;
            history.push(`/drinks/${drinkId}`);
          }
        } else {
          global.alert('Sorry, we haven\'t found any recipes for these filters.');
        }
      });
  };
  const searchBtn = () => {
    // setBtnAcionado(false);
    // setApiReturn([]);
    if (radioSearch === firstLetter && searchInput.length !== 1) {
      global.alert('Your search must have only 1 (one) character');
      return;
    }
    if (linkAtual.includes('meals')) {
      fetchMeals();
    } else if (linkAtual.includes('drinks')) {
      fetchDrinks();
    }
    // setBtnAcionado(true);
  };

  return (
    <div>
      <input
        type="text"
        data-testid="search-input"
        placeholder="Buscar Receita"
        onChange={ handleInputChange }
      />
      <input
        type="radio"
        name="radioSearch"
        data-testid="ingredient-search-radio"
        value="ingredient"
        onClick={ handleRadioChange }
      />
      Ingredient
      <input
        type="radio"
        name="radioSearch"
        data-testid="name-search-radio"
        value="name"
        onClick={ handleRadioChange }
      />
      Name
      <input
        type="radio"
        name="radioSearch"
        data-testid="first-letter-search-radio"
        value="first-letter"
        onClick={ handleRadioChange }
      />
      First Letter
      <button type="submit" data-testid="exec-search-btn" onClick={ searchBtn }>
        Search
      </button>
    </div>
  );
}
