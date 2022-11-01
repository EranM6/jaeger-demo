import {openApiModal} from "./apiModal.js";

const createEndPoint = new Map([
    ["user", "createUser"],
    ["university", "createUniversity"],
])

const updateEndPoint = new Map([
    ["user", "updateUser"],
    ["university", "updateUniversity"],
])

const searchEndPoint = new Map([
    ["user", "searchUser"],
    ["university", "searchUniversity"],
])

const endPoints = new Map([
    ["search", searchEndPoint],
    ["update", updateEndPoint],
    ["create", createEndPoint],
])

function getEndpoint(action, type) {
    return `/api/${endPoints.get(action).get(type)}`
}

export function search(type, value, searchBy = null) {
    return getResults(() => fetch(`${getEndpoint("search", type)}?query=${encodeURIComponent(value)}&searchBy=${searchBy}`))
}

export function updateItem(type, item) {
    return getResults(() => fetch(getEndpoint("update", type), {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    }), true)
}

export function createItem(type, item) {
    return getResults(() => fetch(getEndpoint("create", type), {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    }), true)
}

export function resetAbuse(id, prodNum) {
    return getResults(() => fetch('/api/resetAbuse', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, prodNum})
    }))
}

export function sendEntitlement(subsNo, userMail) {
    return getResults(() => fetch('/api/sendEntitlement', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({subsNo, userMail})
    }), true)
}

export function checkEntitlement(subsNo) {
    return getResults(() => fetch(`/api/checkEntitlement?subsNo=${subsNo}`), true)
}

function getResults(fetchFn, openModal = false) {
    return new Promise((resolve, reject) => {
        fetchFn()
            .then(res => res.json())
            .then(({success, data, message, name, body, msg}) => {
                if (success) {
                    resolve(data);
                } else {
                    openModal = true
                }
                if (openModal) openApiModal(success, {
                    body,
                    title: name,
                    message: message || msg
                })
            })
            .catch(e => {
                reject(e);
            })
    })
}