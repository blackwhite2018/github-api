const { fetchData } = require('./src/ts/index.ts');

describe('fetch data function', () => {

  test('is valid href', async () => {
    const received = await fetchData('https://jsonplaceholder.typicode.com/todos/1');
    const expected = {
      "userId": 1,
      "id": 1,
      "title": "delectus aut autem",
      "completed": false
    };

    expect(received).toEqual(expected);
  });

});
