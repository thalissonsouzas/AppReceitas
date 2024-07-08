import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ContextApp from '../context/ContextApp';

function Recipe({ type }) {
  const {
    meals,
    drinks,
    mealCategories,
    drinkCategories,
    filterRecipesByCategory,
    resetRecipes,
  } = useContext(ContextApp);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const history = useHistory();

  const recipes = type === 'meals' ? meals : drinks;
  const categories = type === 'meals' ? mealCategories : drinkCategories;

  const handleCategoryFilter = (categoryName) => {
    if (selectedCategory === categoryName && filterActive) {
      setSelectedCategory(null);
      setFilterActive(false);
      resetRecipes();
    } else {
      setSelectedCategory(categoryName);
      setFilterActive(true);
      filterRecipesByCategory(categoryName, type);
    }
  };

  const handlerecipeClick = (recipeId) => {
    history.push(`/${type}/${recipeId}`);
  };

  useEffect(() => {
    filterRecipesByCategory(selectedCategory, type);
  }, [selectedCategory, filterRecipesByCategory, type]);

  return (
    <main className=" flex flex-col">
      <div className="">
        <button
          data-testid="All-category-filter"
          onClick={ resetRecipes }
          className="m-2 font-bold bg-white py-1 px-2
          rounded hover:scale-110 text-customRed"
        >
          All
        </button>

        {categories.map((category, index) => {
          const categoryName = category.strCategory;

          return (
            <button
              key={ index }
              data-testid={ `${categoryName}-category-filter` }
              onClick={ () => handleCategoryFilter(categoryName) }
              className="m-2 font-bold bg-white py-1 px-2
              rounded hover:scale-110 text-customRed"
            >
              {categoryName}
            </button>
          );
        })}
      </div>

      {recipes
        .map((recipe, index) => {
          const recipeThumb = type === 'meals'
            ? recipe.strMealThumb : recipe.strDrinkThumb;
          const recipeName = type === 'meals' ? recipe.strMeal : recipe.strDrink;

          return (
            <div
              key={ index }
              data-testid={ `${index}-recipe-card` }
              className="flex flex-col items-center m-2 bg-white
              bg-opacity-10 rounded-lg shadow-lg"
            >
              <button
                onClick={ () => handlerecipeClick(recipe.idMeal || recipe.idDrink) }
              >
                <img
                  src={ recipeThumb }
                  alt={ recipeName }
                  data-testid={ `${index}-card-img` }
                  className="w-72 h-72 object-cover rounded-lg mt-4"
                />
                <p data-testid={ `${index}-card-name` }>{recipeName}</p>
              </button>
            </div>
          );
        })}

    </main>
  );
}

Recipe.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Recipe;
