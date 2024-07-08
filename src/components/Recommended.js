import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

function Recommended() {
  const history = useHistory();
  const [datas, setDatas] = useState(undefined);
  const linkAtual = history.location.pathname;

  useEffect(() => {
    const requestApi = () => {
      let url;
      if (linkAtual.includes('meals')) {
        url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
      } else {
        url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      }
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDatas(data);
        });
    };

    requestApi();
  }, [history, linkAtual]);

  if (datas === undefined) return (<p>Loading...</p>);

  const renderCarouselItems = () => {
    if (linkAtual.includes('meals')) {
      return datas.drinks.slice(0, Number('6')).map((drink, index) => (
        <Carousel.Item key={ index } data-testid={ `${index}-recommendation-card` }>
          <img
            src={ drink.strDrinkThumb }
            alt={ drink.strDrink }
            className="object-cover rounded-lg"
          />
          <Carousel.Caption className="bg-black bg-opacity-50 rounded-lg">
            <p
              className="text-white text-center"
              data-testid={ `${index}-recommendation-title` }
            >
              {drink.strDrink}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ));
    }
    return datas.meals.slice(0, Number('6')).map((meal, index) => (
      <Carousel.Item key={ index } data-testid={ `${index}-recommendation-card` }>
        <img
          src={ meal.strMealThumb }
          alt={ meal.strMeal }
          className="object-cover rounded-lg"
        />
        <Carousel.Caption className="bg-black bg-opacity-50 rounded-lg p-2">
          <p
            className="text-white text-center"
            data-testid={ `${index}-recommendation-title` }
          >
            {meal.strMeal}
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    ));
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-center mb-4">Recommended</h2>
      <div className="w-80 h-64">

        <Carousel interval={ 3000 } pause="hover" className="mx-auto max-w-3xl">
          {renderCarouselItems()}
        </Carousel>
      </div>
    </section>
  );
}

export default Recommended;
