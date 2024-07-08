import React from 'react';

import { Route, Switch } from 'react-router-dom';
import ContextProvider from './context/ContextProvider';

import { DoneRecipes, Drinks,
  FavoriteRecipes, Login, Meals, Profile } from './Pages/index';

import RecipeDetails from './components/RecipeDetails';

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeInProgress from './components/RecipeInProgress';

function App() {
  return (
    <ContextProvider>

      <Switch>
        <Route exact path="/" component={ Login } />
        <Route exact path="/meals" component={ Meals } />
        <Route exact path="/meals/:id" component={ RecipeDetails } />
        <Route exact path="/drinks" component={ Drinks } />
        <Route exact path="/drinks/:id" component={ RecipeDetails } />
        <Route exact path="/profile" component={ Profile } />
        <Route exact path="/done-recipes" component={ DoneRecipes } />
        <Route exact path="/favorite-recipes" component={ FavoriteRecipes } />
        <Route
          exact
          path="/meals/:id/in-progress"
          component={ RecipeInProgress }
        />
        <Route
          exact
          path="/drinks/:id/in-progress"
          component={ RecipeInProgress }
        />
      </Switch>

    </ContextProvider>
  );
}

export default App;
