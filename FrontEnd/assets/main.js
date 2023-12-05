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

async function initPage() {
  const listeWorks = await getWorks();
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  listeWorks.forEach((item) => {
    const nodeui = cardUi(item);
    gallery.innerHTML += nodeui;
  });
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
  listBtn.appendChild(createBtn);
  createBtn.innerHTML = "tous";
  listeCategories.forEach((item) => {
    const nodeui = category(item);
    listBtn.innerHTML += nodeui;
  });
  return listeCategories;
}

async function filtreur(nbr) {
  const execution = await getWorks();
  const executionpage = await initPage();
  const projet = Array.from(execution);
  const me = document.querySelectorAll("#portfolio figure");
  const mee = document.querySelector("#portfolio figure");
  const idImg = projet.forEach((element) => {
    const categoryId = element.categoryId;
    const Id = element.id;
    console.log(Id);
    const idDisplay = nbr;
    if (categoryId === idDisplay) {
      Id.forEach((element) => {
        mee.classList.remove("hide");
      });
      console.log("la loupe");
    } else {
      mee.classList.add("hide");
    }
    if (idDisplay === 0) {
      mee.classList.remove("hide");
    }
  });
  return idImg;
}
async function filtre() {
  const execution = await initbtn();
  const btnDataId1 = document.querySelector('[data-id="1"]');
  const btnDataId2 = document.querySelector('[data-id="2"]');
  const btnDataId3 = document.querySelector('[data-id="3"]');
  const btntous = document.querySelector(".list-btn--style");
  btntous.addEventListener("click", () => {
    filtreur(0);
    console.log("prout");
  });
  btnDataId1.addEventListener("click", () => {
    filtreur(1);
  });
  btnDataId2.addEventListener("click", () => {
    filtreur(2);
  });
  btnDataId3.addEventListener("click", () => {
    filtreur(3);
  });
}

filtre();
//async function filtre(id) {
//const executions = await initbtn();
//const chercheur = await filtreur();
//const listeFilter = document.querySelectorAll(`[data-id='${id}']`);
//console.log(listeFilter);
//const btn = document.querySelector(".list-btn--style");
//const prout = chercheur.categoryId;
//console.log(prout);
//listeFilter.forEach((button) => {
//  button.addEventListener("click", async (i) => {
//    const dataId = document.querySelector(`[data-id='${i}']`);
//    console.log(dataId);
//
//    btn.classList.add("list-btn__selected");
//    console.log("ça clique ici");
//  });
//});
//}
//filtre();

//const portfolio = document.getElementById("portfolio");
//const gallery = document.querySelector(".gallery");
//const gallery_div = document.createElement("div");
//gallery_div.classList.add("gallery");
//portfolio.appendChild(gallery_div);
//const figure = document.createElement("figure");
//for (let i = 0; i < get_works.length; i++) {
//  const img = document.createElement("img");
//  img.src = get_works[i].imageUrl;
//  const figcaption = document.createElement("figcaption");
//  figcaption.innerHTML = get_works[i].title;
//  const figure = document.createElement("figure");
//  gallery_div.appendChild(figure);
//  figure.appendChild(img);
//  figure.appendChild(figcaption);
//}

export { getWorks };
