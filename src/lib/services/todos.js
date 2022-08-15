import stores from '$lib/stores/todos';

const generateId = (table) => (table[0] ? table[table.length-1].id + 1 : 0);

export const create = (data) => {
    stores.update(store => {
        const id = generateId(store);
        const now = Date.now();
        data = {
            ...data,
            id,
            created_at: now
        };
        return [...store, data];
    });
}

export const update = (data) => {
    stores.update(store => {
        let todos = [...store];
        const i = todos.findIndex(todo => todo.id === data.id);
        if (i >= 0) {
            data = {
                ...todos[i],
                ...data,
                updated_at: Date.now()
            };
            todos[i] = data;
        }
        return [...todos];
    })
}

export const remove = (id) => {
    stores.update(store => {
        return [...store.todos.filter(todo => todo.id !== id)];
    });
}

