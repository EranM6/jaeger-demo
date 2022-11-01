const navElm = document.getElementById("vertical-sidebar");
const toggleButt = document.getElementById("vertical-nav-toggle");

let isOpen = false;

const toggleNav = () => {
    navElm.classList.toggle("pf-m-collapsed", isOpen);
    navElm.classList.toggle("pf-m-expanded", !isOpen);

    isOpen = !isOpen;
}

toggleButt.addEventListener("click", toggleNav)