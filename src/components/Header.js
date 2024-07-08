import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import Searchbar from './SearchBar';

export default function Header() {
  const location = useLocation();
  const history = useHistory();

  const [searchVisible, setSearchVisible] = useState(false); // Estado para controlar a visibilidade da barra de busca

  const profileButton = () => {
    history.push('/profile');
  };

  const getPageTitle = () => {
    const { pathname } = location;
    console.log(pathname);
    switch (pathname) {
    case '/meals':
      return 'Meals';
    case '/drinks':
      return 'Drinks';
    case '/profile':
      return 'Profile';
    case '/done-recipes':
      return 'Done Recipes';
    case '/favorite-recipes':
      return 'Favorite Recipes';
    default:
      return '';
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible); // Alternar a visibilidade da barra de busca
  };

  const showSearchIcon = !['/profile', '/done-recipes', '/favorite-recipes'].includes(
    location.pathname,
  );

  return (
    <div className="header">
      <div className="profile-icon ">
        <button onClick={ profileButton }>
          <img src={ profileIcon } data-testid="profile-top-btn" alt="Ícone de Perfil" />
        </button>
      </div>

      {showSearchIcon && (
        <div className="search-icon">
          <button onClick={ toggleSearch } aria-label="Search">
            {' '}
            <img
              src={ searchIcon }
              data-testid="search-top-btn"
              alt="Ícone de Pesquisa"
            />
          </button>
        </div>
      )}

      {searchVisible && ( // Renderize a barra de busca apenas se searchVisible for true
        <Searchbar />
      )}

      <h1 className="page-title" data-testid="page-title">
        {getPageTitle()}
      </h1>
    </div>
  );
}
