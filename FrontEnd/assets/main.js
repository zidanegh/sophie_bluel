import { redirect } from "./util.js";
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
        <figure id="${work.id}">
          <img src="${work.imageUrl}" alt="${work.title}"/>
          <figcaption >${work.title}</figcaption>
        </figure>
  `;
}

function imageModal(work) {
  return `
        <figure>
          <img src="${work.imageUrl}" alt="${work.title}"/>
          <i class="fa-solid fa-trash-can"></i>
        </figure>
  `;
}

function displayWorks(listeWork, image, param) {
  const gallery = document.querySelector(image);
  gallery.innerHTML = "";
  listeWork.forEach((item) => {
    const nodeui = param(item);

    gallery.innerHTML += nodeui;
  });
}

async function initPage(param, param2, param3) {
  const listeWorks = await getWorks();
  displayWorks(listeWorks, param, param2);
  param3(listeWorks);
  console.log(listeWorks.length);
}

initPage(".gallery", cardUi, initFiltre);

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
  displayWorks(workResult, ".gallery", cardUi);
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
    redirect("./login.html");
  });
}

ciblageBaliseLi();

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
function verifToken() {
  const storedToken = localStorage.getItem("token");
  return storedToken;
}
function modeAdmin() {
  const edition = document.getElementById("edition");
  const modifier = document.querySelector(".modifier");
  const nodeModeEdition = modeEdition();
  const nodeModifier = modifie();
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
    initPage(".gallery-modal", imageModal, trashCan);
  });
  idModal.addEventListener("click", () => {
    idModal.classList.add("hide");
    idModal.classList.remove("center");
  });
  Modal.addEventListener("click", (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
  });
}

async function trashCan() {
  const trash = document.querySelectorAll(".fa-trash-can");
  const galleryFigureAll = document.querySelectorAll(".gallery figure");
  console.log(trash);
  trash.forEach((element) => {
    element.addEventListener("click", () => {
      const parentModalFigure = element.parentNode;
      const img = element.previousElementSibling;
      const modalImgURL = img.src;
      const token = verifToken();
      console.log(token);
      galleryFigureAll.forEach((element) => {
        const galleryFigure = element;
        const galleryId = element.id;
        const galleryImg = element.firstElementChild;
        const galleryImgURL = galleryImg.src;
        const id = Number.parseInt(galleryId);
        if (galleryImgURL === modalImgURL) {
          fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token,
            },
          })
            .then((response) => {
              parentModalFigure.classList.add("hide");
              galleryFigure.classList.add("hide");
              console.log(response);
            })
            .catch((error) => {
              console.error(error);
            });
          console.log(localStorage.getItem("token"));
          console.log(galleryId, modalImgURL, galleryImgURL);
        }
      });
    });
  });
}

function modalBtn() {}

export { modeAdmin };
export { getWorks };
