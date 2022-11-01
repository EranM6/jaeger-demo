import {editItem} from "./userForm.js";
import {resetAbuse} from "./api.js";
import {getActiveItem} from "./search.js";

const posClass = "fa-check-circle"
const negClass = "fa-times-circle"

let isOpen = false;
let activeUser = null;
const wrapper = document.getElementById("userInfo");
let editUserButt
let prodElm
let content
let productsButt

if (wrapper) {
    editUserButt = wrapper.querySelector("#editUserButt");
    prodElm = wrapper.querySelector("#user-products")
    content = wrapper.querySelector("#user-products-content")
    productsButt = prodElm.querySelector("button")

    productsButt.addEventListener("click", onClick)
    editUserButt.addEventListener("click", () => editItem(activeUser))
}

function toggleContent() {
    content.hidden = !isOpen
    content.classList.toggle('pf-m-expanded', isOpen)
    productsButt.classList.toggle('pf-m-expanded', isOpen)
}

function onClick() {
    isOpen = !isOpen
    toggleContent()
}

function reset() {
    isOpen = false
    toggleContent()
    content.innerHTML = ""
}

export function populateUser(user = null) {
    if (!user) user = getActiveItem()

    wrapper.hidden = !!user
    wrapper.classList.toggle("pf-l-grid", !!user)
    activeUser = user
    const {
        id,
        firstName,
        lastName,
        userMail,
        mobilePhone,
        registerDate,
        updateDate,
        isPhoneEmailConn,
        registerOrigin,
        subsNo,
        isPaying,
        isAbuser,
        mailValidationDate,
        mobileValidationDate,
        products,
        specialOffers
    } = user
    reset()
    wrapper.querySelector("#userStatus").innerText = `משתמש מס' (ssoId): ${id}`

    wrapper.querySelector("#firstName").innerText = firstName
    wrapper.querySelector("#lastName").innerText = lastName || "N/A"
    wrapper.querySelector("#userMail").innerText = userMail
    wrapper.querySelector("#registerDate").innerText = registerDate ? new Date(registerDate).toLocaleDateString() : null
    wrapper.querySelector("#updateDate").innerText = updateDate ? new Date(updateDate).toLocaleDateString() : null
    wrapper.querySelector("#registerOrigin").innerText = registerOrigin || "N/A"

    const mailValidationElm = wrapper.querySelector("#mailValidationDate")
    mailValidationElm.classList.toggle(negClass, !mailValidationDate)
    mailValidationElm.classList.toggle(posClass, !!mailValidationDate)
    mailValidationElm.style.color = `var(--pf-global--${mailValidationDate ? 'success': 'danger'}-color--100)`

    const phoneEmailConnElm = wrapper.querySelector("#isPhoneEmailConn")
    phoneEmailConnElm.classList.toggle(negClass, !isPhoneEmailConn)
    phoneEmailConnElm.classList.toggle(posClass, isPhoneEmailConn)
    phoneEmailConnElm.style.color = `var(--pf-global--${isPhoneEmailConn ? 'success': 'danger'}-color--100)`

    if (mobilePhone && Object.entries(mobilePhone)) {
        const phoneValidationElm = wrapper.querySelector("#mobileValidationDate")
        phoneValidationElm.classList.toggle(negClass, !mobileValidationDate)
        phoneValidationElm.classList.toggle(posClass, !!mobileValidationDate)
        phoneValidationElm.style.color = `var(--pf-global--${mobileValidationDate ? 'success': 'danger'}-color--100)`

        const {phonePrefix, phoneSuffix, userMobile} = mobilePhone
        if (userMobile) {
            wrapper.querySelector("#phone").innerText = userMobile
        } else if (phonePrefix && phoneSuffix) {
            wrapper.querySelector("#phone").innerText = `${phonePrefix}${phoneSuffix}`
        } else {
            phoneValidationElm.classList.remove(posClass, negClass)
            wrapper.querySelector("#phone").innerText = "N/A"
        }
    }

    wrapper.querySelector("#subsNo").innerText = subsNo || "N/A"
    const payingElm = wrapper.querySelector("#isPaying")
    const abuserElm = wrapper.querySelector("#isAbuser")
    const advisorElm = wrapper.querySelector("#isAdvisor")

    payingElm.classList.toggle(negClass, !isPaying)
    payingElm.classList.toggle(posClass, isPaying)
    payingElm.style.color = `var(--pf-global--${isPaying ? 'success': 'danger'}-color--100)`

    abuserElm.classList.toggle(negClass, !isAbuser)
    abuserElm.classList.toggle(posClass, isAbuser)
    abuserElm.style.color = `var(--pf-global--${!isAbuser ? 'success': 'danger'}-color--100)`

    const isAdvisor = specialOffers && specialOffers.length > 0

    advisorElm.classList.toggle(negClass, !isAdvisor)
    advisorElm.classList.toggle(posClass, isAdvisor)
    advisorElm.style.color = `var(--pf-global--${isAdvisor ? 'success': 'danger'}-color--100)`

    if (products && products.length) {
        const body = document.createElement("div");
        body.className = "pf-c-accordion__expanded-content-body"

        for (const [index, product] of products.entries()) {
            const {
                debtAmount,
                endDate,
                isTrial,
                prodNum,
                saleCode,
                promotionNum,
                startDate,
                status,
                statusInt,
                abuse
            } = product

            const card = document.createElement("div");
            card.className = "pf-c-card"

            const cardHeader = document.createElement("div");
            cardHeader.className = "pf-c-card__header pf-l-flex pf-m-justify-content-space-between"
            cardHeader.innerHTML = `<h2 id="userStatus" class="pf-c-title pf-m-lg">מס' מוצר: ${prodNum}</h2>`

            if (abuse && abuse.length) {
                const headerButt = document.createElement("button");
                headerButt.className = "pf-c-button pf-m-primary pf-m-small pf-l-flex__item"
                headerButt.innerText = `נקה מכשירים (${abuse.length})`
                headerButt.addEventListener("click", () =>
                    resetAbuse(_id, prodNum)
                        .then(res => {
                            populateUser(res)
                        })
                )
                cardHeader.appendChild(headerButt)
            }

            const cardBody = document.createElement("div");
            cardBody.className = "pf-c-card__body"

            const fields = document.createElement("div");
            fields.className = "pf-l-grid pf-m-all-6-col-on-sm pf-m-all-3-col-on-lg pf-m-gutter"

            fields.appendChild(createItem("סטטוס", status))
            fields.appendChild(createItem("קוד סטטוס", statusInt))
            fields.appendChild(createItem("מסלול", saleCode))
            fields.appendChild(createItem("מבצע", promotionNum))
            fields.appendChild(createItem("תאריך התחלה", startDate ? new Date(startDate).toLocaleDateString() : null))
            fields.appendChild(createItem("תאריך סיום", endDate ? new Date(endDate).toLocaleDateString() : null))
            fields.appendChild(createItem("חוב", debtAmount))
            fields.appendChild(createItem("נסיון", isTrial, true, false))

            cardBody.appendChild(fields);

            card.appendChild(cardHeader)
            card.appendChild(cardBody)

            body.appendChild(card)

            if (index + 1 < products.length) {
                const hr = document.createElement("hr")
                hr.classList.add("pf-c-divider")
                body.appendChild(hr)
            }
        }

        content.appendChild(body)

        prodElm.classList.add("pf-c-card")
        prodElm.hidden = false
    } else {
        prodElm.hidden = true
        prodElm.classList.remove("pf-c-card")
    }
}

function createItem(field, value, isBool = false, isPos = true) {
    const wrapper = document.createElement("div");
    wrapper.className = "pf-l-grid__item"
    const items = document.createElement("div");
    items.className = "pf-l-flex pf-m-space-items-sm"

    if (isBool) {
        const style = `--pf-global--${(isPos && value) || (!isPos && !value) ? 'success': 'danger'}-color--100`
        items.innerHTML = `
            <div class="pf-l-flex__item">
                <i class="fas ${value ? posClass : negClass}" aria-hidden="true" style="color: var(${style});"></i>
                <span>${field}</span>
            </div>
        `
    } else {
        items.innerHTML = `
            <div class="pf-l-flex__item">
                <span>${field}:</span>
                <span>${value || 'N/A'}</span>
            </div>
        `
    }
    wrapper.appendChild(items)

    return wrapper
}