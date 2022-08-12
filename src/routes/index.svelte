<script>
    import stores from '$lib/stores';
    import { fade } from 'svelte/transition';
    import { create, update } from '$lib/services/todos';
    let input;

    const onAdd = () => {
        if (input) {
            create({ value: input});
            input = '';
        }
    }

    const onCheck = (data) => {
        console.log(data);
        update(data)
    }
</script>

<div class="h-screen w-full flex flex-col px-4 py-8 bg-gray-800">
    <div class="form-control">
        <label for="todo" class="label">
            <span class="label-text">What to do?</span>
        </label>
        <input bind:value={input} type="text" id="todo" class="input mb-2" placeholder="Type here">
        <button class="btn btn-primary mb-2" on:click|preventDefault={onAdd}>Add</button>
        
        {#each [...$stores.todos].reverse() as todo (todo.id)}
            <label class="cursor-pointer label gap-2 w-full" transition:fade={{duration: 300}}>
                <input checked={todo.checked} type="checkbox" class="checkbox checkbox-primary" on:change={(e) => onCheck({id: todo.id, checked: e.target.checked})} />
                <span class="w-full {todo.checked ? 'line-through opacity-90' : ''}">{todo.value}</span>
            </label>
        {/each}
    </div>
</div>