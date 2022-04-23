document.addEventListener("DOMContentLoaded", () => {
  let tableData = document.querySelector(".table-data");
  let registerModal = document.querySelector(".register-modal");
  let closeModal = document.querySelector(".close-modal");
  let registerModalBtn = document.querySelector(".register-modal-btn");
  let modal = document.querySelector(".modal");
  let modalMsg = document.querySelector(".modal-msg");
  let authModal = document.querySelector(".authorized-modal");
  //register modal inputs
  let empName = document.querySelector(".emp-name");
  let empCell = document.querySelector(".emp-cell-number");
  let empDept = document.querySelector(".department");
  let empVacc = document.querySelector(".emp-vaccine-status");
  let btnRegister = document.querySelector(".btn-register");
  let depts = JSON.parse(localStorage.getItem("depts"));
  let token = JSON.parse(localStorage.getItem("token"));
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
          return getAllEmployees();
        }
      })
      .catch((error) => {
        console.log("error", error);
        if (error.status === 403) {
          authModal.classList.remove("hide");
          authModal.classList.show("show");
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

  //list of depts

  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    let _empName = empName.value;
    let _empCell = empCell.value;
    let _empDept = empDept.value;
    let _empVacc = empVacc.value;

    if (
      _empName === "" ||
      _empCell === "" ||
      _empDept === "" ||
      _empVacc === ""
    ) {
      modalStatus("Enter information in all fields");
    } else if (_empCell.length < 10 || _empCell.length > 10) {
      modalStatus(
        "Employee Cell number cannot be less or greater than 10 digits"
      );
    } else {
      let employee = {
        names: _empName,
        cell_number: _empCell,
        dept_id: _empDept,
        vaccinated: _empVacc,
      };

      saveEmployee(employee);
    }
  });

  function saveEmployee(employee) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify(employee);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/employees", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: Response.status });
        }
      })
      .then((result) => {
        console.log(result);

        registerModal.classList.remove("show");
        registerModal.classList.add("hide");

        modalStatus("Employee registered successfully");

        getAllEmployees();
      })
      .catch((err) => {
        console.log("error", err.status);
      });
  }

  closeModal.addEventListener("click", () => {
    registerModal.classList.remove("show");
    registerModal.classList.add("hide");
  });

  registerModalBtn.addEventListener("click", () => {
    registerModal.classList.remove("hide");
    registerModal.classList.add("show");
    fillDepts();
  });

  function fillDepts() {
    let depts = JSON.parse(localStorage.getItem("depts"));
    let output = "";
    output += `<option value="">Select department</option>`;
    depts.map((dept) => {
      output += `
        <option value="${dept.dept_id}">${dept.dept_name}</option>
        `;
    });
    empDept.innerHTML = output;
  }

  function getAllEmployees() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5001/api/v1/employees", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({ status: response.status });
        }
      })
      .then((result) => {
        fillTable(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fillTable(data) {
    let output = "";
    //TODO: use filter method to get the dept name.

    data.map((employee) => {
      let _depts = depts.filter((dept) => {
        return dept.dept_id === employee.dept_id;
      });

      output += `
        <tr>
            <td>${employee.names}</td>
            <td>${employee.cell_number}</td>
            <td>${_depts[0].dept_name}</td>
            <td>${employee.vaccinated}</td>
            <td>
              <button class="btn btn-profile">
                  View Profile <i class="fas fa-user"></i>
              </button>
            </td>
        </tr>  
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
