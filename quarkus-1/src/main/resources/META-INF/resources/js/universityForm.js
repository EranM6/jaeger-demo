import {populateUniversity} from './universityInfo.js'
import {createItem, updateItem} from "./api.js";
import {textValidation, intValidation, resetInputHelpers} from "./utils.js"

const validationIds = ["-form-id", "-form-name", "-form-display-name"];
const form = document.getElementById("universityForm");
let isEdit = false;
let submitButt

let nameElm, displayNameElm, descriptionElm

let idElm, contactNameElm, contactMailElm, contactPhoneElm, contactDescriptionElm, rangesElm, addRangeButt, rangesListElm

let checkHtz, checkTm, checkHdc

if (form) {
    submitButt = form.querySelector("#updateUniversity")

    idElm = form.querySelector("#-form-id")
    nameElm = form.querySelector("#-form-name")
    displayNameElm = form.querySelector("#-form-display-name")
    descriptionElm = form.querySelector("#-form-description")

    contactNameElm = form.querySelector("#-form-contact-name")
    contactMailElm = form.querySelector("#-form-contact-email")
    contactPhoneElm = form.querySelector("#-form-contact-phone")
    contactDescriptionElm = form.querySelector("#-form-contact-description")

    checkHtz = form.querySelector("#-form-htz-checkbox")
    checkTm = form.querySelector("#-form-tm-checkbox")
    checkHdc = form.querySelector("#-form-hdc-checkbox")

    rangesElm = form.querySelector("#-form-ranges-wrapper")
    rangesListElm = rangesElm.querySelector("#-form-ranges-list")
    addRangeButt = rangesElm.querySelector("#addRangeField")
    addRangeButt.addEventListener("click", addRangeField)

    form.querySelector("#closeFormModal").addEventListener("click", closeForm)
    submitButt.addEventListener("click", submitUser)

    idElm.addEventListener("keyup", ({target}) => intValidation(target, errorFields, toggleSubmit))
    nameElm.addEventListener("keyup", ({target}) => textValidation(target, errorFields, toggleSubmit))
    displayNameElm.addEventListener("keyup", ({target}) => textValidation(target, errorFields, toggleSubmit))
}

let currentUniversity = {}
const errorFields = new Set()

function closeForm() {
    form.hidden = true
    currentUniversity = {}
    errorFields.clear()
    resetInputHelpers([nameElm, displayNameElm], errorFields)
    rangesListElm.innerHTML = ''
    toggleSubmit()
}

function submitUser() {
    const newItem = {
        _id: idElm.value,
        name: nameElm.value,
        displayName: displayNameElm.value,
        description: descriptionElm.value,
        ranges: Array.from(rangesListElm.childNodes).reduce((output, item) => {
            const value = item.querySelector("input").value.trim()
            if (value && value.length > 0) output.push(value)
            return output
        }, []),
        contact: {
            name: contactNameElm.value,
            email: contactMailElm.value,
            phone: contactPhoneElm.value,
            description: contactDescriptionElm.value,
        },
        sites: {
            htz: checkHtz.checked,
            tm: checkTm.checked,
            hdc: checkHdc.checked
        },
    }

    const fn = isEdit ? updateItem : createItem

    fn("university", newItem)
        .then(res => {
            populateUniversity(res);
            closeForm()
        });
}

function toggleSubmit() {
    submitButt.disabled = errorFields.size
}

function addRangeField(range) {
    const item = document.createElement("div")
    item.innerHTML = `
        <div class="pf-c-input-group">
            <input
                    class="pf-c-form-control"
                    type="text"
                    value="${typeof range === 'string' ? range : ''}"
                    ${addRangeButt.disabled ? "disabled" : null}
            />
            <button
                class="pf-c-button pf-m-plain"
                type="button"
                aria-label="Remove"
                ${addRangeButt.disabled ? "disabled" : null}
            >
                <i class="fas fa-minus-circle" aria-hidden="true"></i>
            </button>
        </div>
    `
    item.querySelector("button").addEventListener("click", () => item.remove())
    rangesListElm.append(item)
}

function populateForm() {
    const {
        _id,
        name,
        displayName,
        description,
        ranges = [],
        contact = {},
        sites = {},
    } = currentUniversity

    idElm.value = _id || null
    nameElm.value = name || null
    displayNameElm.value = displayName || null
    descriptionElm.value = description || null

    contactNameElm.value = contact.name || null
    contactMailElm.value = contact.email || null
    contactPhoneElm.value = contact.phone || null
    contactDescriptionElm.value = contact.description || null

    checkHtz.checked = sites.htz
    checkTm.checked = sites.tm
    checkHdc.checked = sites.hdc

    ranges.forEach(range => addRangeField(range))

    idElm.disabled = isEdit
    form.hidden = false
}

export function editItem(university) {
    isEdit = true
    currentUniversity = university

    form.querySelector("#modal-title-").innerText = `עריכת ארגון מס': ${currentUniversity._id}`
    populateForm()
}

export function newItem() {
    isEdit = false
    validationIds.forEach(errorFields.add, errorFields);
    form.querySelector("#modal-title-").innerText = "הוספת ארגון חדש"

    submitButt.disabled = true
    populateForm()
}