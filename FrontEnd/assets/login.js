//async function getLogin() {
//const response = await fetch("http://localhost:5678/api/users/login", {
//method: "POST",
//headers: {
// Authorization:
//"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4",
//"Content-Type": "application/json",
//},
//body: verificationtoken(),
//});
//const getLogins = await response.json();
//return getLogins;
//}

function redirect() {
  let baliseUl = document.querySelector("nav ul");
  const baliseLiLogin = baliseUl.getElementsByTagName("li")[2];
  baliseLiLogin.addEventListener("click", () => {
    const cheminRedirection = "./assets/login.html";
    window.location.href = cheminRedirection;
  });
}
redirect();

async function preventDefault() {
  const form = document.querySelector(".form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const connexion = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    console.log(connexion);
    const chargeUtile = JSON.stringify(connexion);
    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    });
    token();
  });
}
preventDefault();

function verificationinput() {
  const email = document.getElementById("email");
  const motDePasse = document.getElementById("motdepasse");
  email.addEventListener("change", (event) => {
    console.log(email);
    email.classList.add("red");
  });
  motDePasse.addEventListener("change", (event) => {
    console.log(motDePasse);
    motDePasse.classList.add("red");
  });
}

function token(tokens) {
  const takeToken = tokens.token;
  console.log(takeToken);
}
