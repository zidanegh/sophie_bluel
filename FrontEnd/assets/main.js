const response = await fetch("http://localhost:5678/api/works");
const get_works = await response.json();

const portfolio = document.getElementById("portfolio");
const gallery = document.querySelector(".gallery");
const gallery_div = document.createElement("div");
gallery_div.classList.add("gallery");
portfolio.appendChild(gallery_div);
const figure = document.createElement("figure");
for (let i = 0; i < get_works.length; i++) {
  const img = document.createElement("img");
  img.src = get_works[i].imageUrl;
  const figcaption = document.createElement("figcaption");
  figcaption.innerHTML = get_works[i].title;
  const figure = document.createElement("figure");
  gallery_div.appendChild(figure);
  figure.appendChild(img);
  figure.appendChild(figcaption);
}
