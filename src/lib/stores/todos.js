import { browser } from "$app/env";
import { writable } from "svelte/store";
import { db } from '$lib/config/db';

const TABLE_NAME = 'todos';

const stores = writable([], () => {
    if (browser) {
        db.getItem(TABLE_NAME).then(data => {
            if (data) stores.set(data);
        })
    }
});

stores.subscribe(value => {
    if (browser) {
        db.setItem(TABLE_NAME, value);
    }
});

export default stores;