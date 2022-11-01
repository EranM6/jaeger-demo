import {sendEntitlement} from "./api.js";
import {textValidation, intValidation} from "./utils.js"

const sendEntitlementWrapper = document.getElementById("sendEntitlement");
let sendEntitlementMail, sendEntitlementSubsNo, sendEntitlementButt;
const errorFields = new Set()
const validationIds = ["send-form-subs-no-input", "send-form-email-input"]
validationIds.forEach(errorFields.add, errorFields);

if (sendEntitlementWrapper) {
    sendEntitlementMail = sendEntitlementWrapper.querySelector("#send-form-email-input")
    sendEntitlementSubsNo = sendEntitlementWrapper.querySelector("#send-form-subs-no-input")
    sendEntitlementButt = sendEntitlementWrapper.querySelector("#sendEntitlementButt")

    sendEntitlementMail.addEventListener("keyup", ({target}) => textValidation(target, errorFields, toggleSubmit))
    sendEntitlementSubsNo.addEventListener("keyup", ({target}) => intValidation(target, errorFields, toggleSubmit))

    sendEntitlementButt.addEventListener("click", () => {
        const subsNo = sendEntitlementSubsNo.value;
        const userMail = sendEntitlementMail.value;
        sendEntitlement(subsNo, userMail).then(_ => null)
    })

}

function toggleSubmit() {
    sendEntitlementButt.disabled = errorFields.size
}