import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Recommended from './Recommended';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';

export default function RecipeDetails() {
  const { id } = useParams();
  const [datas, setDatas] = useState(undefined);
  const history = useHistory();

  const linkAtual = history.location.pathname;
  useEffect(() => {
    const fetchRecipe = () => {
      let url;
      if (linkAtual.includes('meals')) {
        url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      } else {
        url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      }
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDatas(data);
        });
    };
    fetchRecipe();
  }, [id, linkAtual]);
  if (datas === undefined) return (<p>Loading...</p>);
  let dataListEntries;
  let ingredientsList;
  let ingredients;
  let recipeId;

  if (linkAtual.includes('meals')) {
    recipeId = datas.meals[0].idMeal;
    dataListEntries = Object.entries(datas.meals[0]);
    ingredientsList = dataListEntries
      .filter((entry) => entry[0].includes('strIngredient'));
    ingredients = ingredientsList.filter((entry) => entry[1] !== '');
  } else {
    recipeId = datas.drinks[0].idDrink;
    dataListEntries = Object.entries(datas.drinks[0]);
    ingredientsList = dataListEntries
      .filter((entry) => entry[0].includes('strIngredient'));
    ingredients = ingredientsList.filter((entry) => entry[1] !== null);
  }
  const type = linkAtual.includes('meals') ? 'meals' : 'drinks';

  // const recipeId = datas.meals[0].idMeal || datas.drinks[0].idDrink;

  // const handlerecipeClick = () => history
  //   .push(`/${type}/${recipeId}/in-progress`);

  if (localStorage.getItem('inProgressRecipes') === null) {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ drinks: [], meals: [] }));
  }
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'))[type];
  const progressDrinks = JSON.parse(localStorage.getItem('inProgressRecipes')).drinks;
  const progressMeals = JSON.parse(localStorage.getItem('inProgressRecipes')).meals;

  const handlerecipeClick = () => {
    console.log(Object.keys(inProgressRecipes), 'alalal');

    if (type === 'drinks') {
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        drinks: { [recipeId]: [], ...inProgressRecipes },
        meals: progressMeals,
      }));
    } else {
      localStorage.setItem('inProgressRecipes', JSON.stringify({
        meals: { [recipeId]: [], ...inProgressRecipes },
        drinks: progressDrinks,
      }));
    }
    history.push(`/${type}/${recipeId}/in-progress`);
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen
      bg-gradient-to-r from-customOrange to-customRed
    "
    >
      <h1>RecipeDetails</h1>
      {linkAtual.includes('meals') ? (
        <div
          className="flex flex-col items-center bg-white
              bg-opacity-10 rounded-lg shadow-lg m-10 pt-4 w-1/2"
        >
          <h2 data-testid="recipe-title">{datas.meals[0].strMeal}</h2>
          <img
            src={ datas.meals[0].strMealThumb }
            alt={ datas.meals[0].strMeal }
            data-testid="recipe-photo"
            className="w-1/2 h-1/2 rounded-lg object-cover"
          />
          <p data-testid="recipe-category">{datas.meals[0].strCategory}</p>
          <ul>

            {ingredients.map((ingredient, index) => (
              <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                {`${ingredient[1]} - ${datas.meals[0][`strMeasure${index + 1}`]}`}
              </li>
            ))}
          </ul>
          <div data-testid="instructions" className="p-10">
            {datas.meals[0].strInstructions}
          </div>
          <video src={ datas.meals[0].strYoutube } data-testid="video" controls>
            <track kind="captions" />
          </video>

        </div>
      ) : (
        <div
          className="flex flex-col items-center bg-white
        bg-opacity-10 rounded-lg shadow-lg m-10 pt-4 w-1/2"
        >
          <h2 data-testid="recipe-title">{datas.drinks[0].strDrink}</h2>
          <p data-testid="recipe-category">{datas.drinks[0].strAlcoholic}</p>
          <img
            src={ datas.drinks[0].strDrinkThumb }
            alt={ datas.drinks[0].strDrink }
            data-testid="recipe-photo"
            className="w-1/2 h-1/2 rounded-lg object-cover"
          />
          <ul>

            {ingredients.map((ingredient, index) => (
              <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                {`${ingredient[1]} - ${datas.drinks[0][`strMeasure${index + 1}`]}`}
              </li>
            ))}
          </ul>

          <div data-testid="instructions">
            {datas.drinks[0].strInstructions}
          </div>
        </div>

      )}
      <Recommended />
      <br />
      {

        Object.keys(inProgressRecipes).includes(recipeId) ? (
          <button
            data-testid="start-recipe-btn"
            type="button"
            onClick={ () => handlerecipeClick() }
          >
            Continue Recipe

          </button>
        )
          : (
            <button
              data-testid="start-recipe-btn"
              type="button"
              onClick={ () => handlerecipeClick() }
            >
              Start Recipe

            </button>
          )

      }
      <FavoriteButton />
      <ShareButton />
      {/* <button
        data-testid="start-recipe-btn"
        type="button"
        onClick={ () => handlerecipeClick() }
      >
        Start Recip

      </button> */}

    </div>
  );
}
