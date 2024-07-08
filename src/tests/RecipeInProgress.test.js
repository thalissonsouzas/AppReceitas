import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom.min';
import App from '../App';

describe('Testando o componente <RecipeInProgress>', () => {
  test('Verifica se a pagina contem as informacoes necessarias', async () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks/178319/in-progress'] }>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const recipeTitle = screen.getByTestId('recipe-title');
      const recipeImage = screen.getByTestId('recipe-photo');
      const recipeCategory = screen.getByTestId('recipe-category');
      const recipeInstructions = screen.getByTestId('instructions');
      expect(recipeTitle).toBeInTheDocument();
      expect(recipeImage).toBeInTheDocument();
      expect(recipeCategory).toBeInTheDocument();
      expect(recipeInstructions).toBeInTheDocument();
    }, { timeout: 4000 });
  });
});
