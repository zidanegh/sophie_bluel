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

function displayWorks(listeWork) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  listeWork.forEach((item) => {
    const nodeui = cardUi(item);
    gallery.innerHTML += nodeui;
  });
}

async function initPage() {
  const listeWorks = await getWorks();
  const gallery = document.querySelector(".gallery");
  displayWorks(listeWorks);
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
  displayWorks(workResult);
}

async function initFiltre(works) {
  await initbtn();
  const listeFilter = document.querySelectorAll(".list-btn--style");
  listeFilter.forEach((button) => {
    button.addEventListener("click", () => {
      //console.log(button);
      const dataId = button.dataset.id;
      //console.log(dataId);
      const attr = button.getAttribute("data-id");
      listeFilter.forEach((btn) => btn.classList.remove("list-btn__selected"));
      button.classList.add("list-btn__selected");
      filtreur(dataId, works);
    });
  });
}

export { getWorks };
