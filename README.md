🧩 DiasLog Lote Helper (Extensão do Chrome)
Status do Projeto: Ativo 🟢 | Versão: 1.0.0

Este repositório contém o código-fonte da extensão para Google Chrome DiasLog Lote Helper, desenvolvida para automatizar a inserção de lotes e gerenciar janelas diretamente no sistema interno da empresa (sistema.diaslog.com.br).  
JSON

🎯 Objetivo Corporativo
A extensão foi projetada para otimizar fluxos de trabalho logísticos, reduzindo o esforço manual de operadores e motoristas ao consultar pedidos e notas fiscais. Seus principais objetivos incluem:

Automação de Preenchimento: Inserção automática de dados de lotes em campos de busca através de um painel lateral (Side Panel).  
JSON
+ 2

Filtros Inteligentes: Identificação dinâmica do tipo de consulta (Nota Fiscal ou Solicitação) com base na quantidade de dígitos inseridos e alteração automática de filtros no site.  
JS
+ 1

Gerenciamento de Janelas: Controle automatizado de comportamento de janelas do navegador durante as requisições de sistema.  
JS
+ 1

🛠️ Tecnologias Utilizadas
Plataforma: Extensão para Google Chrome (Manifest V3)  
JSON

Lógica e Background: JavaScript (Service Workers e Content Scripts)  
JS
+ 3

Interface do Usuário: HTML5 e CSS3 (Painel Lateral customizado)  
HTML

🧠 Arquitetura e Regras de Negócio
A extensão opera dividida em módulos integrados sob o Manifest V3:  
JSON

Background Service Worker (background.js):

Gerencia a API de Side Panel do navegador para abrir a interface lateral ao clicar no ícone da extensão.  
JS
+ 1

Monitora a criação de janelas e executa comandos de minimização automatizada quando acionado pelo fluxo de envio.  
JS

Content Script (content.js):

Injetado dinamicamente nas páginas do domínio sistema.diaslog.com.br[cite: 8, 10].

Realiza a leitura e manipulação do DOM (suportando inclusive elementos estruturados dentro de iframes).  
JS

Localiza campos de busca, aplica limpeza de dados, simula eventos de teclado e aciona botões de pesquisa (lupa).  
JS

Gerencia regras para alternar selects de acordo com o tipo de filtro (Solicitação com 13 dígitos ou Nota Fiscal com 44+ dígitos).  
JS
+ 1

Painel Lateral / Side Panel (sidepanel.html e sidepanel.js):

Fornece uma área de texto limpa para colagem de códigos via leitor ou teclado.  
HTML
+ 1

Possui listeners inteligentes de entrada de dados (input e keydown) que processam o lote automaticamente assim que o tamanho do texto atinge o padrão esperado.  
JS

⚙️ Instalação e Configuração (Modo Desenvolvedor)
Como se trata de uma extensão local customizada para o ecossistema corporativo, siga os passos abaixo para instalá-la no Google Chrome:

Baixe ou clone este repositório para uma pasta local no seu computador.

Abra o Google Chrome e navegue até chrome://extensions/.

No canto superior direito, ative o Modo do desenvolvedor (Developer mode).

No canto superior esquerdo, clique no botão Carregar sem compactação (Load unpacked).

Selecione a pasta onde se encontram os arquivos da extensão (contendo o manifest.json).  
JSON

A extensão aparecerá instalada e pronta para uso no painel lateral do navegador ao acessar o sistema da DiasLog.  
JSON
+ 2

👥 Responsáveis e Suporte
Caso haja necessidade de atualizar as regras de parsing de dados ou ajustar seletores do DOM para o painel da DiasLog, entre em contato:

Desenvolvedor(a) Responsável: @4nten0r

Setor: TI / Operações Logísticas
