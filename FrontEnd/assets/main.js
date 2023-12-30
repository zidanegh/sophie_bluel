import { redirect } from "./util.js";
import {
  projetValideUi,
  formOptionUI,
  modifie,
  modeEdition,
  category,
  imageModal,
  cardUi,
} from "./textInnerHTML.js";

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
  if (param3 !== undefined) {
    param3(listeWorks);
  }
}

initPage(".gallery", cardUi, initFiltre);

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
    element.addEventListener("click", async () => {
      idModalSupprime.classList.remove("hide");
      idModalSupprime.classList.add("center");
      idModalAjout.classList.add("hide");
      idModalAjout.classList.remove("center");
      await initPage(".gallery-modal-supprime", imageModal, trashCan);
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
          }).then(async (response) => {
            if (response.status === 204) {
              parentModalFigure.classList.add("hide");
              galleryFigure.classList.add("hide");
              const removeFigure = element.parentNode.removeChild(element);
            } else {
              console.log(response.status);
            }
          });
        }
      });
    });
  });
}

async function validateurFormulaire() {
  const form = document.querySelector(".ajout");
  const token = verifToken();
  await initbtn(".categoriesid", null, formOptionUI);
  previewImage("1");
  checkInput();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData();
    const image = event.target.querySelector("[name=ajout-image]");
    const category = event.target.querySelector("[name=categorie]");
    data.append("image", image.files[0]);
    data.append(
      "title",
      event.target.querySelector("[name=input-titre]").value
    );
    data.append("category", parseInt(category.value));

    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "bearer " + token,
      },
      body: data,
    }).then(async (response) => {
      if (response.status === 201) {
        console.log("ça fonctionne");
        previewImage("2");
        btnValideProjet();
        clearInput();
        checkNewProjects();
        initPage(".gallery", cardUi, undefined);
      } else {
        console.log(response);
      }
    });
  });
}

function btnValideProjet() {
  const btnAjout = document.getElementById("btn-valide-projet");
  btnAjout.classList.remove("hide");
}
function checkInput() {
  const btnAjout = document.getElementById("btn-modal-valider");
  const inputImage = document.getElementById("upload-img");
  const inputTitre = document.querySelector("[name=input-titre]");
  const inputCategorie = document.querySelector("[name=categorie]");
  const form = document.querySelector(".gallery-modal-ajout form");
  const tableau = [inputImage, inputTitre, inputCategorie];

  tableau.forEach((element) => {
    element.addEventListener("input", () => {
      if (checkFormValidity(tableau) === true) {
        btnAjout.classList.remove("gray");
        btnAjout.classList.add("green");
        console.log("ça fonctionne");
        console.log(checkFormValidity(tableau));
      } else {
        btnAjout.classList.add("gray");
        btnAjout.classList.remove("green");
      }
    });
  });
}

function clearInput() {
  const inputTitre = document.querySelector("[name=input-titre]");
  const inputCategorie = document.querySelector("[name=categorie]");
  const btnAjout = document.getElementById("btn-modal-valider");
  [inputTitre, inputCategorie].forEach((element) => {
    element.value = " ";
  });
  btnAjout.classList.add("gray");
  btnAjout.classList.remove("green");
}

function checkFormValidity(elements) {
  return elements.every((element) => element.value.trim() !== "");
}

function previewImage(param) {
  const divImage = document.getElementById("input-img");
  const image = document.querySelector("[name=ajout-image]");
  const label = document.querySelector("[for=upload-img]");
  const btnAjout = document.getElementById("btn-valide-projet");
  btnAjout.classList.add("hide");
  if (param === "1") {
    image.addEventListener("change", () => {
      const imageFiles = image.files[0];
      if (imageFiles) {
        const imageSrc = URL.createObjectURL(imageFiles);
        const baliseImg = document.createElement("img");
        baliseImg.classList.add("display-img");
        label.classList.add("hide");
        label.classList.remove("label");
        divImage.appendChild(baliseImg);
        baliseImg.src = imageSrc;
        console.log(imageSrc);
      } else {
        console.log("Aucun fichier sélectionné");
      }
    });
  } else {
    const baliseImg = document.querySelector("#input-img img");
    baliseImg.parentNode.removeChild(baliseImg);
    label.classList.remove("hide");
    label.classList.add("label");
  }
}
async function checkNewProjects() {
  const listeworks = await getWorks();
  const figure = document.querySelectorAll("figure");
  figure.forEach((element) => {
    const figureId = element.id;
    console.log(figureId);
  });
  const backEndId = listeworks.forEach((elements) => {
    const id = elements.id;
    console.log(id);
  });
}
export { modeAdmin };
export { getWorks };
