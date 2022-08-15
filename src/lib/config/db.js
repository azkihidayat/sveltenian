import { browser } from "$app/env";
import localforage from "localforage";

const DB_NAME = 'todo_db';

const db = localforage.createInstance({
    name: 'todos_db'
});

export { db };