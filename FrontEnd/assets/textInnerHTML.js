export function projetValideUi() {
  return `
<div class="projet-valide" ><p class="valide">Votre projet à bien était rajouter</p></div>
`;
}

export function formOptionUI(work) {
  return `
<option value="${work.id}">${work.name}</option>`;
}

export function modifie() {
  return `
  <button class="btnModifier">
<i class="fa-regular fa-pen-to-square"></i><p>modifier</p>
</button>               `;
}

export function modeEdition() {
  return `
<i class="fa-regular fa-pen-to-square"></i><p>Mode edition</p>
`;
}

export function category(categorie) {
  return `
<button data-id="${categorie.id}" class="list-btn--style">${categorie.name}</button>
`;
}

export function imageModal(work) {
  return `
<figure>
<img src="${work.imageUrl}" alt="${work.title}"/>
<i class="fa-solid fa-trash-can"></i>
</figure>
`;
}

export function cardUi(work) {
  return `
<figure id="${work.id}">
<img src="${work.imageUrl}" alt="${work.title}"/>
<figcaption >${work.title}</figcaption>
</figure>
`;
}
