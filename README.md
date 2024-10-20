# Lunar Lander Game

## Descrição do Jogo
Este projeto é um jogo de pouso lunar inspirado no clássico "Lunar Lander", onde o jogador controla um módulo lunar e deve aterrissar em plataformas seguras em um terreno acidentado. O objetivo é controlar cuidadosamente o módulo, usando os motores para ajustar a velocidade de descida e direção, garantindo que o pouso seja suave.

O jogo apresenta um fundo estrelado dinâmico, um terreno gerado proceduralmente e plataformas de pouso, oferecendo uma experiência envolvente e desafiadora.

## Tecnologias Utilizadas
- **HTML5**: Utilizado para estruturar a interface do jogo.
- **CSS3**: Estilização dos elementos do jogo, incluindo modais e canvas.
- **JavaScript (ES6)**: A lógica do jogo, incluindo simulação da física, controle do jogador, e renderização dos elementos visuais.

## Como Funciona o Jogo
O jogador controla o módulo lunar usando as teclas:
- **Seta para Cima**: Ativa o motor para reduzir a velocidade de descida.
- **Seta para Esquerda**: Movimenta o módulo para a esquerda.
- **Seta para Direita**: Movimenta o módulo para a direita.
- **Espaço**: Pausa ou retoma o jogo.

O jogador deve pousar o módulo em uma das plataformas de pouso com uma velocidade segura. Caso a velocidade seja muito alta ou o módulo colida com o terreno, o jogador perderá uma vida. O jogo termina quando todas as vidas são perdidas.

## Estrutura do Projeto
O projeto segue uma arquitetura modular, onde cada funcionalidade principal do jogo é dividida em diferentes módulos. Isso facilita a manutenção e a escalabilidade do código.

### Arquitetura e Padrões de Projeto Utilizados
- **Padrão Módulo (Module Pattern)**: Cada componente do jogo é encapsulado em seu próprio módulo, utilizando o `export` e `import`. Isso melhora a organização do código e previne poluição do escopo global.
  - **Game.js**: Gerencia o loop principal do jogo, o estado geral, e coordena todos os componentes.
  - **Lander.js**: Define o módulo lunar, incluindo a física de movimento e colisão.
  - **Terrain.js**: Gera o terreno proceduralmente e desenha as plataformas de pouso.
  - **StarField.js**: Gera o fundo estrelado, com estrelas de tamanhos, cores e transparências variadas.
  - **InputHandler.js**: Captura as entradas do usuário, como teclas pressionadas, e fornece informações ao módulo do jogo.

- **Padrão Protótipo (Prototype Pattern)**: Utilizado para definir métodos nas classes do jogo, economizando memória ao compartilhar funcionalidades entre instâncias.

- **Padrão Loop de Jogo (Game Loop Pattern)**: Gerencia a atualização constante do estado do jogo e a renderização dos elementos visuais. O método `gameLoop` é responsável por manter a taxa de atualização ideal e garantir uma experiência fluida ao jogador.

- **Padrão Observador (Observer Pattern)**: Implementado para gerenciar as entradas do usuário, onde eventos de teclado atualizam o estado do jogo em tempo real.

### Arquivos do Projeto
- **index.html**: Arquivo principal que carrega o canvas do jogo e os modais de interface.
- **/css/styles.css**: Arquivo CSS que define a estilização dos elementos da interface, incluindo os modais e o canvas.
- **/js/Game.js**: Módulo principal que controla o jogo e gerencia o loop do jogo.
- **/js/Lander.js**: Define o comportamento do módulo lunar.
- **/js/Terrain.js**: Gera o terreno e as plataformas de pouso.
- **/js/StarField.js**: Define o campo estrelado dinâmico.
- **/js/InputHandler.js**: Gerencia as entradas do usuário.

## Como Executar o Jogo Localmente
1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/seu-usuario/lunar-lander-game.git
   ```

2. **Navegue para o Diretório do Projeto**:
   ```bash
   cd lunar-lander-game
   ```

3. **Abra o Arquivo `index.html` em seu Navegador**:
   - Basta abrir o arquivo `index.html` no navegador para jogar.

## Contribuições
Contribuições são bem-vindas! Se você tiver ideias para melhorar o jogo, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para obter mais informações.

## Capturas de Tela
- *Em breve*

## Contato
- **Desenvolvedor**: Maurizio Prizzi
- **E-mail**: maurizio@example.com
