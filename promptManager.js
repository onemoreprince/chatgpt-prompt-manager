window.initializePromptManager = initializePromptManager;
window.displayPrompts = displayPrompts;
window.handleSearch = handleSearch;



function initializePromptManager() {
    const targetElement = document.querySelector('h1.text-4xl');
    if (targetElement && !document.querySelector('.prompt-manager')) {
        targetElement.outerHTML = `
        <div class="prompt-manager">
          <div class="prompt-grid">
            <!-- The prompt templates will be displayed here -->
          </div>
        </div>
      `;
        displayPrompts();
    }
}


function displayPrompts() {
    const promptManager = document.querySelector(".prompt-manager");
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search prompts...");
    searchInput.className = "search-input";
    searchInput.addEventListener("input", window.handleSearch);

    const newPromptButton = document.createElement("button");
    newPromptButton.textContent = "Add New Prompt Template";
    newPromptButton.className = "new-prompt-button";
    newPromptButton.addEventListener("click", window.displayNewPromptForm);
    const importButton = document.createElement("button");
    importButton.textContent = "Import Prompts";
    importButton.className = "import-prompts-button button-left";
    importButton.addEventListener("click", window.importPrompts);
    promptManager.insertBefore(importButton, promptManager.firstChild.nextSibling);

    const exportButton = document.createElement("button");
    exportButton.textContent = "Export Prompts";
    exportButton.className = "export-prompts-button button-right";
    exportButton.addEventListener("click", window.exportPrompts);
    promptManager.insertBefore(exportButton, promptManager.firstChild.nextSibling);

    promptManager.insertBefore(newPromptButton, promptManager.firstChild.nextSibling);

    promptManager.insertBefore(searchInput, promptManager.firstChild);

    const promptGrid = document.querySelector(".prompt-grid");

    const loadMoreButton = document.createElement("button");
    loadMoreButton.textContent = "Load All";
    loadMoreButton.className = "load-more-button";
    loadMoreButton.addEventListener("click", () => {
        displayAllPrompts();
        loadMoreButton.style.display = "none";
    });
    promptManager.appendChild(loadMoreButton);

    // Load prompts from Chrome storage
    chrome.storage.local.get("prompts", (data) => {
        if (Array.isArray(data.prompts)) {
            window.prompts = data.prompts;
        } else {
            window.prompts = []; // Initialize prompts if not found in storage
        }

        displayLimitedPrompts(9);
        if (window.prompts.length > 9) {
            loadMoreButton.style.display = "block";
        } else {
            loadMoreButton.style.display = "none";
        }

    });
}




function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
  
    const promptGrid = document.querySelector(".prompt-grid");
    promptGrid.innerHTML = "";
  
    const matchingPrompts = window.prompts.filter((promptItem) => {
      const title = promptItem.title.toLowerCase();
      const description = promptItem.description.toLowerCase();
      return title.includes(searchTerm) || description.includes(searchTerm);
    });
  
    matchingPrompts.forEach((promptItem) => {
      addPromptToGrid(promptItem);
    });
  }