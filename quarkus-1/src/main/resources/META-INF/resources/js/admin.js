import {initSearch} from './search.js'
import {populateUniversity} from "./universityInfo.js";
import {newItem} from "./universityForm.js";

initSearch(
    "universitySearch",
    populateUniversity,
    ["name", "displayName", "ranges"],
    "university",
    "חפש לפי שם או טווחי IPs"
)

const addItemElm = document.getElementById("addItem")

if (addItemElm) {
    addItemElm.addEventListener("click", () => newItem())
}

