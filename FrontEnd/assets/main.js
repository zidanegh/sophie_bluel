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
}

initPage(".gallery", cardUi, initFiltre);

function category(categorie) {
  return `
      <button data-id="${categorie.id}" class="list-btn--style">${categorie.name}</button>
  `;
}

async function initbtn(param, param2, param3) {
  const listeCategories = await getcategories();
  const listBtn = document.querySelector(param);
  const createBtn = document.createElement(param2);
  if (createBtn !== null || undefined) {
    createBtn.classList.add("list-btn--style");
    createBtn.classList.add("list-btn__selected");
    createBtn.setAttribute("data-id", 0);
    listBtn.appendChild(createBtn);
    createBtn.innerHTML = "tous";
  }
  listeCategories.forEach((item) => {
    const nodeui = param3(item);
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
  await initbtn(".list-btn", "button", category);
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
    edition.classList.add("edition");
    edition.innerHTML += nodeModeEdition;
    modifier.innerHTML += nodeModifier;
    modalModifier();
    validateurFormulaire();
  } else {
    console.log("poil");
  }
}

function modalModifier() {
  const btnModifier = document.querySelector(".btnModifier");
  const btnAjout = document.getElementById("btn-modal");
  const idModalSupprime = document.getElementById("modal-Modifier-supprime");
  const idModalAjout = document.getElementById("modal-Modifier-ajout");
  const modalSupprime = document.getElementById("supprime");
  const modalAjout = document.getElementById("ajout");
  const modalArrowLeft = document.querySelector(".fa-arrow-left");
  const ModalXmark = document.querySelectorAll(".fa-xmark");
  [modalArrowLeft, btnModifier].forEach((element) => {
    element.addEventListener("click", () => {
      idModalSupprime.classList.remove("hide");
      idModalSupprime.classList.add("center");
      idModalAjout.classList.add("hide");
      idModalAjout.classList.remove("center");
      initPage(".gallery-modal", imageModal, trashCan);
    });
  });
  idModalSupprime.addEventListener("click", () => {
    idModalSupprime.classList.add("hide");
    idModalSupprime.classList.remove("center");
  });
  btnAjout.addEventListener("click", () => {
    idModalAjout.classList.remove("hide");
    idModalAjout.classList.add("center");
    idModalSupprime.classList.add("hide");
    idModalSupprime.classList.remove("center");
  });
  idModalAjout.addEventListener("click", () => {
    idModalAjout.classList.add("hide");
    idModalAjout.classList.remove("center");
  });
  modalSupprime.addEventListener("click", (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
  });
  modalAjout.addEventListener("click", (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation();
  });
  ModalXmark.forEach((element) => {
    element.addEventListener("click", () => {
      idModalAjout.classList.add("hide");
      idModalAjout.classList.remove("center");
      idModalSupprime.classList.add("hide");
      idModalSupprime.classList.remove("center");
    });
  });
}

async function trashCan() {
  const trash = document.querySelectorAll(".fa-trash-can");
  const galleryFigureAll = document.querySelectorAll(".gallery figure");
  trash.forEach((element) => {
    element.addEventListener("click", () => {
      const parentModalFigure = element.parentNode;
      const img = element.previousElementSibling;
      const modalImgURL = img.src;
      const token = verifToken();
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
          }).then(() => {
            parentModalFigure.classList.add("hide");
            galleryFigure.classList.add("hide");
          });
        }
      });
    });
  });
}

function formUI(work) {
  return `
  <option value="${work.id}">${work.name}</option>`;
}

async function validateurFormulaire() {
  const form = document.querySelector(".ajout");
  const token = verifToken();
  await initbtn(".categoriesid", null, formUI);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append(
      "categoryId",
      event.target.querySelector("[name=categorie]").value
    );
    data.append(
      "title",
      event.target.querySelector("[name=input-titre]").value
    );
    data.append(
      "imageUrl",
      event.target.querySelector("[name=ajout-image]").value
    );
    console.log(data);
    const work = JSON.stringify(data);
    console.log(work);
    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Content-Type": " multipart/form-data",
        accept: "application/json",
        Authorization: "bearer " + token,
      },
      body: data,
    });
  });
}

export { modeAdmin };
export { getWorks };
