document.addEventListener("DOMContentLoaded", () => {
  let navLogin = document.querySelector(".btn-login");
  let navLogout = document.querySelector(".btn-logout");
  let token = JSON.parse(localStorage.getItem("token"));
  (() => {
    var myHeaders = new Headers();
    myHeaders.append("token", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/departments", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: Response.status });
        }
      })
      .then((result) => {
        console.log(result);
        localStorage.setItem("depts", JSON.stringify(result.data));
      })
      .catch((err) => {
        console.log("error", err.status);
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
});
