if (!window.diasLogListenerAdded) {
    window.diasLogCleanupTimer = null; // Variável global para controlar a limpeza

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "colar_e_enter") {
            
            // 1. Cancela imediatamente a limpeza da consulta anterior (se ainda estiver a decorrer)
            if (window.diasLogCleanupTimer) {
                clearTimeout(window.diasLogCleanupTimer);
                window.diasLogCleanupTimer = null;
            }
            
            function buscarElementoNoDocumento(doc, seletor) {
                let elemento = doc.querySelector(seletor);
                if (elemento) return elemento;

                const iframes = doc.querySelectorAll('iframe');
                for (let iframe of iframes) {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const encontrado = buscarElementoNoDocumento(iframeDoc, seletor);
                        if (encontrado) return encontrado;
                    } catch (e) {}
                }
                return null;
            }

            function removerAcentos(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            }

            let filtroMudou = false;

            const selectFiltro = buscarElementoNoDocumento(document, 'select');
            if (selectFiltro) {
                let palavraChave = request.tipoFiltro === "solicitacao" ? "solicitacao" : "nota fiscal";
                let opcaoAlvo = Array.from(selectFiltro.options).find(opt => 
                    removerAcentos(opt.text).includes(palavraChave)
                );

                if (opcaoAlvo && selectFiltro.value !== opcaoAlvo.value) {
                    selectFiltro.value = opcaoAlvo.value;
                    selectFiltro.dispatchEvent(new Event('change', { bubbles: true }));
                    filtroMudou = true; // O site vai recarregar a secção
                }
            }

            function executarColagem() {
                const campoBusca = buscarElementoNoDocumento(document, 'input[placeholder="Buscar"], input[type="text"]');

                if (campoBusca) {
                    // Limpeza inicial forçada
                    campoBusca.focus();
                    campoBusca.value = ''; 
                    campoBusca.dispatchEvent(new Event('input', { bubbles: true }));
                    campoBusca.dispatchEvent(new Event('change', { bubbles: true }));

                    // Inserção do novo código
                    campoBusca.value = request.lote;
                    campoBusca.dispatchEvent(new Event('input', { bubbles: true }));
                    campoBusca.dispatchEvent(new Event('change', { bubbles: true }));

                    chrome.runtime.sendMessage({ action: "preparar_minimizacao" });

                    const eventosTeclado = ['keydown', 'keypress', 'keyup'];
                    eventosTeclado.forEach(tipo => {
                        campoBusca.dispatchEvent(new KeyboardEvent(tipo, {
                            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
                        }));
                    });

                    setTimeout(() => {
                        const vizinhanca = campoBusca.parentElement;
                        if (vizinhanca) {
                            const botaoLupa = vizinhanca.querySelector('button, a, img, i, input[type="image"], .fa-search');
                            if (botaoLupa) botaoLupa.click();
                        }
                        
                        sendResponse({ status: "sucesso" });

                        // 2. Regista a nova limpeza com proteção (só limpa se o elemento ainda existir)
                        window.diasLogCleanupTimer = setTimeout(() => {
                            if (document.body.contains(campoBusca)) {
                                campoBusca.value = '';
                                campoBusca.dispatchEvent(new Event('input', { bubbles: true }));
                                campoBusca.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }, 1500);

                    }, 50);

                } else {
                    sendResponse({ status: "erro" });
                }
            }

            // Aumentámos de 1000ms para 1200ms para dar tempo ao ASP.NET de respirar
            if (filtroMudou) {
                setTimeout(executarColagem, 1200);
            } else {
                executarColagem();
            }

            return true; 
        }
    });
    window.diasLogListenerAdded = true;
}