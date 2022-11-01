import {editItem} from "./universityForm.js";
import {getActiveItem} from "./search.js";

const posClass = "fa-check-circle"
const negClass = "fa-times-circle"

let isOpen = false;
let activeUniversity = null;
const wrapper = document.getElementById("universityInfo");
let editButt

if (wrapper) {
    editButt = wrapper.querySelector("#editButt");

    editButt.addEventListener("click", () => editItem(activeUniversity))
}

function reset() {
    isOpen = false

}

export function populateUniversity(university = null) {
    if (!university) university = getActiveItem()
    wrapper.hidden = !!university
    wrapper.classList.toggle("pf-c-card", !!university)
    activeUniversity = university
    const {
        name,
        displayName,
        description,
        ranges,
        contact,
        sites: {
            htz,
            tm,
            hdc
        },
        _id
    } = university
    reset()
    wrapper.querySelector("#userId").innerText = `ID: ${_id}`

    wrapper.querySelector("#name").innerText = name
    wrapper.querySelector("#displayName").innerText = displayName
    wrapper.querySelector("#description").innerText = description || "N/A"

    wrapper.querySelector("#contactName").innerText = contact.name || "N/A"
    wrapper.querySelector("#contactDescription").innerText = contact.description || "N/A"
    wrapper.querySelector("#contactMail").innerText = contact.email || "N/A"
    wrapper.querySelector("#contactPhone").innerText = contact.phone || "N/A"

    const htzElm = wrapper.querySelector("#isHtz")
    const tmElm = wrapper.querySelector("#isTm")
    const hdcElm = wrapper.querySelector("#isHdc")

    htzElm.classList.toggle(negClass, !htz)
    htzElm.classList.toggle(posClass, htz)
    htzElm.style.color = `var(--pf-global--${htz ? 'success': 'danger'}-color--100)`

    tmElm.classList.toggle(negClass, !tm)
    tmElm.classList.toggle(posClass, tm)
    tmElm.style.color = `var(--pf-global--${tm ? 'success': 'danger'}-color--100)`

    hdcElm.classList.toggle(negClass, !hdc)
    hdcElm.classList.toggle(posClass, hdc)
    hdcElm.style.color = `var(--pf-global--${hdc ? 'success': 'danger'}-color--100)`

    wrapper.querySelector("#ipRanges").innerText = ranges.join(", ")
}