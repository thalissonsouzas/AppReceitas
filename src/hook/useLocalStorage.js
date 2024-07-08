import { useState } from 'react';

// Hook
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = JSON.parse(localStorage.getItem(key));

    if (item) {
      return item;
    }

    return initialValue;
  });

  const setStorageValue = (value) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setStorageValue];
}
