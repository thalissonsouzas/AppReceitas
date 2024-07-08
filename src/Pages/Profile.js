import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useLocalStorage from '../hook/useLocalStorage';

function Profile() {
  const history = useHistory();
  const btnLogout = () => {
    localStorage.clear();
    history.push('/');
  };
  const [storedValue] = useLocalStorage('user');
  return (
    <div>
      <Header />
      <p data-testid="profile-email">{ storedValue?.email }</p>
      <button
        data-testid="profile-done-btn"
        onClick={ () => history.push('/done-recipes') }
      >
        Done Recipes
      </button>
      <button
        data-testid="profile-favorite-btn"
        onClick={ () => history.push('/favorite-recipes') }
      >
        Favorite Recipes
      </button>
      <button
        data-testid="profile-logout-btn"
        onClick={ btnLogout }
      >
        Logout
      </button>
      <Footer />
    </div>
  );
}

export default Profile;
