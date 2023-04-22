window.onload = window.initializePromptManager;

const observer = new MutationObserver((mutations) => {
  window.initializePromptManager();
});

observer.observe(document.body, { childList: true, subtree: true });
