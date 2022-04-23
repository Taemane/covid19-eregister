document.addEventListener("DOMContentLoaded", () => {
  let userEmail = document.querySelector(".user_email");
  let userPassword = document.querySelector(".user_password");
  let btnLogin = document.querySelector(".btn-login");
  let modal = document.querySelector(".modal");
  let modalMsg = document.querySelector(".modal-msg");

  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    if (userEmail.value === "" || userPassword === "") {
      modalStatus("Enter Email and Password");
    } else {
      userLogin(userEmail.value, userPassword.value);
    }
  });

  function userLogin(userEmail, userPassword) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({
      user_email: userEmail,
      user_password: userPassword,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/auth/login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: response.status });
        }
      })
      .then((result) => {
        console.log(result);
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("user_role", JSON.stringify(result.user_role));
        window.location.replace("index.html");
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 401) {
          modalStatus("Email or Password is incorrect");
        } else if (error.status === 500) {
          modalStatus("Internal Server Error");
        }
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
});
