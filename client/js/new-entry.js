document.addEventListener("DOMContentLoaded", () => {
  let names = document.querySelector(".names");
  let cellNumbers = document.querySelector(".cell-numbers");
  let question_1 = document.querySelector(".question_1");
  let question_2 = document.querySelector(".question_2");
  let question_3 = document.querySelector(".question_3");
  let question_4 = document.querySelector(".question_4");
  let question_5 = document.querySelector(".question_5");
  let question_6 = document.querySelector(".question_6");
  let question_7 = document.querySelector(".question_7");
  let question_8 = document.querySelector(".question_8");
  let vaccinated = document.querySelector(".vaccinated");
  let temperature = document.querySelector(".temperature");
  let saveBtn = document.querySelector(".save-btn");
  let modal = document.querySelector(".modal");
  let modalMsg = document.querySelector(".modal-msg");

  let navLogin = document.querySelector(".btn-login");
  let navLogout = document.querySelector(".btn-logout");
  let token = JSON.parse(localStorage.getItem("token"));
  (() => {
    if (token === null) {
      navLogin.classList.remove("hide");
      navLogin.classList.add("show");
      navLogout.classList.remove("show");
      navLogout.classList.add("hide");
    } else {
      navLogin.classList.remove("show");
      navLogin.classList.add("hide");
      navLogout.classList.remove("hide");
      navLogout.classList.add("show");
    }
  })();

  navLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("index.html");
  });

  let searchContact = document.querySelector(".search-contact");
  let searchResults = document.querySelector(".search-results");
  let results = document.querySelector(".results");

  searchContact.addEventListener("keyup", (e) => {
    e.preventDefault();

    // if (searchContact.value === "") {
    //   searchResults.classList.remove("show");
    //   searchResults.classList.add("hide");
    // }

    // Use setTimeout Funct

    searchResults.classList.remove("hide");
    searchResults.classList.add("show");

    let employees = JSON.parse(localStorage.getItem("employees"));
    let value = searchContact.value;

    let matchEmployees = employees.filter((employee) => {
      let cell = employee.cell_number;
      return cell.includes(value);
    });

    if (matchEmployees.length > 0) {
      let output = "";
      output += '<i class="fas fa-times-circle close-search-results"></i>';
      matchEmployees.map((match) => {
        output += `
        
      <div class="result">
        <i class="fas fa-check-circle select"></i>
        <p value="">
        ${match.cell_number} | ${match.names}</p>
      </div>
      `;
      });

      results.innerHTML = output;
    } else {
      output += `
      <div class="result">
        <i class="fas fa-check-circle select"></i>
        <p value="">No employee found</p>
      </div>
      `;

      results.innerHTML = output;
    }
  });

  // Event deligation
  results.addEventListener("click", (e) => {
    if (e.target && e.target.matches("p")) {
      let values = e.target.innerText.split(" | ");

      cellNumbers.value = values[0];
      names.value = values[1];

      searchResults.classList.remove("show");
      searchResults.classList.add("hide");

      searchContact.value = "";
    } else if (e.target && e.target.matches(".close-search-results")) {
      searchResults.classList.remove("show");
      searchResults.classList.add("hide");
    }
  });

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (
      names.value === "" ||
      cellNumbers.value === "" ||
      temperature.value === ""
    ) {
      modalStatus("Names, Cell Number and Temperature fields cannot be empty.");
      return;
    } else if (cellNumbers.value.length < 10 || cellNumbers.value.length > 10) {
      modalStatus("Cell Numbers cannot be less or greater than 10 digits");
      return;
    } else {
      let entry = {
        names: names.value,
        cell_number: cellNumbers.value,
        question_1: question_1.checked,
        question_2: question_2.checked,
        question_3: question_3.checked,
        question_4: question_4.checked,
        question_5: question_5.checked,
        question_6: question_6.checked,
        question_7: question_7.checked,
        question_8: question_8.checked,
        vaccinated: vaccinated.checked,
        temperature: temperature.value,
      };

      addEntry(entry);
      console.log(entry);
    }
  });

  function addEntry(entry) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify(entry);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/entry-list", requestOptions)
      .then((response) => {
        if (response.ok) {
          modalStatus("Entry was successful");
          clearInput();
          return response.json();
        } else {
          return Promise.reject({ status: Response.status });
        }
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.status);
        modalStatus(err.status);
      });
  }

  function modalStatus(msg) {
    modal.classList.remove("hide");
    modal.classList.add("show");
    modalMsg.innerText = msg;

    setTimeout(() => {
      modal.classList.remove("show");
      modal.classList.add("hide");
    }, 4000);
  }

  function clearInput() {
    names.value = "";
    cellNumbers.value = "";
    question_1.checked = false;
    question_2.checked = false;
    question_3.checked = false;
    question_4.checked = false;
    question_5.checked = false;
    question_6.checked = false;
    question_7.checked = false;
    question_8.checked = false;
    vaccinated.checked = false;
    temperature.value = "";
  }
});
