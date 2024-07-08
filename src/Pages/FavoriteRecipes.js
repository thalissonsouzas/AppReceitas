import React, { useState } from 'react';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

const copy = require('clipboard-copy');

export default function FavoriteRecipe() {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
  const [filter, setFilter] = useState('All');

  const handleShareClick = (type, id) => {
    // Lógica para compartilhar a receita
    copy(`http://localhost:3000/${type}s/${id}`);
  };

  const filteredRecipes = favoriteRecipes.filter((recipe) => {
    if (filter === 'All') return true;
    return recipe.type === filter.toLowerCase();
  });

  return (
    <div>
      <Header />
      <button
        type="button"
        data-testid="filter-by-all-btn"
        onClick={ () => setFilter('All') }
      >
        All
      </button>
      <button
        type="button"
        data-testid="filter-by-meal-btn"
        onClick={ () => setFilter('Meal') }
      >
        Meals
      </button>
      <button
        type="button"
        data-testid="filter-by-drink-btn"
        onClick={ () => setFilter('Drink') }
      >
        Drinks
      </button>
      <br />
      {filteredRecipes.map((recipe, index) => {
        console.log(recipe);

        return (
          <div key={ index }>
            <img
              src={ recipe.image }
              alt={ recipe.name }
              data-testid={ `${index}-horizontal-image` }
            />
            <h2 data-testid={ `${index}-horizontal-name` }>
              {recipe.name}
            </h2>

            {recipe.type === 'meal' ? (
              <label
                data-testid={ `${index}-horizontal-top-text` }
              >
                {`${recipe.nationality} - ${recipe.category}`}
              </label>
            ) : (
              <label data-testid={ `${index}-horizontal-top-text` }>
                {recipe.alcoholicOrNot}
              </label>
            )}
            <label data-testid={ `${index}-horizontal-done-date` }>
              {recipe.doneDate}
            </label>
            {recipe.tags?.slice(0, 2).map((tag, tagIndex) => (
              <ul
                key={ tagIndex }
                data-testid={ `${index}-${tag}-horizontal-tag` }
                style={ { display: 'flex' } }
              >
                {tag}
              </ul>
            ))}
            <button
              src={ shareIcon }
              data-testid={ `${index}-horizontal-share-btn` }
              type="button"
              onClick={ () => {
                handleShareClick(recipe.type, recipe.id);
              } }
            >
              <img src={ shareIcon } alt="Share" />
            </button>
            <button
              src={ blackHeartIcon }
              data-testid={ `${index}-horizontal-favorite-btn` }
              type="button"

            >
              <img src={ blackHeartIcon } alt="Share" />
            </button>
            <div
              id={ `shareButton-${recipe.id}` }
              hidden
            >
              Link copied!
            </div>
          </div>
        );
      })}
    </div>
  );
}
