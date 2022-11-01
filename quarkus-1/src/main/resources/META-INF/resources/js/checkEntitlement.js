import {checkEntitlement} from "./api.js";
import {intValidation} from "./utils.js"

const checkEntitlementWrapper = document.getElementById("checkEntitlement");
let checkEntitlementSubsNo, checkEntitlementButt;
const errorFields = new Set()
const validationIds = ["check-form-subs-no-input",]
validationIds.forEach(errorFields.add, errorFields);

if (checkEntitlementWrapper) {
    checkEntitlementSubsNo = checkEntitlementWrapper.querySelector("#check-form-subs-no-input")
    checkEntitlementButt = checkEntitlementWrapper.querySelector("#checkEntitlementButt")

    checkEntitlementSubsNo.addEventListener("keyup", ({target}) => intValidation(target, errorFields, toggleSubmit))

    checkEntitlementButt.addEventListener("click", () => {
        const subsNo = checkEntitlementSubsNo.value;
        checkEntitlement(subsNo).then(_ => null)
    })

}

function toggleSubmit() {
    checkEntitlementButt.disabled = errorFields.size
}