import { browser } from "$app/env";
import { writable } from "svelte/store";

const tables = () => ({
    todos: []
});

const setInitialItem = () => {
    if (browser) {
        return JSON.parse(localStorage.getItem('db')) || tables();
    } else {
        return tables();
    }
}

const stores = writable(setInitialItem());

stores.subscribe(value => {
    if (browser) {
        localStorage.setItem('db', JSON.stringify(value));
    }
})

export default stores;