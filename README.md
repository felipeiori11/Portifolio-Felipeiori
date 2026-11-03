# Portfólio de Felipe Iori de Souza

Portfólio pessoal com apresentação, formação, experiência, habilidades, projetos e contatos.

## Abrir

Para abrir a prévia local, execute `node preview.mjs` na pasta do projeto e acesse `http://127.0.0.1:4173`. Para encerrar o servidor iniciado no terminal, pressione `Ctrl+C`.

Também é possível abrir `portfolio/index.html` diretamente no navegador. O site usa HTML, CSS e JavaScript e não precisa de instalação ou compilação. Para hospedagem estática, publique a pasta `portfolio`.

## Tema claro e escuro

O seletor no topo permite escolher entre Claro e Escuro, com ícones de sol e lua e suporte a teclado. A escolha fica salva no navegador. Na primeira visita, o site segue o tema do dispositivo; a preferência salva é aplicada antes do carregamento dos estilos. Se o armazenamento estiver indisponível, a troca continua funcionando durante a visita. O tema escuro inclui todas as seções, cards, menu e janelas de detalhes. No celular, o seletor fica em uma linha própria, sempre visível fora da rolagem do menu.

## Design

Adaptação do Sidefolio, de Manu Arora / Aceternity, a partir do ZIP fornecido: cores neutras, área de conteúdo arredondada, fonte Cal Sans e galeria de imagens. A navegação usa um Floating Dock horizontal centralizado no topo. A implementação foi adaptada ao projeto estático existente.

O conteúdo, a foto, o currículo, as imagens dos projetos e o workflow são os materiais existentes de Felipe. Os textos e projetos de demonstração do modelo não são usados.

## Arquivos

- `portfolio/index.html`: conteúdo, navegação e janelas de detalhes.
- `portfolio/style.css`: design e regras para celular, tablet e desktop.
- `portfolio/script.js`: navegação, galerias e categorias de projetos.
- `portfolio/floating-dock.js`: ampliação dos ícones e navegação horizontal do menu superior.
- `portfolio/theme.js` e `portfolio/theme.css`: seleção, persistência e estilos dos temas claro e escuro.
- `portfolio/assets/`: foto, currículo, imagens, workflow e fonte do modelo.

Os contatos levam ao e-mail, telefone, LinkedIn e GitHub informados no portfólio. As galerias usam controles manuais e também aceitam as setas do teclado.

## Cards de projetos em 3D

Os sete cards da página inicial, dos projetos e da automação seguem a referência 3D Card da Aceternity fornecida pelo usuário. Usam perspectiva de 1000px, rotação conforme a posição do ponteiro e camadas com profundidades de 50px no título, 60px na descrição, 100px na imagem e 20px nas ações.

A implementação usa HTML, CSS e JavaScript, porque o projeto existente não usa React, TypeScript ou Tailwind. Os componentes, contexto e hook do exemplo foram substituídos por marcação compartilhada e eventos do navegador; não há novas dependências no site. Os valores de cor, borda, raio, imagem e tempo de transição seguem o exemplo. O grid, as margens entre cards e o padding em telas pequenas foram adaptados ao espaço do portfólio. As imagens, textos e ações são os projetos reais de Felipe; as tecnologias foram mantidas como etiquetas adicionais.

Os estilos escuros são compatíveis com a classe `.dark` ou o atributo `data-theme="dark"` em um ancestral, sem alterar o tema claro atual do portfólio. Em dispositivos de toque e com preferência por movimento reduzido, os cards permanecem estáveis. Os botões continuam acessíveis pelo teclado e preservam as galerias e o download do workflow.

O cálculo da rotação usa a área externa estável do card para evitar oscilações de medição. As atualizações são agrupadas com `requestAnimationFrame`, e o efeito é zerado ao sair do card, mudar de seção, trocar de preferência de movimento ou sair da janela. As imagens usam carregamento sob demanda. O espaçamento vertical de 80px de cada `CardContainer` do exemplo foi substituído pelo espaçamento do grid; o intervalo de 80px antes das ações dentro de cada card foi preservado.

## Menu Floating Dock horizontal

O menu fica fixo e centralizado no topo, com fundo translúcido, borda sutil e nomes abaixo dos ícones. Inclui perfil, sete seções, GitHub, LinkedIn, e-mail e currículo. O botão “Meu currículo” mantém fundo azul e conteúdo branco. O conteúdo da página fica centralizado, com espaço reservado acima para a barra.

Como o projeto usa HTML/CSS/JavaScript, os componentes React, Motion, helpers e ícones Tabler da referência foram adaptados para marcação nativa, SVGs existentes e uma mola integrada com `requestAnimationFrame`, sem novas dependências. A mola mantém massa 0,1, rigidez 150 e amortecimento 12. O cálculo considera a distância horizontal do ponteiro, com alcance de 150px. As bolhas ampliam visualmente de 32px a 44px, sem alterar a largura das abas ou a altura de 86px da barra. O efeito tem menor amplitude que o exemplo para manter a composição compacta e os rótulos estáveis.

Em telas estreitas, o menu continua horizontal e visível, com rolagem por toque, trackpad, roda do mouse ou teclado. Tab e as setas esquerda/direita navegam pelos links; Home/End levam ao primeiro/último item. A aba ativa é trazida para a área visível quando necessário. Não há menu lateral, fundo de bloqueio ou controle de foco fechado em um drawer. A ampliação fica desativada no toque e com movimento reduzido. Os temas escuros usam `.dark` ou `data-theme="dark"`, como os cards.

Cada aba tem borda sutil, cantos arredondados e fundo neutro. A ampliação responde apenas ao ponteiro dentro da própria aba; ao sair dela, os ícones retornam ao tamanho normal. Os intervalos, divisores e o fundo do menu não ativam o zoom. Os vizinhos participam da ampliação suave do exemplo. Os nomes permanecem visíveis em uma linha, sem depender de tooltips.
