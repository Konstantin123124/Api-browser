const btn = document.querySelector(".btn-size");
btn.addEventListener("click", () => {
    const weight = window.innerWidth
    const height = window.innerHeight
    alert(`Ширина экрана : ${weight}, Высота экрана: ${height}`);
})