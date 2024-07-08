import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import validator from 'validator';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState(true);
  useEffect(() => {
    setValidation(validator.isEmail(email) && password.length > Number('6'));
  }, [email, password]);

  const history = useHistory();
  const saveUser = () => {
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  };

  return (
    <main
      className="flex flex-col items-center min-h-screen
      bg-gradient-to-r from-customOrange to-customRed"
    >
      <div
        className="flex flex-col mt-20 p-8
        rounded-lg shadow-lg bg-white bg-opacity-10"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>

        <input
          type="text"
          placeholder="Email"
          className="p-2 mb-4 border rounded"
          onChange={ (e) => setEmail(e.target.value) }
          data-testid="email-input"
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 mb-4 border rounded"
          onChange={ (e) => setPassword(e.target.value) }
          data-testid="password-input"
        />

        <button
          disabled={ !validation }
          className={ `p-2 bg-customOrange rounded-full
            text-customRed disabled:opacity-50 hover:scale-105 
            ${validation ? 'cursor-pointer' : 'cursor-not-allowed'}` }
          onClick={ saveUser }
          data-testid="login-submit-btn"
        >
          Login
        </button>
      </div>
    </main>
  );
}

export default Login;
