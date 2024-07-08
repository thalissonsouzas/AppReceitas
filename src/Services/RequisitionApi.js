export async function fetchByIngredient(ingredient) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Manipule os dados da resposta aqui, se necessário
    return data;
  } catch (error) {
    console.error('Erro na requisição por ingrediente:', error);
    throw error;
  }
}

export async function fetchByName(name) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Manipule os dados da resposta aqui, se necessário
    return data;
  } catch (error) {
    console.error('Erro na requisição por nome:', error);
    throw error;
  }
}

export async function fetchByFirstLetter(letter) {
  if (letter.length !== 1) {
    global.alert('Your search must have only 1 (one) character');
    return;
  }

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Manipule os dados da resposta aqui, se necessário
    return data;
  } catch (error) {
    console.error('Erro na requisição pela primeira letra:', error);
    throw error;
  }
}
