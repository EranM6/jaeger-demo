const modalElm = document.getElementById("apiModal");
const closeButt = modalElm.querySelector("#closeErrorModal")
const titleElm = modalElm.querySelector("#danger-alert-title")
const bodyElm = modalElm.querySelector(".pf-c-modal-box__body")
const detailsElm = modalElm.querySelector("#errorDetails")
const detailsButt = detailsElm.querySelector("button")
const detailsContent = detailsElm.querySelector("#errorDetailsContent")

let displayDetails = false

function closeErrorModal() {
    hideDetails()
    modalElm.hidden = true
}

function toggleDetails() {
    displayDetails = !displayDetails
    detailsButt.classList.toggle('pf-m-expanded', displayDetails)
    detailsContent.classList.toggle("pf-m-expanded", displayDetails)
    detailsContent.hidden = !displayDetails
}

function hideDetails() {
    detailsContent.hidden = true
    displayDetails = false
}

closeButt.addEventListener("click", closeErrorModal)
detailsButt.addEventListener("click", toggleDetails)

export function openApiModal(success, {title, body, message}) {
    titleElm.querySelector(".pf-c-modal-box__title-text").innerText = title
    titleElm.querySelector(".pf-c-modal-box__title-icon").style.color = `var(--pf-global--${success ? "success" : "danger"}-color--100)`
    titleElm.querySelector("i").classList.toggle("fa-exclamation-circle", !success)
    titleElm.querySelector("i").classList.toggle("fa-check-circle", success)

    bodyElm.innerText = body
    detailsElm.hidden = !message
    detailsContent.querySelector(".pf-c-alert__title").innerText = title
    detailsContent.querySelector(".pf-c-alert__description > p").innerText = message
    modalElm.hidden = false
}