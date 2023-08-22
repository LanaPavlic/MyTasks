window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const dateInput = document.querySelector("#new-date-input");
    const list_el = document.querySelector("#tasks");

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const task = input.value;
        const deadline = dateInput.value;

        const response = await fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `content=${encodeURIComponent(task)}&deadline=${encodeURIComponent(deadline)}`,
        });

        if (response.ok) {
            const taskData = await response.json();
            addTaskToDOM(taskData);
            input.value = '';
            dateInput.value = '';
        }
    });

    const addTaskToDOM = (taskData) => {
    const task_el = document.createElement('div');
    task_el.classList.add('task');
    task_el.setAttribute('data-id', taskData.id);

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = taskData.content;
    task_input_el.setAttribute('readonly', 'readonly');

    task_content_el.appendChild(task_input_el);

    const task_date_el = document.createElement('input');
    task_date_el.classList.add('deadline');
    task_date_el.type = 'date';
    task_date_el.value = taskData.deadline;
    task_date_el.setAttribute('readonly', 'readonly');

    task_content_el.appendChild(task_date_el);

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerText = 'Edit';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerText = 'Delete';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    list_el.appendChild(task_el);
};


    list_el.addEventListener('click', async (e) => {
        const target = e.target;
    if (target.classList.contains('completed-checkbox')) {
        const task_el = target.closest('.task');
        task_el.classList.toggle('completed');
        const taskId = task_el.dataset.id;
        const completed = task_el.classList.contains('completed');

        const response = await fetch(`/edit_task/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `completed=${completed}`,
        });

        if (!response.ok) {
            task_el.classList.toggle('completed');
        }
    }
        if (target.classList.contains('edit')) {
            const task_el = target.closest('.task');
            const task_input_el = task_el.querySelector('.text');
            const task_date_el = task_el.querySelector('.deadline');

            if (target.innerText.toLowerCase() === "edit") {
                target.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_date_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                const taskId = task_el.dataset.id;
                const newContent = task_input_el.value;
                const newDeadline = task_date_el.value;

                const response = await fetch(`/edit_task/${taskId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `content=${encodeURIComponent(newContent)}&deadline=${encodeURIComponent(newDeadline)}`,
                });

                if (response.ok) {
                    target.innerText = "Edit";
                    task_input_el.setAttribute("readonly", "readonly");
                    task_date_el.setAttribute("readonly", "readonly");
                }
            }
        } else if (target.classList.contains('delete')) {
            const task_el = target.closest('.task');
            const taskId = task_el.dataset.id;

            const response = await fetch(`/delete_task/${taskId}`, {
                method: 'POST',
            });

            if (response.ok) {
                task_el.remove();
            }
        }
    });
});
