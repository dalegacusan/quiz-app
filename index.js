const DISCORD_USERNAME = "Slomoose#9772";
const COMPUTERAPI =
  "https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple";

const generate = {
  card: (data) => {
    const cards = [];
    for (let i = 0; i < data.length; i++) {
      const dataRetrieved = ({
        category,
        correct_answer,
        difficulty,
        incorrect_answers,
        question,
        type,
      } = data[i]);

      const card = document.createElement("div");
      $(card).addClass("row question-row");

      const markup = `
        <div class="col-sm-12 d-flex justify-content-center">
          <div class="card text-center question-card">
            <div class="card-header question-header">
              QUESTION 1
            </div>
            <div class="card-body">
              <h5 class="card-title">${dataRetrieved.question}</h5>

              <div class="list-group question-choices">
                <ul class="list-group list-group-flush choices-list">
                  ${generate.choices(data[i])}
                </ul>
              </div>

            </div>
            <div class="card-footer text-muted question-footer">
              <a href="#" class="btn next-button">Next Question</a>
            </div>
          </div>
        </div>
        `;

      $(card).html(markup);

      cards.push(card);
    }
    return cards;
  },
  questions: (data, ques_count) => {
    const shuffle = (array) => {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    const new_arr = shuffle(data);

    const questions = [];
    for (let i = 0; i < ques_count; i++) {
      questions.push(new_arr[i]);
    }

    return questions;
  },
  choices: (data) => {
    const correct_answer = data.correct_answer;
    const choices = [data.correct_answer];

    for (let item of data.incorrect_answers) {
      choices.push(item);
    }

    return choices
      .map(
        (answer) => `<li class="list-group-item choices-item">${answer}</li>`
      )
      .join("");
  },
};

$("#welcome-form").on("submit", (e) => {
  e.preventDefault();

  const name = $("#name-input").val();
  const ques_count = $("#questions-count-input option:selected").text();

  if (name === "") {
    $("#name-input").toggleClass("error");
    $("#name-input").prop("disabled", true);
    $("#name-input").attr("placeholder", "Please enter your name");

    setTimeout(() => {
      $("#name-input").toggleClass("error");
      $("#name-input").prop("disabled", false);
      $("#name-input").attr("placeholder", "");
      $("#name-input").focus();
    }, 1500);

    return;
  } else {
    fetch(COMPUTERAPI)
      .then((response) => {
        return response.json();
      })
      .then((dataRetrieved) => {
        $(".main-row").toggle();

        let card_count = 0;

        const { results } = dataRetrieved;

        const questions_generated = generate.questions(results, ques_count);
        const cards_generated = generate.card(questions_generated);

        $(".container").append(cards_generated[0]);

        for (let i = 0; i < cards_generated.length; i++) {
          const button = cards_generated[i].getElementsByClassName(
            "next-button"
          );

          for (let item of button) {
            item.addEventListener("click", () => {
              console.log("clicked");
              $(cards_generated[card_count]).css("display", "none");
              $(".container").append(cards_generated[card_count + 1]);
              card_count += 1;
            });
          }
        }
      })
      .catch(() => {
        alert("Error!");
      });
  }
});

$("#discord-logo").on("click", () => {
  alert(DISCORD_USERNAME);
});
