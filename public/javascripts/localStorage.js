const writeToLocalStorage = (key, value) => {
    window.localStorage.setItem(key, value);
}

const readFromLocalStorage = (key) => {
    return window.localStorage.getItem(key);
}