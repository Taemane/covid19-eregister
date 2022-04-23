document.addEventListener("DOMContentLoaded", () => {
  let tableData = document.querySelector(".table-data");
  let modal = document.querySelector(".modal");
  let modalMsg = document.querySelector(".modal-msg");
  let authModal = document.querySelector(".authorized-modal");
  let token = JSON.parse(localStorage.getItem("token"));

  (() => {
    var myHeaders = new Headers();
    myHeaders.append("token", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/auth/verify", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: response.status });
        }
      })
      .then((result) => {
        if (result.verification) {
          return getEntriesList();
        }
      })
      .catch((error) => {
        if (error.status === 403) {
          authModal.classList.remove("hide");
          authModal.classList.add("show");
        } else if (error.status === 500) {
          modalStatus("Server Internal error");
        }
      });
  })();

  let navLogin = document.querySelector(".btn-login");
  let navLogout = document.querySelector(".btn-logout");

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

  function getEntriesList() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/entry-list", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: response.status });
        }
      })
      .then((result) => {
        data = result.data;
        populateTable(data);
      })
      .catch((err) => {
        console.log("error", err.status);
        modalStatus(err.status);
      });
  }

  function populateTable(data) {
    let output = "";

    data.map((person) => {
      output += `
      <tr>
      <td>${person.names}</td>
      <td>${person.cell_number}</td>
      <td>${person.create_on}</td>
      <td>${person.question_1}</td>
      <td>${person.question_2}</td>
      <td>${person.question_3}</td>
      <td>${person.question_4}</td>
      <td>${person.question_5}</td>
      <td>${person.question_6}</td>
      <td>${person.question_7}</td>
      <td>${person.question_8}</td>
      <td>${person.vaccinated}</td>
      <td>${person.temperature}</td>
      `;
    });

    tableData.innerHTML = output;
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
});
