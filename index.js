fetch(
  "https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple"
)
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then((dataRetrieved) => {
    const data = dataRetrieved;

    console.log(data);
  })
  .catch();
