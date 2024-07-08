import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function RecipeInProgress() {
  const { id } = useParams();
  const history = useHistory();
  const [recipe, setRecipe] = useState(undefined);
  const [isChecked, setIsChecked] = useState(false);

  const receivedRecipe = history.location.pathname;

  useEffect(() => {
    const fetchRecipe = () => {
      let url;
      if (receivedRecipe.includes('meals')) {
        url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      } else {
        url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      }
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setRecipe(data);
        });
    };
    fetchRecipe();
  }, [id, receivedRecipe]);

  useEffect(() => {
    if (receivedRecipe.includes('meals')) {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes !== null && inProgressRecipes.meals[id] !== undefined) {
        setIsChecked(true);
      }
    } else {
      const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (inProgressRecipes !== null && inProgressRecipes.drinks[id] !== undefined) {
        setIsChecked(true);
      }
    }
  }, [id, receivedRecipe]);

  if (recipe === undefined) return (<p>Loading...</p>);

  let recipeEntries;
  let ingredientsList;
  let ingredients;

  if (receivedRecipe.includes('meals')) {
    recipeEntries = Object.entries(recipe.meals[0]);
    ingredientsList = recipeEntries.filter((entry) => entry[0].includes('strIngredient'));
    ingredients = ingredientsList.filter((entry) => entry[1]);
  } else {
    recipeEntries = Object.entries(recipe.drinks[0]);
    ingredientsList = recipeEntries.filter((entry) => entry[0].includes('strIngredient'));
    ingredients = ingredientsList.filter((entry) => entry[1]);
  }

  return (
    <div>
      {receivedRecipe.includes('meals') ? (
        <div>
          <img
            src={ recipe.meals[0].strMealThumb }
            alt="recipe"
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{ recipe.meals[0].srtMeal }</h1>
          <p data-testid="recipe-category">{recipe.meals[0].strCategory}</p>
          <p data-testid="instructions">{recipe.meals[0].strInstructions}</p>
        </div>
      ) : (
        <div>
          <img
            src={ recipe.drinks[0].strDrinkThumb }
            alt="recipe"
            data-testid="recipe-photo"
          />
          <h1 data-testid="recipe-title">{ recipe.drinks[0].srtDrink }</h1>
          <p data-testid="recipe-category">{recipe.drinks[0].strAlcoholic}</p>
          <p data-testid="instructions">{recipe.drinks[0].strInstructions}</p>
        </div>
      )}
      <h2>Ingredients</h2>
      {ingredients.map((ingredient, index) => (
        <label
          data-testid={ `${index}-ingredient-step` }
          key={ ingredient }
          htmlFor={ ingredient[1] }
        >
          <input
            checked={ isChecked }
            type="checkbox"
            id={ ingredient[1] }
            onChange={ () => {
              const checkbox = document.getElementById(ingredient[1]);
              if (checkbox.checked) {
                checkbox.parentNode.style
                  .textDecoration = 'line-through solid rgb(0, 0, 0)';
              } else {
                checkbox.parentNode.style
                  .textDecoration = 'none';
              }

              const inProgressRecipes = JSON.parse(localStorage
                .getItem('inProgressRecipes'));

              if (receivedRecipe.includes('meals')) {
                if (inProgressRecipes === null) {
                  localStorage.setItem('inProgressRecipes', JSON.stringify({
                    meals: {
                      [id]: [ingredient[1]],
                    },
                  }));
                } else {
                  localStorage.setItem('inProgressRecipes', JSON.stringify({
                    ...inProgressRecipes,
                    meals: {
                      ...inProgressRecipes.meals,
                      [id]: [
                        ...inProgressRecipes.meals[id],
                        ingredient[1],
                      ],
                    },
                  }));
                }
              } else if (inProgressRecipes === null) {
                localStorage.setItem('inProgressRecipes', JSON.stringify({
                  drinks: {
                    [id]: [ingredient[1]],
                  },
                }));
              } else {
                localStorage.setItem('inProgressRecipes', JSON.stringify({
                  ...inProgressRecipes,
                  drinks: {
                    ...inProgressRecipes.drinks,
                    [id]: [
                      ...inProgressRecipes.drinks[id],
                      ingredient[1],
                    ],
                  },
                }));
              }
            } }

          />
          {ingredient[1]}
        </label>
      ))}

      <button
        type="button"
        data-testid="share-btn"
      >
        Compartilhar

      </button>
      <button
        data-testid="favorite-btn"
      >
        Favoritar
      </button>
      <button
        data-testid="finish-recipe-btn"
        type="button"
      >
        Finalizar receita

      </button>
    </div>
  );
}

export default RecipeInProgress;
