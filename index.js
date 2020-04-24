const DISCORD_USERNAME = "Slomoose#9772";

$("#welcome-form").on("submit", (e) => {
  e.preventDefault();

  const name = $("#name-input").val();
  const questions_count = $("#questions-count-input option:selected").text();

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
    const computerAPI =
      "https://opentdb.com/api.php?amount=30&category=18&difficulty=easy&type=multiple";

    fetch(computerAPI)
      .then((response) => {
        return response.json();
      })
      .then((dataRetrieved) => {
        $(".main-row").toggle();

        const { results } = dataRetrieved;

        const card = document.createElement("div");
        $(card).addClass("row question-row");

        const markup = `
        <div class="col-sm-12 d-flex justify-content-center">
          <div class="card text-center">
            <div class="card-header">
              QUESTION 1
            </div>
            <div class="card-body">
              <h5 class="card-title">Which company is the World's Most Ethical Company?</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
            <div class="card-footer text-muted">
              2 days ago
            </div>
          </div>
        </div>
        `;

        $(card).html(markup);
        $(".container").append(card);

        // for (let item of results) {
        //   const {
        //     category,
        //     correct_answer,
        //     difficulty,
        //     incorrect_answers,
        //     question,
        //     type,
        //   } = item;

        //   console.log(`${question}: ${correct_answer}`);
        // }
      })
      .catch(() => {
        alert("Error!");
      });
  }
});

$("#discord-logo").on("click", () => {
  alert(DISCORD_USERNAME);
});
