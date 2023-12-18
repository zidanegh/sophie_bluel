async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

async function getcategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  return categories;
}

function cardUi(work) {
  return `
        <figure>
          <img src="${work.imageUrl}" alt="${work.title}"/>
          <figcaption >${work.title}</figcaption>
        </figure>
  `;
}

function displayWorks(listeWork, image) {
  const gallery = document.querySelector(image);
  gallery.innerHTML = "";
  listeWork.forEach((item) => {
    const nodeui = cardUi(item);
    gallery.innerHTML += nodeui;
  });
}

async function initPage() {
  const listeWorks = await getWorks();
  displayWorks(listeWorks, ".gallery");
  initFiltre(listeWorks);
}

initPage();

function category(categorie) {
  return `
      <button data-id="${categorie.id}" class="list-btn--style">${categorie.name}</button>
  `;
}

async function initbtn() {
  const listeCategories = await getcategories();
  const listBtn = document.querySelector(".list-btn");
  const createBtn = document.createElement("button");
  createBtn.classList.add("list-btn--style");
  createBtn.classList.add("list-btn__selected");
  createBtn.setAttribute("data-id", 0);
  listBtn.appendChild(createBtn);
  createBtn.innerHTML = "tous";
  listeCategories.forEach((item) => {
    const nodeui = category(item);
    listBtn.innerHTML += nodeui;
  });
  return listeCategories;
}

function filtreur(idCategory, works) {
  let workResult;
  const id = Number.parseInt(idCategory);
  if (id === 0) {
    workResult = works;
  } else {
    workResult = works.filter((work) => work.categoryId === id);
  }
  displayWorks(workResult, ".gallery");
}

async function initFiltre(works) {
  await initbtn();
  const listeFilter = document.querySelectorAll(".list-btn--style");
  listeFilter.forEach((button) => {
    button.addEventListener("click", () => {
      const dataId = button.dataset.id;

      listeFilter.forEach((btn) => btn.classList.remove("list-btn__selected"));
      button.classList.add("list-btn__selected");
      filtreur(dataId, works);
    });
  });
  modeAdmin();
  modalModifier();
}

function ciblageBaliseLi() {
  let baliseUl = document.querySelector("nav ul");
  const baliseLiLogin = baliseUl.getElementsByTagName("li")[2];
  baliseLiLogin.addEventListener("click", () => {
    redirect("./assets/login.html");
  });
}

function redirect(chemin, preciserFunction) {
  const cheminRedirection = chemin;
  window.location.href = cheminRedirection;
}
ciblageBaliseLi();

export { redirect };
export { getWorks };

import { verifToken } from "./login.js";
import { verificateurBoeleen } from "./login.js";
import { preventDefaults } from "./login.js";

function modeEdition() {
  return `
  <i class="fa-regular fa-pen-to-square"></i><p>Mode edition</p>
  `;
}
function modifie() {
  return `
  <button class="btnModifier">
  <i class="fa-regular fa-pen-to-square"></i><p>modifier</p>
  </button>
  `;
}

export { modeAdmin };
function modeAdmin() {
  const edition = document.getElementById("edition");
  const modifier = document.querySelector(".modifier");
  const nodeModeEdition = modeEdition();
  const nodeModifier = modifie();
  if (edition.classList.contains("edition")) {
    localStorage.removeItem("token");
    console.log("avion");
  }
  if (verifToken() !== null || undefined) {
    console.log("poilu");
    edition.classList.add("edition");
    edition.innerHTML += nodeModeEdition;
    modifier.innerHTML += nodeModifier;
  } else {
    console.log(verifToken());
    console.log("poil");
  }
}

function modalModifier() {
  const btnModifier = document.querySelector(".btnModifier");
  const idModal = document.getElementById("modal-Modifier");
  const Modal = document.querySelector(".modal-wrapper");
  btnModifier.addEventListener("click", () => {
    idModal.classList.remove("hide");
    idModal.classList.add("center");
    displayWorks(listeWorks, ".gallery-modal");
  });
  idModal.addEventListener("click", () => {
    console.log("poule");
    idModal.classList.add("hide");
    idModal.classList.remove("center");
    console.log(idModal.classList);
  });
  Modal.addEventListener("click", (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
  });
}
