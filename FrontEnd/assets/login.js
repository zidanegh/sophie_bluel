import { redirect } from "./main.js";
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
    }).then((response) => {
      if (response.ok) {
        verificationinput(response.status);
        token(response);
        veriftoken();
        redirect("../index.html");
      } else {
        verificationinput(response.status);
      }
    });
  });
}
preventDefault();
async function token(tokens) {
  const responseData = await tokens.json();
  const takeToken = responseData.token;
  localStorage.setItem("token", takeToken);
}

function verificationinput(status) {
  const idEmail = document.getElementById("email");
  const idMotDePasse = document.getElementById("motdepasse");
  const incorrect = document.querySelector(".red--letters");
  if (status === 200) {
    idEmail.classList.remove("red");
    idMotDePasse.classList.remove("red");
    incorrect.classList.add("hide");
  } else {
    incorrect.classList.remove("hide");
    idEmail.classList.add("red");
    idMotDePasse.classList.add("red");
  }
}

function veriftoken() {
  const storedToken = localStorage.getItem("token");
  return storedToken;
}
export { veriftoken };
