import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ContextApp from '../context/ContextApp';
import Recipe from '../components/Recipes';

const cardImg0 = '0-card-img';
const category1 = 'category 1';
const category2 = 'category 2';

describe('Recipe Component', () => {
  let history;
  let mockContextValue;

  beforeEach(() => {
    history = createMemoryHistory();
    mockContextValue = {
      meals: [
        { idMeal: '1', strMeal: 'Pasta', strMealThumb: 'pasta.jpg' },
        { idMeal: '2', strMeal: 'Pizza', strMealThumb: 'pizza.jpg' },
      ],
      drinks: [
        { idDrink: '1', strDrink: 'Mojito', strDrinkThumb: 'mojito.jpg' },
        { idDrink: '2', strDrink: 'Martini', strDrinkThumb: 'martini.jpg' },
      ],
      mealCategories: [
        { strCategory: category1 },
        { strCategory: category2 },
      ],
      drinkCategories: [
        { strCategory: 'Drink 1' },
        { strCategory: 'Drink 2' },
      ],
      filterRecipesByCategory: jest.fn(),
      resetRecipes: jest.fn(),
    };
  });

  it('testa se ao clicar na receita redireciona para pagina de detalhes', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="meals" />
        </Router>
      </ContextApp.Provider>,
    );

    const pastaCardButton = screen.getByTestId(cardImg0);
    fireEvent.click(pastaCardButton);

    expect(history.location.pathname).toBe('/meals/1');
  });

  it('redefine os filtros de categoria quando o botão "All" é clicado', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="meals" />
        </Router>
      </ContextApp.Provider>,
    );

    const categoryFilterButton = screen.getByTestId(`${category1}-category-filter`);
    fireEvent.click(categoryFilterButton);

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(category1, 'meals');

    const allButton = screen.getByTestId('All-category-filter');
    fireEvent.click(allButton);

    expect(mockContextValue.resetRecipes).toHaveBeenCalled();

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(null, 'meals');
  });

  it('redefine os filtros de categoria quando uma categoria é clicada duas vezes', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="meals" />
        </Router>
      </ContextApp.Provider>,
    );

    const categoryFilterButton = screen.getByTestId(`${category1}-category-filter`);
    fireEvent.click(categoryFilterButton);

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(category1, 'meals');

    fireEvent.click(categoryFilterButton);

    expect(mockContextValue.resetRecipes).toHaveBeenCalled();

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(null, 'meals');
  });

  it('testa se filtra receitas por categoria quando um botão de categoria diferente é clicado', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="meals" />
        </Router>
      </ContextApp.Provider>,
    );

    const categoryFilterButton1 = screen.getByTestId(`${category1}-category-filter`);
    fireEvent.click(categoryFilterButton1);

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(category1, 'meals');

    const categoryFilterButton2 = screen.getByTestId(`${category2}-category-filter`);
    fireEvent.click(categoryFilterButton2);

    expect(mockContextValue.filterRecipesByCategory).toHaveBeenCalledWith(category2, 'meals');
  });

  it('testa se renderiza as receitas com os dados corretos', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="meals" />
        </Router>
      </ContextApp.Provider>,
    );

    const recipeCards = screen.getAllByTestId(/(\d)-card-img/);
    expect(recipeCards).toHaveLength(2);

    const recipeCard1 = recipeCards[0];
    const recipeName1 = screen.getByTestId('0-card-name');
    const recipeImg1 = screen.getByTestId(cardImg0);
    expect(recipeName1.textContent).toBe('Pasta');
    expect(recipeImg1.src).toContain('pasta.jpg');
    expect(recipeCard1).toBeInTheDocument();

    const recipeCard2 = recipeCards[1];
    const recipeName2 = screen.getByTestId('1-card-name');
    const recipeImg2 = screen.getByTestId('1-card-img');
    expect(recipeName2.textContent).toBe('Pizza');
    expect(recipeImg2.src).toContain('pizza.jpg');
    expect(recipeCard2).toBeInTheDocument();
  });

  it('testa se renderiza as receitas com dados corretos quando são "drinks"', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="drinks" />
        </Router>
      </ContextApp.Provider>,
    );

    const recipeCards = screen.getAllByTestId(/(\d)-recipe-card/);
    expect(recipeCards).toHaveLength(2);

    const recipeCard1 = recipeCards[0];
    const recipeName1 = screen.getByTestId('0-card-name');
    const recipeImg1 = screen.getByTestId(cardImg0);
    expect(recipeName1.textContent).toBe('Mojito');
    expect(recipeImg1.src).toContain('mojito.jpg');
    expect(recipeCard1).toBeInTheDocument();

    const recipeCard2 = recipeCards[1];
    const recipeName2 = screen.getByTestId('1-card-name');
    const recipeImg2 = screen.getByTestId('1-card-img');
    expect(recipeName2.textContent).toBe('Martini');
    expect(recipeImg2.src).toContain('martini.jpg');
    expect(recipeCard2).toBeInTheDocument();
  });

  it('testa se ao clicar na receita redireciona para pagina de detalhes quando forem drinks', () => {
    render(
      <ContextApp.Provider value={ mockContextValue }>
        <Router history={ history }>
          <Recipe type="drinks" />
        </Router>
      </ContextApp.Provider>,
    );

    const mojitoCardButton = screen.getByTestId(cardImg0);
    fireEvent.click(mojitoCardButton);

    expect(history.location.pathname).toBe('/drinks/1');
  });
});
