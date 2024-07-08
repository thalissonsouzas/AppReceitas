import React from 'react';
import { render, screen } from '@testing-library/react';
import { Meals } from '../Pages';

describe('Testando o componente <Footer>', () => {
  test('Verifica se possui 2 botoes ', () => {
    render(<Meals />);
    const mealsBtn = screen.getByTestId('drinks-bottom-btn');
    const drinksBtn = screen.getByTestId('meals-bottom-btn');
    expect(mealsBtn).toBeInTheDocument();
    expect(drinksBtn).toBeInTheDocument();
  });
});
