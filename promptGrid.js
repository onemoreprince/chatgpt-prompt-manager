window.updateGridAndStorage = updateGridAndStorage;
window.displayAllPrompts = displayAllPrompts;
window.addPromptToGrid = addPromptToGrid;


function updateGridAndStorage(promptToEdit) {

    if (promptToEdit) {
        chrome.storage.local.set({ "prompts": window.prompts }, () => {
            console.log("Prompt updated in Chrome storage");
            displayAllPrompts();
        });
    } else {
        chrome.storage.local.set({ "prompts": window.prompts }, () => {
            console.log("Prompt saved to Chrome storage");
            displayAllPrompts();
        });
    }
}



function displayLimitedPrompts(limit) {
    const promptGrid = document.querySelector(".prompt-grid");

    for (let i = 0; i < limit && i < window.prompts.length; i++) {
        addPromptToGrid(window.prompts[i]);
    }
}

function displayAllPrompts() {
    const promptGrid = document.querySelector(".prompt-grid");
    promptGrid.innerHTML = "";

    window.prompts.forEach((promptItem) => {
        addPromptToGrid(promptItem);
    });
}

function addPromptToGrid(promptItem) {
    const promptGrid = document.querySelector(".prompt-grid");
    const promptElement = document.createElement("div");
    promptElement.className = "prompt";
    promptElement.innerHTML = `
      <h2>${promptItem.title}</h2>
      <p>${promptItem.description}</p>
    `;

    promptElement.addEventListener("click", () => {
        const variableRegex = /\[([A-Z]+)\]/g;
        const variables = [...new Set(promptItem.text.match(variableRegex))];
        const inputLabels = variables.map((variable) => variable.slice(1, -1));
        const inputValues = {};

        let allInputsCompleted = true;
        inputLabels.forEach((label) => {
            const input = prompt(`Enter a value for ${label}:`);
            if (input !== null) {
                inputValues[label] = input;
            } else {
                allInputsCompleted = false;
            }
        });

        if (allInputsCompleted) {
            const textarea = document.querySelector('textarea[data-id="root"]');
            let newText = promptItem.text;
            for (const label of inputLabels) {
                const variable = `[${label}]`;
                newText = newText.split(variable).join(inputValues[label]);
            }
            textarea.value = newText;
        }
    });
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the click event on the promptElement
        window.displayEditPromptForm(promptItem);
    });

    promptElement.appendChild(editButton);

    promptGrid.appendChild(promptElement);
}


