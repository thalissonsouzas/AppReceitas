import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { setStorage } from '../helpers/localStorage';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

const fetchDrinksDetails = async (id) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const { drinks } = await response.json();
    return drinks[0];
  } catch (error) {
    throw new Error(error);
  }
};

const fetchFoodsDetails = async (id) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const { meals } = await response.json();
    return meals[0];
  } catch (error) {
    throw new Error(error);
  }
};

export default function FavoriteButton() {
  const { id } = useParams();
  const history = useHistory();
  const { location: { pathname } } = history;
  const [detail, setDetails] = useState({});
  const food = pathname.includes('meals');
  const drink = pathname.includes('drinks');
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    (async () => {
      if (drink) {
        const drinkDetails = await fetchDrinksDetails(id);
        setDetails(drinkDetails);
      }
      if (food) {
        const foodDetails = await fetchFoodsDetails(id);
        setDetails(foodDetails);
      }
    })();
  }, [
    id,
    drink,
    food,
    detail,
  ]);

  useEffect(() => {
    const { idMeal, idDrink } = detail;
    const favoriteGet = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (food && favoriteGet
      .some((recipe) => recipe?.id === idMeal)) setFavorited(true);
    if (drink && favoriteGet
      .some((recipe) => recipe?.id === idDrink)) setFavorited(true);
  }, [detail, drink, food]);

  const favoriteRecipesStorage = (recipe, typeFood) => {
    if (typeFood === 'meal') {
      const mealFavorite = {
        id: recipe.idMeal,
        type: typeFood,
        nationality: recipe.strArea,
        category: recipe.strCategory,
        alcoholicOrNot: '',
        name: recipe.strMeal,
        image: recipe.strMealThumb,
      };
      const favoriteGet = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      const toSaveFavorite = [...favoriteGet, mealFavorite];
      localStorage.setItem('favoriteRecipes', JSON.stringify(toSaveFavorite));
    } else {
      const drinkFavorite = {
        id: recipe.idDrink,
        type: typeFood,
        nationality: '',
        category: recipe.strCategory,
        alcoholicOrNot: recipe.strAlcoholic,
        name: recipe.strDrink,
        image: recipe.strDrinkThumb,
      };
      const favoriteGet = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      const toSaveFavorite = [...favoriteGet, drinkFavorite];
      localStorage.setItem('favoriteRecipes', JSON.stringify(toSaveFavorite));
    }
  };

  const handleFavoriteButt = () => {
    const { idMeal, idDrink } = detail;
    if (drink) {
      const favoriteGet = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      if (favoriteGet.some((recipe) => recipe?.id === idDrink)) {
        setFavorited(false);
        const filtered = favoriteGet.filter((recipe) => recipe.id !== idDrink);
        setStorage('favoriteRecipes', filtered);
      } else {
        setFavorited(true);
        favoriteRecipesStorage(detail, 'drink');
      }
    }
    if (food) {
      const favoriteGet = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      if (favoriteGet.some((recipe) => recipe?.id === idMeal)) {
        setFavorited(false);
        const filtered = favoriteGet.filter((recipe) => recipe.id !== idMeal);
        setStorage('favoriteRecipes', filtered);
      } else {
        setFavorited(true);
        favoriteRecipesStorage(detail, 'meal');
      }
    }
  };
  return (
    <div>
      <button
        className="share-heart"
        src={ favorited ? blackHeartIcon : whiteHeartIcon }
        type="button"
        data-testid="favorite-btn"
        onClick={ handleFavoriteButt }
      >
        <img
          className="share-heart"
          src={ favorited ? blackHeartIcon : whiteHeartIcon }
          alt="Icone de Favoritar"
        />
      </button>
    </div>
  );
}
