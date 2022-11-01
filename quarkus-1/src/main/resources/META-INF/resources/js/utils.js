
export function textValidation(target, errorFields, toggleSubmit) {
    const helper = target.nextElementSibling
    if (!target.value || !target.value.trim()) {
        target.setAttribute("aria-invalid", true)
        helper.innerText = "שדה חובה"
        errorFields.add(target.getAttribute("id"))
    } else {
        resetInputHelpers([target], errorFields)
    }
    toggleSubmit()
}

export function intValidation(target, errorFields, toggleSubmit) {
    const helper = target.nextElementSibling
    if (!target.value || !target.value.trim()) {
        target.setAttribute("aria-invalid", true)
        helper.innerText = "שדה חובה"
        errorFields.add(target.getAttribute("id"))
    } else if (isNaN(target.value)) {
        target.setAttribute("aria-invalid", true)
        helper.innerText = "שדה חייב להיות מספר"
        errorFields.add(target.getAttribute("id"))
    } else {
        resetInputHelpers([target], errorFields)
    }
    toggleSubmit()
}

export function passwordValidation(target, errorFields, passHelpers, toggleSubmit) {
    if (!target.value || !target.value.length) {
        resetPasswordHelpers(passHelpers)
        errorFields.delete(target.getAttribute("id"))
    } else {
        const passRe = /^[A-Za-z\d]*$/;
        const failedLength = target.value.length < 6
        const failedRegex = !passRe.exec(target.value)
        toggleHelper(failedLength, passHelpers[0])
        toggleHelper(failedRegex, passHelpers[1])
        !failedLength && !failedRegex ? errorFields.delete(target.getAttribute("id")) : errorFields.add(target.getAttribute("id"))
    }
    toggleSubmit()
}

function toggleHelper(isFailed, element) {
    element.classList.remove("pf-m-indeterminate")
    element.classList.toggle("pf-m-error", isFailed)
    element.classList.toggle("pf-m-success", !isFailed)

    element.querySelector("i").classList.remove("fa-minus")
    element.querySelector("i").classList.toggle("fa-exclamation-circle", isFailed)
    element.querySelector("i").classList.toggle("fa-check-circle", !isFailed)
}

export function resetPasswordHelpers(passHelpers) {
    for (let helper of passHelpers) {
        helper.classList.add("pf-m-indeterminate")
        helper.classList.remove("pf-m-error")
        helper.classList.remove("pf-m-success")

        helper.querySelector("i").classList.add("fa-minus")
        helper.querySelector("i").classList.remove("fa-exclamation-circle")
        helper.querySelector("i").classList.remove("fa-check-circle")
    }
}

export function resetInputHelpers(targets, errorFields) {
    for (let target of targets) {
        target.removeAttribute("aria-invalid")

        target.nextElementSibling.innerText = null

        errorFields.delete(target.getAttribute("id"))
    }
}
