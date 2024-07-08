import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Header from '../components/Header';

describe('Header', () => {
  const searchIconAltText = 'Ícone de Pesquisa';
  test('clicking profile button redirects to /profile', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );
    const profileButton = screen.getByTestId('profile-top-btn');
    fireEvent.click(profileButton);
    expect(history.location.pathname).toBe('/profile');
  });

  test('renders search icon on appropriate pages', () => {
    const history = createMemoryHistory();
    history.push('/meals'); // Simulate being on a specific page
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );
    const searchIcon = screen.getByTestId('search-top-btn');
    expect(searchIcon).toBeInTheDocument();
  });

  test('clicking search icon toggles search input', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );
    const searchIcon = screen.getByAltText(searchIconAltText);
    const searchInput = screen.queryByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    fireEvent.click(searchIcon);
    expect(searchInput).not.toBeInTheDocument();
  });
  test('clicking profile button redirects to /profile', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );

    const profileButton = screen.getByTestId('profile-top-btn');
    fireEvent.click(profileButton);

    expect(history.location.pathname).toBe('/profile');
  });

  test('displays correct page title based on current route', () => {
    const routes = [
      { path: '/meals', pageTitle: 'Meals' },
      { path: '/drinks', pageTitle: 'Drinks' },
      { path: '/profile', pageTitle: 'Profile' },
      { path: '/done-recipes', pageTitle: 'Done Recipes' },
      { path: '/favorite-recipes', pageTitle: 'Favorite Recipes' },
    ];

    routes.forEach(({ path, pageTitle }) => {
      const history = createMemoryHistory();
      history.push(path);
      render(
        <Router history={ history }>
          <Header />
        </Router>,
      );

      const pageTitleElement = screen.getByTestId('page-title');
      expect(pageTitleElement).toHaveTextContent(pageTitle);
    });
  });

  test('clicking search icon toggles search input visibility', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );

    const searchIcon = screen.getByTestId('search-top-btn');
    const searchInput = screen.queryByTestId('search-input');

    // Initial state: search input should not be visible
    expect(searchInput).not.toBeInTheDocument();

    // Clicking search icon: search input should become visible
    fireEvent.click(searchIcon);
    expect(searchInput).toBeInTheDocument();

    // Clicking search icon again: search input should become invisible
    fireEvent.click(searchIcon);
    expect(searchInput).not.toBeInTheDocument();
  });
  test('displays correct page title for /done-recipes route', () => {
    const history = createMemoryHistory();
    history.push('/done-recipes'); // Simulate being on the '/done-recipes' page
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );

    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toHaveTextContent('Done Recipes');
  });
});
