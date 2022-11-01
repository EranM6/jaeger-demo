import {populateUser} from './userInfo.js'
import {initSearch} from './search.js'
import {newItem} from "./userForm.js";

initSearch(
    "userSearch",
    populateUser,
    ["firstName", "lastName", "ssoId", "userMail"],
    "user",
    {
        main: "חפש משתמש",
        alt: "חפש לפי מס' מינוי"
    },
    false
)

const addItemElm = document.getElementById("addItem")

if (addItemElm) {
    addItemElm.addEventListener("click", () => newItem())
}
