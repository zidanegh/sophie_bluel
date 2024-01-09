import { redirect, baseUrlServeur } from "./util.js";
import {
  projetValideUi,
  formOptionUI,
  modifie,
  modeEdition,
  category,
  imageModal,
  cardUi,
} from "./textInnerHTML.js";
// cherche les works dans le serveur
async function getWorks() {
  const response = await fetch(baseUrlServeur + "works");
  const works = await response.json();
  return works;
}
//cherche les catégories dans le serveur
async function getcategories() {
  const response = await fetch(baseUrlServeur + "categories");
  const categories = await response.json();
  return categories;
}
/**
 * rajoute les elements dans le dom selon ce que va être le tableau
 *
 * @param {Array} listeWork utile une boucle pour display les différents projets
 * @param {string} zoneWork la zone du DOM que l'on cherche
 * @param {Function} fonctionInnerHtml prend les functions à rajouter dans le html
 */
function displayWorks(listeWork, zoneWork, fonctionInnerHtml) {
  const gallery = document.querySelector(zoneWork);
  gallery.innerHTML = "";
  listeWork.forEach((item) => {
    const nodeui = fonctionInnerHtml(item);
    gallery.innerHTML += nodeui;
  });
}

/**
 * call displayWorks donne le tableau works et rajoute des fonctionalité si besoin
 *
 * @param {Array} zoneWork la zone du DOM que l'on cherche
 * @param {Function} fonctionInnerHtml prend la function à rajouter dans le html
 * @param {Function} fonctionAjoutFonctionalite prend la function qui rajoute des fonctionalité en plus
 */
async function initImage(
  zoneWork,
  fonctionInnerHtml,
  fonctionAjoutFonctionalite
) {
  const listeWorks = await getWorks();
  displayWorks(listeWorks, zoneWork, fonctionInnerHtml);
  if (fonctionAjoutFonctionalite !== undefined) {
    fonctionAjoutFonctionalite(listeWorks);
  }
}

//appelle initImage pour afficher les projets sur l'écran principal
initImage(".gallery", cardUi, initFiltre);

/**
 * sert soit à créer un btn et attribuer une data-Id et/ou à mettre dans le html des elements
 *
 * @param {string} zoneDiv la zone Div qu'on veut utilisé
 * @param {string} createElement crée un element
 * @param {Function} fonctionInnerHtml prend les functions à rajouter dans le html
 * @return {Array} renvois les catégories
 */
async function initbtn(zoneDiv, createElement, fonctionInnerHtml) {
  const listeCategories = await getcategories();
  const listBtn = document.querySelector(zoneDiv);
  const createBtn = document.createElement(createElement);
  if (createBtn !== null || undefined) {
    createBtn.classList.add("list-btn--style");
    createBtn.classList.add("list-btn__selected");
    createBtn.setAttribute("data-id", 0);
    listBtn.appendChild(createBtn);
    createBtn.innerHTML = "tous";
  }
  listeCategories.forEach((item) => {
    const nodeui = fonctionInnerHtml(item);
    listBtn.innerHTML += nodeui;
  });
  return listeCategories;
}

/**
 * filtre par id
 *
 * @param {string} idCategory prend un chiffre
 * @param {} works
 */
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
/**
 *filtre les works selon le btn
 *
 * @param {Array} works c'est le tableau des works qui est récupérer grâce au callback de initfiltre dans le initImage
 */
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

/** cible le login en header*/
function ciblageBaliseLi() {
  let baliseUl = document.querySelector("nav ul");
  const baliseLiLogin = baliseUl.getElementsByTagName("li")[2];
  baliseLiLogin.addEventListener("click", () => {
    if (baliseLiLogin.textContent === "login") {
      redirect("./login.html");
      console.log("ça clique");
    } else {
      logout();
    }
  });
}

ciblageBaliseLi();

function logout() {
  const edition = document.getElementById("edition");
  const modifier = document.querySelector(".modifier");
  let baliseUl = document.querySelector("nav ul");
  const baliseLiLogin = baliseUl.getElementsByTagName("li")[2];
  edition.classList.remove("edition");
  edition.innerHTML = "";
  modifier.innerHTML = "";
  localStorage.removeItem("token");
  baliseLiLogin.innerText = "login";
}

/**cherche si il y a un token dans le localStorage*/
function verifToken() {
  const storedToken = localStorage.getItem("token");
  return storedToken;
}

