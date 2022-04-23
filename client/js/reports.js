document.addEventListener("DOMContentLoaded", () => {
  let ctx = document.querySelector(".report-chart").getContext("2d");
  let modal = document.querySelector(".modal");
  let modalMsg = document.querySelector(".modal-msg");
  let authModal = document.querySelector(".authorized-modal");
  let token = JSON.parse(localStorage.getItem("token"));
  //
  let navLogin = document.querySelector(".btn-login");
  let navLogout = document.querySelector(".btn-logout");

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

  const labels = [
    "Label 1",
    "Label 2",
    "Label 3",
    "Label 4",
    "Label 5",
    "Label 6",
    "Label 7",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Temperatures Chart",
        data: [20, 60, 70, 85, 96, 105, 150],
        fill: true,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value + " deg";
            },
          },
        },
      },
    },
  };

  const reportChart = new Chart(ctx, config);

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
