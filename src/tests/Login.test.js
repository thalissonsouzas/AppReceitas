import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import App from '../App';

describe('Testando o componente <Login />', () => {
  test('Verifica se o botão Login esta desativado antes de inputar os dados de email e senha', () => {
    render(
      <Router history={ createMemoryHistory() }>
        <App />
      </Router>,
    );

    const buttonLogin = screen.getByTestId('login-submit-btn');
    expect(buttonLogin).toBeDisabled();
  });
  test('Verifica se o botao de login ativa após inserir email e senha validos', () => {
    render(
      <Router history={ createMemoryHistory() }>
        <App />
      </Router>,
    );
    const inputEmail = screen.getByTestId('email-input');
    const inputPassword = screen.getByTestId('password-input');
    const buttonLogin = screen.getByTestId('login-submit-btn');
    act(() => {
      userEvent.type(inputEmail, 'email@email.com');
      userEvent.type(inputPassword, '1234567');
    });
    expect(buttonLogin).not.toBeDisabled();
    act(() => {
      userEvent.click(buttonLogin);
    });
    expect(screen.getByText('Meals')).toBeInTheDocument();
  });
});
