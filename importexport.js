window.importPrompts = importPrompts;
window.exportPrompts = exportPrompts;

function importPrompts() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const fileContent = await file.text();
          const importedPrompts = JSON.parse(fileContent);
          if (Array.isArray(importedPrompts)) {
            // Merge existing prompts with imported prompts
            window.prompts = mergePrompts(window.prompts, importedPrompts);
  
            chrome.storage.local.set({ "prompts": window.prompts }, () => {
              console.log("Imported prompts saved to Chrome storage");
            });
            displayAllPrompts();
          } else {
            alert("Invalid file format");
          }
        } catch (error) {
          console.error("Error importing prompts:", error);
          alert("Error importing prompts. Please check the file.");
        }
      }
    });
  
  
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }
  function mergePrompts(existingPrompts, importedPrompts) {
    const mergedPrompts = [...existingPrompts, ...importedPrompts];
  
    // Remove duplicates based on the `title` property
    const uniquePromptsMap = new Map();
    for (const prompt of mergedPrompts) {
      if (!uniquePromptsMap.has(prompt.title)) {
        uniquePromptsMap.set(prompt.title, prompt);
      }
    }
  
    return Array.from(uniquePromptsMap.values());
  }
  
  
  function exportPrompts() {
    const data = new Blob([JSON.stringify(window.prompts)], { type: "application/json" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prompts.json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  
  