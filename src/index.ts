import axios from 'axios';

async function fetchData(url: string) {
  try {
    const response = await axios.get(url);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData('https://jsonplaceholder.typicode.com/todos/1');
