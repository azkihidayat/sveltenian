import stores from '$lib/stores';

const generateId = (table) => (table[0] ? table[table.length-1].id + 1 : 0);

export const create = (data) => {
    stores.update(store => {
        const id = generateId(store.todos);
        const now = Date.now();
        return {
            ...store,
            todos: [...store.todos, { id, ...data, created_at: now, updated_at: now}]
        }
    });
}

export const update = (data) => {
    stores.update(store => {
        let todos = [...store.todos];
        const i = todos.findIndex(todo => todo.id === data.id);
        if (i >= 0) {
            data = {
                ...todos[i],
                ...data,
                updated_at: Date.now()
            };
            todos[i] = data;
        }
        return {
            ...store,
            todos: [...todos]
        }
    })
}

export const remove = (id) => {
    stores.update(store => {
        return {
            ...store,
            todos: store.todos.filter(todo => todo.id !== id)
        }
    });
}

