import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, MemoryRouter, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Searchbar from '../components/SearchBar';
import ContextApp from '../context/ContextApp';
import App from '../App';

const contextMock = {
  setMeals: jest.fn(),
  setDrinks: jest.fn(),
};

describe('Searchbar', () => {
  const SEARCH_INPUT_TESTID = 'search-input';
  const INGREDIENT_RADIO_TESTID = 'ingredient-search-radio';
  const NAME_RADIO_TESTID = 'name-search-radio';
  const FIRST_LETTER_RADIO_TESTID = 'first-letter-search-radio';
  const EXEC_SEARCH_BTN_TESTID = 'exec-search-btn';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve renderizer o componente', () => {
    render(
      <Router history={ createMemoryHistory() }>
        <Searchbar />
      </Router>,
    );

    expect(screen.getByTestId(SEARCH_INPUT_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(INGREDIENT_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(NAME_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(FIRST_LETTER_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(EXEC_SEARCH_BTN_TESTID)).toBeInTheDocument();
  });

  it('Chama a função handleInputChange quando inserir busca', () => {
    render(
      <Router history={ createMemoryHistory() }>
        <Searchbar />
      </Router>,
    );

    const searchInput = screen.getByTestId(SEARCH_INPUT_TESTID);
    userEvent.type(searchInput, 'chicken');

    expect(searchInput.value).toBe('chicken');
  });

  it('deve chamar função handleRadioChange quando for clicado', () => {
    render(
      <Router history={ createMemoryHistory() }>
        <Searchbar />
      </Router>,
    );

    const ingredientRadio = screen.getByTestId(INGREDIENT_RADIO_TESTID);
    const nameRadio = screen.getByTestId(NAME_RADIO_TESTID);
    const firstLetterRadio = screen.getByTestId(FIRST_LETTER_RADIO_TESTID);

    fireEvent.click(ingredientRadio);
    expect(ingredientRadio.checked).toBe(true);

    fireEvent.click(nameRadio);
    expect(nameRadio.checked).toBe(true);

    fireEvent.click(firstLetterRadio);
    expect(firstLetterRadio.checked).toBe(true);
  });
  it('mostra o alerta quando quando a pesquisa é por letra e possui mais de uma', () => {
    jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(
      <Router history={ createMemoryHistory() }>
        <Searchbar />
      </Router>,
    );

    const searchInput = screen.getByTestId(SEARCH_INPUT_TESTID);
    const firstLetterRadio = screen.getByTestId(FIRST_LETTER_RADIO_TESTID);
    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN_TESTID);

    userEvent.type(searchInput, 'abc');
    fireEvent.click(firstLetterRadio);
    fireEvent.click(searchButton);

    expect(global.alert).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith('Your search must have only 1 (one) characters');

    global.alert.mockRestore();
  });
  it('mostra o alerta quando quando a pesquisa nao possui resultado', async () => {
    jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <App />
      </MemoryRouter>,
    );
    const lupa = screen.getByTestId('search-top-btn');
    userEvent.click(lupa);
    const searchInput = screen.getByTestId(SEARCH_INPUT_TESTID);
    const nameRadio = screen.getByTestId(NAME_RADIO_TESTID);
    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN_TESTID);

    userEvent.type(searchInput, 'abc');
    fireEvent.click(nameRadio);
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });

    global.alert.mockRestore();
  });
  it('mostra o alerta quando quando a pesquisa de drinks nao possui resultado', async () => {
    jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <App />
      </MemoryRouter>,
    );
    const lupa = screen.getByTestId('search-top-btn');
    userEvent.click(lupa);
    const searchInput = screen.getByTestId(SEARCH_INPUT_TESTID);
    const nameRadio = screen.getByTestId(NAME_RADIO_TESTID);
    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN_TESTID);

    userEvent.type(searchInput, 'abc');
    fireEvent.click(nameRadio);
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });

    global.alert.mockRestore();
  });
  it('redireciona para a rota de detalhes da refeição quando há apenas uma refeição retornada', async () => {
    const mealsData = {
      meals: [
        { idMeal: '1', strMeal: 'Meal 1' },
      ],
    };

    const fetchMock = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mealsData),
    });
    global.fetch = fetchMock;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      { wrapper: ({ children }) => (
        <ContextApp.Provider value={ contextMock }>
          {children}
        </ContextApp.Provider>
      ) },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário digitando na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'Chicken' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(fetchMock).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken');

    // Verifica se a função setMeals foi chamada com os dados corretos
    expect(contextMock.setMeals).toHaveBeenCalledWith(mealsData.meals);

    // Verifica se a função push foi chamada com a rota correta
    expect(historyMock.push).toHaveBeenCalledWith('/meals/1');
  });
  it('realiza a busca por ingredientes corretamente', async () => {
    const drinksData = {
      drinks: [
        { idDrink: '1', strDrink: 'Drink 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(drinksData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const ingredientRadio = getByTestId('ingredient-search-radio');
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário selecionando a opção de busca por ingrediente
    fireEvent.click(ingredientRadio);

    // Simula a interação do usuário digitando na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'Vodka' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka',
    );

    // Verifica se a função setDrinks foi chamada com os dados corretos
    expect(contextMock.setDrinks).toHaveBeenCalledWith(drinksData.drinks.slice(0, 12));
    // Simula a interação do usuário selecionando a opção de busca por ingrediente
    fireEvent.click(ingredientRadio);
    // Verifica se a função push não foi chamada (não há redirecionamento)
    expect(historyMock.push).not.toHaveBeenCalled();
  });
  it('redireciona para a rota de detalhes da bebida quando há apena uma bebida retornada', async () => {
    const drinksData = {
      drinks: [
        { idDrink: '1', strDrink: 'Drink 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(drinksData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] } initialIndex={ 0 }>
        <Route path="/drinks">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário digitando na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'Vodka' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka',
    );

    // Verifica se a função setDrinks foi chamada com os dados corretos
    expect(contextMock.setDrinks).toHaveBeenCalledWith(drinksData.drinks.slice(0, 12));

    // Verifica se a função push foi chamada com a rota correta
    expect(historyMock.push).toHaveBeenCalledWith('/drinks/1');
  });
  it('redireciona para a página de detalhes quando há apenas um resultado', async () => {
    const mealsData = {
      meals: [
        { idMeal: '1', strMeal: 'Meal 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mealsData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário digitando na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'Chicken' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken',
    );

    // Verifica se a função setMeals foi chamada com os dados corretos
    expect(contextMock.setMeals).toHaveBeenCalledWith(mealsData.meals);

    // Verifica se a função push foi chamada com a rota correta
    expect(historyMock.push).toHaveBeenCalledWith('/meals/1');
  });
  it('exibe alerta quando a busca por primeira letra tem mais de um caractere', () => {
    // ...

    const firstLetterRadio = getByTestId('first-letter-search-radio');

    // Simula a interação do usuário selecionando a opção de busca pela primeira letra
    fireEvent.click(firstLetterRadio);

    // Simula a interação do usuário digitando mais de um caractere na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'AB' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Verifica se o alerta é exibido corretamente
    expect(global.alert).toHaveBeenCalledWith('Your search must have only 1 (one) character');
  });
  it('realiza a busca pela primeira letra corretamente', async () => {
    const mealsData = {
      meals: [
        { idMeal: '1', strMeal: 'Meal 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mealsData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const firstLetterRadio = getByTestId(FIRST_LETTER_RADIO_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário selecionando a opção de busca pela primeira letra
    fireEvent.click(firstLetterRadio);

    // Simula a interação do usuário digitando uma única letra na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'A' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/search.php?f=A',
    );

    // Verifica se a função setMeals foi chamada com os dados corretos
    expect(contextMock.setMeals).toHaveBeenCalledWith(mealsData.meals);

    // Verifica se a função push não foi chamada (não há redirecionamento)
    expect(historyMock.push).not.toHaveBeenCalled();
  });
  it('realiza a busca por ingrediente corretamente', async () => {
    const drinksData = {
      drinks: [
        { idDrink: '1', strDrink: 'Drink 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(drinksData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] } initialIndex={ 0 }>
        <Route path="/drinks">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const ingredientRadio = getByTestId(INGREDIENT_RADIO_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    const searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

    // Simula a interação do usuário selecionando a opção de busca por ingrediente
    fireEvent.click(ingredientRadio);

    // Simula a interação do usuário digitando um ingrediente válido na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'Vodka' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      `${searchUrl}Vodka`,
    );

    // Verifica se a função setDrinks foi chamada com os dados corretos
    expect(contextMock.setDrinks).toHaveBeenCalledWith(drinksData.drinks.slice(0, 12));

    // Verifica se a função push não foi chamada (não há redirecionamento)
    expect(historyMock.push).not.toHaveBeenCalled();
  });
  it('realiza a busca pela primeira letra corretamente', async () => {
    const drinksData = {
      drinks: [
        { idDrink: '1', strDrink: 'Drink 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(drinksData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] } initialIndex={ 0 }>
        <Route path="/drinks">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const firstLetterRadio = getByTestId(FIRST_LETTER_RADIO_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    // Simula a interação do usuário selecionando a opção de busca pela primeira letra
    fireEvent.click(firstLetterRadio);

    // Simula a interação do usuário digitando uma única letra na barra de pesquisa
    fireEvent.change(searchInput, { target: { value: 'A' } });

    // Simula o clique no botão de busca
    fireEvent.click(execSearchBtn);

    // Espera até que o fetch seja resolvido
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifica se a função fetch foi chamada com o URL correto
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=A',
    );

    // Verifica se a função setDrinks foi chamada com os dados corretos
    expect(contextMock.setDrinks).toHaveBeenCalledWith(drinksData.drinks.slice(0, 12));

    // Verifica se a função push não foi chamada (não há redirecionamento)
    expect(historyMock.push).not.toHaveBeenCalled();
  });
  it('exibe o alerta quando não há receitas encontradas', async () => {
    const emptyData = {
      meals: null,
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(emptyData),
    });

    global.fetch = mockFetch;
    global.alert = jest.fn();

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ contextMock }>{children}</ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    fireEvent.change(searchInput, { target: { value: 'Chicken' } });
    fireEvent.click(execSearchBtn);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    expect(global.alert).toHaveBeenCalledWith(
      'Sorry, we haven\'t found any recipes for these filters.',
    );
  });
  it('redireciona para a rota de detalhes da bebida quando há apenas uma bebida retornada', async () => {
    const drinkData = {
      drinks: [
        { idDrink: '1', strDrink: 'Drink 1' },
      ],
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(drinkData),
    });

    global.fetch = mockFetch;

    // Crie o histórico de navegação
    const history = createMemoryHistory();

    const { getByTestId } = render(
      <Router history={ history }>
        <Searchbar />
      </Router>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ { setMeals: jest.fn(), setDrinks: jest.fn() } }>
            {children}
          </ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId(SEARCH_INPUT_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    fireEvent.change(searchInput, { target: { value: 'Cocktail' } });
    fireEvent.click(execSearchBtn);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Verifique se o redirecionamento ocorreu corretamente
    expect(history.location.pathname).toBe('/drinks/1');
  });
  it('exibe um alerta quando a opção de busca por primeira letra é selecionada e o input não tem apenas um caractere', () => {
    const mockAlert = jest.spyOn(global, 'alert');
    const searchInput = 'AB';

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Route path="/meals">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ { setMeals: jest.fn(), setDrinks: jest.fn() } }>
            {children}
          </ContextApp.Provider>
        ),
      },
    );

    const firstLetterRadio = getByTestId(FIRST_LETTER_RADIO_TESTID);
    const execSearchBtn = getByTestId(EXEC_SEARCH_BTN_TESTID);

    fireEvent.click(firstLetterRadio);
    fireEvent.change(searchInput, { target: { value: 'AB' } });
    fireEvent.click(execSearchBtn);

    expect(mockAlert).toHaveBeenCalledWith('Your search must have only 1 (one) character');
  });
  it('exibe um alerta quando nenhum resultado é encontrado', async () => {
    const emptyData = {
      drinks: null,
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(emptyData),
    });

    global.fetch = mockFetch;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ ['/drinks'] } initialIndex={ 0 }>
        <Route path="/drinks">
          <Searchbar />
        </Route>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <ContextApp.Provider value={ { setMeals: jest.fn(), setDrinks: jest.fn() } }>
            {children}
          </ContextApp.Provider>
        ),
      },
    );

    const searchInput = getByTestId('search-input');
    const execSearchBtn = getByTestId('exec-search-btn');

    fireEvent.change(searchInput, { target: { value: 'Rum' } });
    fireEvent.click(execSearchBtn);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Rum',
    );

    expect(global.alert).toHaveBeenCalledWith('Sorry, we haven\'t found any recipes for these filters.');

    expect(contextMock.setDrinks).not.toHaveBeenCalled();
    expect(historyMock.push).not.toHaveBeenCalled();
  });
});
