

const response = await fetch("http://localhost:5678/api/works");
const get_works = await response.json();

const div_btn = document.querySelector(".list-btn");

creat_btn.classList.add("list-btn--style");
creat_btn.classList.add("list-btn__selected");
div_btn.appendChild(creat_btn);
creat_btn.innerHTML = "tous";

for (let i = 0; i < 3; i++) {
  let chemin_btn = get_works[i].category;
  let creat_btn = document.createElement("button");
  creat_btn.classList.add("list-btn--style");
  div_btn.appendChild(creat_btn);
  creat_btn.innerHTML = chemin_btn.name;
  creat_btn. = chemin_btn.name;
}
const class_btn = document.querySelectorAll(".list-btn--style");
const selected_btn = document.querySelector(".list-btn__selected");
const btn = document.querySelector("button");
console.log(class_btn);
class_btn.addEventListener("click", () => {
  btn.add("list-btn__selected");
  console.log(events);
});
