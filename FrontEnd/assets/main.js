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

async function filtre() {
  const execution = await initbtn();
  const listeFilter = document.querySelectorAll(".list-btn--style");
  const btn = document.querySelector(".list-btn--style");
  listeFilter.forEach((button) => {
    button.addEventListener("click", () => {
      if (btn === document.querySelector(".list-btn__selected")) {
        btn.classList.remove("list-btn__selected");
      } else {
        btn.classList.add("list-btn__selected");
      }

      console.log("ça clique ici");
      console.log(btn);
    });
  });
}
filtre();

async function filtreur() {
  const execution = await getcategories();
  const id = Array.from(execution);
  for (let i = 0; i < id.length; i++) {
    let attrDataId = i.getAttribute("data-id");
  }
  console.log(attrDataId);
}

filtreur();

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
