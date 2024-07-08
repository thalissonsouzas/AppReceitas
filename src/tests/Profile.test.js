import React from 'react';
import { Router } from 'react-router-dom';
import { screen, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Profile from '../Pages/Profile';
// teste
const profileIcons = {
  emailIcon: () => screen.getAllByTestId('profile-email'),
  doneRecipesBtn: () => screen.getByTestId('profile-done-btn'),
  favoritesRecipesBtn: () => screen.getByTestId('profile-favorite-btn'),
  logoutBtn: () => screen.getByTestId('profile-logout-btn'),
};

describe('Testes do componente Profile', () => {
  beforeEach(() => {
    jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});
  });
  it('Testa os inputs da página', () => {
    window.localStorage.setItem('user', JSON.stringify({ email: 'teste@teste.com' }));
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Profile />
      </Router>,
    );
    const emailElement = screen.getByTestId('profile-email');
    expect(emailElement.textContent).toBe('teste@teste.com');
    expect(profileIcons.emailIcon()).toHaveLength(1);
    expect(profileIcons.doneRecipesBtn()).toBeInTheDocument();
    expect(profileIcons.favoritesRecipesBtn()).toBeInTheDocument();
    expect(profileIcons.logoutBtn()).toBeInTheDocument();
  });
  it('Testa se, ao clicar no button Done Recipes, redireciona para a página correta', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Profile />
      </Router>,
    );
    userEvent.click(profileIcons.doneRecipesBtn());
    expect(history.location.pathname).toBe('/done-recipes');
  });
  it('Testa se, ao clicar no button Favorites Recipes, redireciona para a página correta', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Profile />
      </Router>,
    );
    userEvent.click(profileIcons.favoritesRecipesBtn());
    expect(history.location.pathname).toBe('/favorite-recipes');
  });
  it('Testa se, ao clicar no button Logout, redireciona para a página correta', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Profile />
      </Router>,
    );
    const logBtn = screen.getByTestId('profile-logout-btn');
    userEvent.click(logBtn);
    expect(history.location.pathname).toBe('/');
  });
});
