$('[data-toggle="tooltip"]').tooltip();

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
              QUESTION <span class="question-count">${i + 1}</span>
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

    const new_arr = shuffle(choices);

    return new_arr
      .map(
        (answer) =>
          `<li class="list-group-item choices-item choices-item-hover">${answer}</li>`
      )
      .join("");
  },
  result_card: () => {},
  decode: (str) => {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
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
        let score = 0;

        const { results } = dataRetrieved;

        const questions_generated = generate.questions(results, ques_count);
        const cards_generated = generate.card(questions_generated);

        $(".container").append(cards_generated[0]);

        for (let i = 0; i < cards_generated.length; i++) {
          const button = cards_generated[i].getElementsByClassName(
            "next-button"
          );

          const choices = cards_generated[i].getElementsByClassName(
            "choices-item"
          );

          const selections = [];
          const selectedElements = [];

          for (let choice of choices) {
            choice.addEventListener("click", function (e) {
              selections.push(e.target.innerHTML);

              if ($(this).hasClass("selected")) {
                $(this).removeClass("selected selected-hover");
                $(".choices-item").removeClass("selected selected-hover");
              } else {
                $(".choices-item").removeClass("selected selected-hover");
                $(this).addClass("selected selected-hover");
              }

              selectedElements.push(this);
            });
          }

          for (let item of button) {
            item.addEventListener("click", () => {
              if (selections.length === 0) {
                return;
              }

              for (let choice of choices) {
                $(choice).removeClass("choices-item-hover");
                $(choice).removeClass("selected selected-hover");
                $(choice).addClass("disable");
              }

              const answer = selectedElements[selectedElements.length - 1];

              if (
                selections[selections.length - 1] ===
                questions_generated[i].correct_answer
              ) {
                score += 1;
                answer.classList.add("correct-answer");
              } else {
                answer.classList.add("wrong-answer");
              }

              $(cards_generated[card_count]).css("display", "none");

              if (card_count + 1 === cards_generated.length) {
                const result_card = document.getElementById("result-card");
                const result_body = document.getElementById("result-body");

                $(result_card).css("display", "inline-block");

                for (let i = 0; i < cards_generated.length; i++) {
                  $(".question-row").css("display", "inline-block");
                  $(".question-row").css("marginTop", "20px");

                  $(".question-footer").css("display", "none");

                  $("#score-text").text(`${score}`);
                  $("#total-text").text(`${ques_count}`);

                  result_body.append(cards_generated[i]);
                }
              } else {
                $(".container").append(cards_generated[card_count + 1]);

                card_count += 1;
              }
            });
          }
        }
      })
      .catch(() => {
        alert("Error!");
      });
  }
});

function copy(value) {
  var tempInput = document.createElement("input");
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

$("#discord-logo").on("click", function () {
  $("#discord-logo").attr("title", "Copied!");
  $("#discord-logo").attr("data-original-title", "Copied!");
  $("#discord-logo").tooltip("update");
  $("#discord-logo").tooltip("show");

  copy("Slomoose#9772");
});
