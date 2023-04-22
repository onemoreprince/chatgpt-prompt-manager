window.displayNewPromptForm = displayNewPromptForm;
window.displayEditPromptForm = displayEditPromptForm;

// Function to display the "Add New Prompt" modal
function displayNewPromptForm() {
    const modal = document.createElement("div");
    modal.className = "modal";

    const form = document.createElement("form");
    form.className = "prompt-form";
    form.innerHTML = `
    <h3 class="form-title">Add new prompt</h3>
    <label for="title">A short title</label>
    <input type="text" id="title" name="title" required />
    <small>For your ease of view and search</small>
    <br />
    <label for="description">A short description</label>
    <input type="text" id="description" name="description" required />
    <small>To remind you what is does, you can make it little longer.</small>
    <br />
    <label for="text">Full prompt text with [VARIABLES]</label>
    <textarea id="text" name="text" rows="6" style="resize: vertical;" required></textarea>
    <small>Make sure variables are in all caps and surrounded by square brackets.</small>
    <br />
    <button type="submit" id="save-prompt">Save Prompt</button>
    <small>Prompts get stored on your local device.</small>
    `;

    modal.appendChild(form);
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = form.elements.title.value;
        const description = form.elements.description.value;
        const text = form.elements.text.value;

        const newPrompt = { title, description, text };

        window.prompts.push(newPrompt);
        updateGridAndStorage(null);
        updateGridAndStorage(newPrompt);

        window.displayAllPrompts();
        document.body.removeChild(modal);
    });
}

// Function to display the "Edit Prompt" modal
function displayEditPromptForm(promptToEdit) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const form = document.createElement("form");
    form.className = "prompt-form";
    form.innerHTML = `
    <h3 class="form-title">Edit this prompt</h3>
    <label for="title">A short title</label>
    <input type="text" id="title" name="title" required />
    <small>For your ease of view and search</small>
    <br />
    <label for="description">A short description</label>
    <input type="text" id="description" name="description" required />
    <small>To remind you what is does, you can make it little longer.</small>
    <br />
    <label for="text">Full prompt text with [VARIABLES]</label>
    <textarea id="text" name="text" rows="6" style="resize: vertical;" required></textarea>
    <small>Make sure variables are in all caps and surrounded by square brackets.</small>
    <br />
    <button type="submit" id="save-prompt">Save Prompt</button>
    <small>Prompts get stored on your local device.</small>
    <button type="button" id="delete-prompt">Delete this prompt</button>
    <small>Please export and save your prompts. This button deletes without warning.</small>  
    `;

    modal.appendChild(form);
document.body.appendChild(modal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        document.body.removeChild(modal);
    }
});

form.elements.title.value = promptToEdit.title;
form.elements.description.value = promptToEdit.description;
form.elements.text.value = promptToEdit.text;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = form.elements.title.value;
    const description = form.elements.description.value;
    const text = form.elements.text.value;

    const updatedPrompt = { title, description, text };

    promptToEdit.title = title;
    promptToEdit.description = description;
    promptToEdit.text = text;

    updateGridAndStorage(null);
    updateGridAndStorage(promptToEdit);

    window.displayAllPrompts();
    document.body.removeChild(modal);
});

const deleteButton = form.querySelector("#delete-prompt");
deleteButton.style.display = "block";
deleteButton.addEventListener("click", (event) => {
    event.preventDefault();

    const index = window.prompts.findIndex((prompt) => prompt === promptToEdit);
    if (index !== -1) {
        window.prompts.splice(index, 1);
        chrome.storage.local.set({ "prompts": window.prompts }, () => {
            console.log("Prompt deleted from Chrome storage");
        });
        document.body.removeChild(modal);
        window.displayAllPrompts();
    }
});
}


// function displayNewPromptForm(promptToEdit) {
//     const modal = document.createElement("div");
//     modal.className = "modal";

//     const form = document.createElement("form");
//     form.className = "new-prompt-form";
//     form.innerHTML = `
//     <label for="title">Prompt Title</label>
//     <input type="text" id="title" name="title" required />
//     <small>Enter a short title for the prompt.</small>
//     <br />
//     <label for="description">Enter a short description</label>
//     <input type="text" id="description" name="description" required />
//     <small>This shows in prompt grid and variable input box.</small>
//     <br />
//     <label for="text">Enter full prompt text with variables</label>
//     <textarea id="text" name="text" rows="6" style="resize: vertical;" required></textarea>
//     <small>Enter the prompt text with variables in all caps and surrounded by square brackets (e.g., [VARIABLE]).</small>
//     <br />
//     <button type="submit" id="save-prompt">Save Prompt</button>
//     <small>These prompt get stored to you local store in chrome.</small>
//     <button type="button" id="delete-prompt">Delete this prompt</button>
//     <small>Please export all your prompts. This button deletes without warkning</small>  
  
//     `;


//     modal.appendChild(form);
//     document.body.appendChild(modal);

//     modal.addEventListener("click", (event) => {
//         if (event.target === modal) {
//             document.body.removeChild(modal);
//         }
//     });
//     if (promptToEdit && promptToEdit.title) {
//         form.elements.title.value = promptToEdit.title;
//     }
//     if (promptToEdit && promptToEdit.description) {
//         form.elements.description.value = promptToEdit.description;
//     }
//     if (promptToEdit && promptToEdit.text) {
//         form.elements.text.value = promptToEdit.text;
//     }



//     form.addEventListener("submit", (event) => {

//         event.preventDefault();

//         const title = form.elements.title.value;
//         const description = form.elements.description.value;
//         const text = form.elements.text.value;

//         const newPrompt = { title, description, text };

//         if (promptToEdit) {
//             promptToEdit.title = title;
//             promptToEdit.description = description;
//             promptToEdit.text = text;
//             updateGridAndStorage(promptToEdit);
//         } else {
//             window.prompts.push(newPrompt);
//             updateGridAndStorage(null);
//         }
//         // Update the storage
//         updateGridAndStorage(promptToEdit || newPrompt);

//         window.displayAllPrompts();
//         document.body.removeChild(modal);

//     });

//     const deleteButton = form.querySelector("#delete-prompt");
//     if (promptToEdit) {
//         deleteButton.style.display = "block"; // Show the delete button only when editing an existing prompt
//         deleteButton.addEventListener("click", (event) => {
//             event.preventDefault(); // Prevent the form from being submitted
//             const index = window.prompts.findIndex((prompt) => prompt === promptToEdit);
//             if (index !== -1) {
//                 window.prompts.splice(index, 1);
//                 chrome.storage.local.set({ "prompts": window.prompts }, () => {
//                     console.log("Prompt deleted from Chrome storage");
//                 });
//                 document.body.removeChild(modal);
//                 window.displayAllPrompts();
//             }
//         });
//     } else {
//         deleteButton.style.display = "none"; // Hide the delete button when creating a new prompt
//     }
// }