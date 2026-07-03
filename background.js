// Verifica se a API de Side Panel existe antes de tentar usá-la
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
} else {
    console.warn("A API sidePanel não é suportada neste navegador.");
}

let minimizarProximaJanela = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "preparar_minimizacao") {
        minimizarProximaJanela = true;
        setTimeout(() => { minimizarProximaJanela = false; }, 3000);
    }
});

chrome.windows.onCreated.addListener((window) => {
    if (minimizarProximaJanela) {
        chrome.windows.update(window.id, { state: "minimized" });
        minimizarProximaJanela = false; 
    }
});