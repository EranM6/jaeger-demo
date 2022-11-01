import {populateUser} from './userInfo.js'
import {createItem, updateItem} from "./api.js";
import {textValidation, passwordValidation, resetPasswordHelpers, resetInputHelpers} from "./utils.js"

const validationIds = ["-form-first-name", "-form-email-input", "-form-password-input"];
const form = document.getElementById("userForm");
let isEdit = false;
let closeButt, submitButt, passResetButt

let firstNameElm, lastNameElm, passWrapper, passInputElm, mailWrapper, mailInputElm, termsWrapper
let passHelpers

if (form) {
    closeButt = form.querySelector("#closeFormModal")
    submitButt = form.querySelector("#updateUser")
    firstNameElm = form.querySelector("#-form-first-name")
    lastNameElm = form.querySelector("#-form-last-name")
    passWrapper = form.querySelector("#-form-password")
    passInputElm = passWrapper.querySelector("#-form-password-input")
    passHelpers = passInputElm.parentElement.nextElementSibling.querySelectorAll("li")
    passResetButt = passWrapper.querySelector("#-form-password-reset")
    mailWrapper = form.querySelector("#-form-email")
    mailInputElm = form.querySelector("#-form-email-input")

    termsWrapper = form.querySelector("#-form-terms")


    closeButt.addEventListener("click", closeForm)
    submitButt.addEventListener("click", submitUser)
    passResetButt.addEventListener("click", toggleResetPassword)
    passInputElm.nextElementSibling.addEventListener("click", togglePasswordVisibility, {capture: true})

    firstNameElm.addEventListener("keyup", ({target}) => textValidation(target, errorFields, toggleSubmit))
    mailInputElm.addEventListener("keyup", ({target}) => textValidation(target, errorFields, toggleSubmit))
    passInputElm.addEventListener("keyup", ({target}) => passwordValidation(target, errorFields, passHelpers, toggleSubmit))

}

let currentUser = {}
let resetPassword = false
let visiblePassword = false
const errorFields = new Set()

function closeForm() {
    form.hidden = true
    currentUser = {}
    errorFields.clear()
    cancelResetPassword()
    resetInputHelpers([firstNameElm, mailInputElm], errorFields)
    toggleSubmit()
    toggleFields(true)
}

function submitUser() {
    if (isEdit) {
        updateItem("user", {
            oldUserName: currentUser.userMail,
            userName: mailInputElm.value,
            firstName: firstNameElm.value,
            lastName: lastNameElm.value,
            site: "htz",
            ...(resetPassword ? {password: passInputElm.value} : {}),
        })
            .then(res => {
                populateUser(res)
                closeForm()
            });
    } else {
        createItem("user", {
            firstName: firstNameElm.value,
            lastName: lastNameElm.value,
            userName: mailInputElm.value,
            password: passInputElm.value,
            confirmPassword: passInputElm.value,
            site: termsWrapper.querySelector('input[name="-form-terms-radio"]:checked').value
        })
            .then(res => {
                populateUser(res)
                closeForm()
            });
    }
}

function cancelResetPassword() {
    resetPassword = false
    passWrapper.querySelector(".pf-c-form__group").hidden = true
    passResetButt.innerText = 'איפוס סיסמא'
    passInputElm.value = null
    hidePassword()
    resetPasswordHelpers(passHelpers)
}

function hidePassword() {
    visiblePassword = false
    const icon = passInputElm.nextElementSibling.querySelector("i")
    icon.classList.toggle('fa-eye-slash', visiblePassword)
    icon.classList.toggle('fa-eye', !visiblePassword)
    passInputElm.setAttribute("type", 'password')
}

function toggleResetPassword() {
    resetPassword = !resetPassword
    if (!resetPassword) {
        cancelResetPassword()
    } else {
        passWrapper.querySelector(".pf-c-form__group").hidden = !resetPassword
        passResetButt.innerText = resetPassword ? 'בטל איפוס' : 'איפוס סיסמא'
    }
}

function togglePasswordVisibility() {
    visiblePassword = !visiblePassword
    const icon = passInputElm.nextElementSibling.querySelector("i")
    icon.classList.toggle('fa-eye-slash', visiblePassword)
    icon.classList.toggle('fa-eye', !visiblePassword)
    passInputElm.setAttribute("type", visiblePassword ? 'text' : 'password')
}

function toggleSubmit() {
    submitButt.disabled = errorFields.size
}

function toggleFields(hide) {
    termsWrapper.hidden = hide
    passResetButt.hidden = !hide
    passResetButt.classList.toggle("pf-c-button", hide)
    passWrapper.querySelector(".pf-c-form__group").hidden = hide
}

function populateForm() {
    const {
        firstName,
        lastName,
        userMail,
    } = currentUser
    firstNameElm.value = firstName || ''
    lastNameElm.value = lastName || ''

    mailInputElm.value = userMail || ''
    termsWrapper.querySelectorAll('input[name="-form-terms-radio"]').forEach(radio => radio.checked = false)

    form.hidden = false
}

export function editItem(user) {
    isEdit = true
    currentUser = user;

    form.querySelector("#modal-title-").innerText = `עריכת משתמש מס': ${currentUser.id}`

    populateForm()
    toggleFields(true)
}

export function newItem() {
    isEdit = false
    validationIds.forEach(errorFields.add, errorFields);

    form.querySelector("#modal-title-").innerText = "הוספת משתמש חדש"
    passWrapper.querySelector(".pf-c-form__group").hidden = false
    passResetButt.hidden = true

    submitButt.disabled = true
    populateForm()
    toggleFields(false)
}