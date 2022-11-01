import {search} from "./api.js";

let activeItem = null

export function initSearch(id, populateItem, resultsFields, searchType, placeholder, dynamic = true) {
    let value;
    let isAutocompleteOpen = false;
    let searchResults = [];

    const wrapper = document.getElementById(id);
    const searchInputRef = wrapper.querySelector("#search-input");
    const clearRef = wrapper.querySelector("#search-clear");
    const submitRef = wrapper.querySelector("#search-submit");
    const resultsElm = wrapper.querySelector("#search-results");
    const resultsListElm = resultsElm.querySelector("ul");
    const fieldSelectWrapper = wrapper.querySelector("#search-field")

    if (fieldSelectWrapper) {
        fieldSelectWrapper.querySelectorAll('input[name="search-field-radio"]').forEach(elm => {
            elm.addEventListener("change", () => {
                searchInputRef.focus()
            })
        })
    }

    const setPlaceholder = () => {
        if (typeof placeholder === "object") {
            searchInputRef.setAttribute("placeholder",placeholder.main)
        } else {
            searchInputRef.setAttribute("placeholder", placeholder)
        }
    }

    const getHighlightedText = input => {
        const patterns = new Set();
        value.split(new RegExp('(\\s|\\.)', 'gi')).forEach(sub => patterns.add(sub.toLowerCase()))
        patterns.delete('.')
        patterns.delete(' ')
        patterns.add(value.toLowerCase())
        const text = Array.isArray(input) ? input.join(" ") : input
        const parts = text.split(new RegExp(`(${Array.from(patterns).join('|')})`, 'gi'));
        const res = document.createElement("span")

        parts.forEach(part => {
            const str = document.createElement("span");
            if (patterns.has(part.toLowerCase())) {
                str.style.fontWeight = "bold";
            }

            str.innerText = part;

            res.appendChild(str);
        });

        res.className = `pf-l-grid__item pf-m-${12 / resultsFields.length}-col`
        return res;
    };

    const closeResults = () => {
        resultsElm.hidden = true;
        resultsListElm.textContent = '';
        isAutocompleteOpen = false;
    }

    const openResults = () => {
        resultsListElm.textContent = '';

        searchResults.forEach(item => {
            const listItem = document.createElement("li")
            listItem.className = "pf-c-search-input__menu-list-item"

            const butt = document.createElement("button")
            butt.className = "pf-c-search-input__menu-item"
            butt.setAttribute("type", "button")
            butt.style.textAlign = "start"

            const content = document.createElement("div")
            content.className = "pf-c-search-input__menu-item-text pf-l-grid"

            resultsFields.forEach(field => {
                content.appendChild(getHighlightedText(item[field] || ''));
            })

            butt.appendChild(content);

            butt.addEventListener("click", e => {
                e.stopPropagation();
                activeItem = item
                showResults()
            })

            listItem.appendChild(butt);

            resultsListElm.appendChild(listItem);
        })

        resultsElm.hidden = false;

        isAutocompleteOpen = true
    }

    const onClear = () => {
        value = '';
        searchInputRef.value = value;
        closeResults()
    };

    const onChange = event => {
        value = event.target.value;
        if (value !== '' && searchInputRef && searchInputRef.contains(document.activeElement)) {
            search(searchType, value)
                .then(items => {
                    searchResults = items
                    if (searchResults && searchResults.length) openResults()
                });
        } else {
            closeResults()
        }
    };

    const submitQuery = searchBy => {
        value = searchInputRef.value;
        if (!searchBy) searchBy = fieldSelectWrapper.querySelector('input[name="search-field-radio"]:checked').value;
        search(searchType, value, searchBy)
            .then(([item]) => {
                searchResults = item
                if (searchResults) {
                    activeItem = item
                    showResults()
                }
            });
    }

    const showResults = () => {
        closeResults();
        submitRef.disabled = true
        searchInputRef.value = ''
        searchInputRef.focus();
        populateItem()
    }

    const handleClickOutside = event => {
        if (isAutocompleteOpen && !wrapper.contains(event.target)) {
            closeResults()
        }
    };

    const handleEnterKey = event => {
        if (event.key === 'Enter' && !submitRef.disabled) {
            submitQuery()
        }
    };

    window.addEventListener('click', handleClickOutside);
    submitRef.disabled = true
    submitRef.classList.toggle("pf-c-button", !dynamic)

    if (dynamic) {
        searchInputRef.addEventListener("input", onChange);
        submitRef.hidden = true;
    } else {
        searchInputRef.addEventListener("input", event => {
            submitRef.disabled = value = !event.target.value || event.target.value.trim().length < 1;
        });
        searchInputRef.addEventListener("focus", () => {
            window.addEventListener('keypress', handleEnterKey);
        });
        searchInputRef.addEventListener("blur", () => {
            window.removeEventListener('keypress', handleEnterKey);
        });
        submitRef.addEventListener("click", submitQuery)
    }

    clearRef.addEventListener("click", onClear);
    setPlaceholder()

    return query => {
        searchInputRef.value = query;
        submitQuery("_id")
    }
}

export function getActiveItem() {
    return activeItem;
}