/**effectue des changements sur la page d'accueil si verifToken retourne quelque chose*/
function modeAdmin() {
  const edition = document.getElementById("edition");
  const modifier = document.querySelector(".modifier");
  let baliseUl = document.querySelector("nav ul");
  const baliseLiLogin = baliseUl.getElementsByTagName("li")[2];
  const nodeModeEdition = modeEdition();
  const nodeModifier = modifie();
  if (verifToken() !== null || undefined) {
    baliseLiLogin.innerText = "logout";
    edition.classList.add("edition");
    edition.innerHTML += nodeModeEdition;
    modifier.innerHTML += nodeModifier;
    modalModifier();
    validateurFormulaire();
  }
}

/**pour les deux modals et les icons au click ferme ou ouvre l'une des modals*/
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
      await initImage(".gallery-modal-supprime", imageModal, trashCan);
    });
  });
  modalArrowLeft.addEventListener("click", () => {
    clearInput();
    previewImage("2");
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

/**au click sur la zone de l'icon trashcan supprimera l'image auquel appartient l'icon*/
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
          fetch(baseUrlServeur + "works/" + id, {
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
            }
          });
        }
      });
    });
  });
}

/**
 * valide le formulaire et envoie les informations au serveur pour ajouté les projets
 */
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
    await fetch(baseUrlServeur + "works", {
      method: "POST",
      headers: {
        Authorization: "bearer " + token,
      },
      body: data,
    }).then(async (response) => {
      if (response.status === 201) {
        previewImage("2");
        btnValideProjet();
        clearInput();
        initImage(".gallery", cardUi, undefined);
      }
    });
  });
}

/**
 * signalement que le projet à était rajouté
 */
function btnValideProjet() {
  const btnAjout = document.getElementById("btn-valide-projet");
  btnAjout.classList.remove("hide");
}

/**
 * vérifie si les champs inputs sont remplie ou pas et change la couleur du btn selon ce qui est
 * renvoyé par la function checkFormValidity
 */
function checkInput() {
  const btnAjout = document.getElementById("btn-modal-valider");
  const inputImage = document.getElementById("upload-img");
  const inputTitre = document.querySelector("[name=input-titre]");
  const inputCategorie = document.querySelector("[name=categorie]");
  const form = document.querySelector(".gallery-modal-ajout form");
  const tableau = [inputImage, inputTitre, inputCategorie];
  inputImage.addEventListener("input", (element) => {
    if (
      returnExtensionFile(inputImage) === "jpg" ||
      returnExtensionFile(inputImage) === "png"
    ) {
      console.log(typeof returnExtensionFile(inputImage));
      console.log("c'est bon");
    } else {
      inputImage.value = "";
      console.log("c'est pas bon");
    }
  });

  tableau.forEach((element) => {
    element.addEventListener("input", () => {
      if (checkFormValidity(tableau) === true) {
        btnAjout.classList.remove("gray");
        btnAjout.classList.add("green");
      } else {
        btnAjout.classList.add("gray");
        btnAjout.classList.remove("green");
      }
    });
  });
}
function returnExtensionFile(zoneDOM) {
  const filename = zoneDOM.value;
  return filename.split(".").pop();
}
/**
 * vérifie les inputs
 */
function clearInput() {
  const inputTitre = document.querySelector("[name=input-titre]");
  const inputCategorie = document.querySelector("[name=categorie]");
  const btnAjout = document.getElementById("btn-modal-valider");
  [inputTitre, inputCategorie].forEach((element) => {
    console.log(element);
    element.value = " ";
  });
  btnAjout.classList.add("gray");
  btnAjout.classList.remove("green");
}

function checkFormValidity(elements) {
  return elements.every((element) => element.value.trim() !== "");
}

/**
 * affiche une image dans le carré dans la div id input-img
 * @param {string} choixCondition selon le string affichera la preview ou affiche le label
 */
function previewImage(choixCondition) {
  const divImage = document.getElementById("input-img");
  const image = document.querySelector("[name=ajout-image]");
  const label = document.querySelector("[for=upload-img]");
  const btnAjout = document.getElementById("btn-valide-projet");
  btnAjout.classList.add("hide");
  if (choixCondition === "1") {
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
      }
    });
  } else {
    const baliseImg = document.querySelector("#input-img img");
    baliseImg.parentNode.removeChild(baliseImg);
    label.classList.remove("hide");
    label.classList.add("label");
  }
}

export { getWorks, modeAdmin };
