let processando = false;
let timerDigitacao; 

async function processarLote(textoLimpo, tipoFiltro) {
    if (processando) return;
    processando = true;
    
    // Limpa a caixa imediatamente para feedback visual e para não acumular leituras
    document.getElementById('numerosInput').value = '';

    // Trava de segurança: se o site demorar mais de 4 segundos, liberta a extensão à força
    let travaSeguranca = setTimeout(() => {
        processando = false;
    }, 4000);

    let numeroAlvo = "";
    if (tipoFiltro === "solicitacao") {
        numeroAlvo = textoLimpo.substring(0, 10);
    } else {
        numeroAlvo = textoLimpo.substring(25, 34);
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url.includes("sistema.diaslog.com.br")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, () => {
            chrome.tabs.sendMessage(tab.id, { 
                action: "colar_e_enter", 
                lote: numeroAlvo,
                tipoFiltro: tipoFiltro 
            }, (response) => {
                clearTimeout(travaSeguranca); // Cancelar a trava, pois correu tudo bem
                processando = false; // Liberta para o próximo disparo
            });
        });
    } else {
        clearTimeout(travaSeguranca);
        alert("Por favor, navegue até ao ecrã de Consulta de Entregas do DiasLog.");
        processando = false;
    }
}

function verificarEProcessar() {
    const input = document.getElementById('numerosInput');
    const textoLimpo = input.value.replace(/\D/g, ''); 

    if (textoLimpo.length === 13) {
        processarLote(textoLimpo, "solicitacao");
    } else if (textoLimpo.length >= 44) {
        processarLote(textoLimpo, "nota_fiscal");
    }
}

document.getElementById('numerosInput').addEventListener('input', (e) => {
    clearTimeout(timerDigitacao);
    timerDigitacao = setTimeout(() => {
        verificarEProcessar();
    }, 150); 
});

document.getElementById('processarBtn').addEventListener('click', () => {
    const textoLimpo = document.getElementById('numerosInput').value.replace(/\D/g, '');
    if (textoLimpo.length !== 13 && textoLimpo.length < 44) {
        alert("Atenção: Insira 13 dígitos para Solicitações ou 44 para Notas Fiscais.");
    } else {
        verificarEProcessar();
    }
});

document.getElementById('numerosInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        verificarEProcessar();
    }
});