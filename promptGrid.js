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

        let container = document.querySelector('div[data-container="inputFields"]');
        if (!container) {
            container = document.createElement("div");
            container.setAttribute("data-container", "inputFields");
            container.style.margin = "10px";
        } else {
            container.innerHTML = "";
        }

        const titleElement = document.createElement("h6");
        titleElement.textContent = promptItem.title;
        titleElement.style.fontWeight = "bold";
        container.appendChild(titleElement);

        inputLabels.forEach((label) => {
            const labelElement = document.createElement("label");
            labelElement.textContent = `Enter ${label}`;
            container.appendChild(labelElement);

            const inputElement = document.createElement("textarea");
            inputElement.setAttribute("data-input", label);
            inputElement.style.width = "100%";
            inputElement.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    submitInputs();
                }
            });
            container.appendChild(inputElement);
        });

        const rootTextarea = document.querySelector('textarea[data-id="root"]');
        rootTextarea.parentNode.insertBefore(container, rootTextarea);



        function submitInputs() {
            let allInputsCompleted = true;
            inputLabels.forEach((label) => {
                const input = document.querySelector(`textarea[data-input="${label}"]`).value;
                if (input !== "") {
                    inputValues[label] = input;
                } else {
                    allInputsCompleted = false;
                }
            });

            if (allInputsCompleted) {
                let newText = promptItem.text;
                for (const label of inputLabels) {
                    const variable = `[${label}]`;
                    newText = newText.split(variable).join(inputValues[label]);
                }
                rootTextarea.value = newText;
                container.remove();

                // Focus on rootTextarea and trigger the "Enter" key event
                rootTextarea.focus();
                const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
                rootTextarea.dispatchEvent(enterEvent);
            } else {
                alert("Please fill all fields");
            }
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
