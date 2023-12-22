import { redirect } from "./util.js";

async function validateurFormulaire() {
  const form = document.querySelector(".form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const connexion = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    const chargeUtile = JSON.stringify(connexion);
    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    }).then(async (response) => {
      if (response.ok) {
        console.log(response);
        verificationInput(response.status);
        await token(response);
        redirect("./index.html");
      } else {
        verificationInput(response.status);
      }
    });
  });
}
validateurFormulaire();

async function token(tokens) {
  const responseData = await tokens.json();
  const takeToken = responseData.token;
  localStorage.setItem("token", takeToken);
}

function verificationInput(status) {
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
