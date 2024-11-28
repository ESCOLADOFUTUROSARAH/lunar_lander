# Lunar Lander Game

## Descrição do Jogo
Este projeto é um jogo de pouso lunar inspirado no clássico *Lunar Lander*, onde o jogador controla um módulo lunar e deve aterrissar em plataformas seguras em um terreno simulado. O objetivo é controlar cuidadosamente o módulo, usando os motores para ajustar a velocidade de descida e direção, garantindo que o pouso seja suave.

O jogo apresenta um fundo estrelado dinâmico e efeitos de partículas para a poeira lunar, oferecendo uma experiência envolvente e desafiadora.

## Tecnologias Utilizadas
- **HTML5**: Estrutura do jogo.
- **CSS3**: Estilização dos elementos do jogo, incluindo modais e o canvas.
- **JavaScript (ES6)**: Lógica do jogo, simulação física, controle do jogador, e renderização dos elementos visuais.

## Como Funciona o Jogo
O jogador controla o módulo lunar com as teclas:
- **Seta para Cima**: Ativa o motor para reduzir a velocidade de descida.
- **Seta para Esquerda**: Movimenta o módulo para a esquerda.
- **Seta para Direita**: Movimenta o módulo para a direita.
- **Espaço**: Pausa ou retoma o jogo.

O jogador deve pousar o módulo em uma das plataformas de pouso com uma velocidade segura. Caso a velocidade seja muito alta, ou o módulo colida com o terreno, o jogador perderá uma vida. O jogo termina quando todas as vidas são perdidas.

## Estrutura do Projeto
O projeto utiliza uma arquitetura modular, com cada funcionalidade principal dividida em diferentes módulos. Isso facilita a manutenção e a escalabilidade do código.

### Arquitetura e Padrões de Projeto Utilizados
- **Padrão Módulo (Module Pattern)**: Cada componente é encapsulado em seu próprio módulo, utilizando `export` e `import`. Isso melhora a organização do código e previne poluição do escopo global.
  - **main.js**: Gerencia o loop principal do jogo, o estado geral e coordena todos os componentes.
  - **Lander.js**: Define o módulo lunar, incluindo física de movimento, consumo de combustível e controle da aterrissagem e explosão.
  - **DustParticle.js**: Cria partículas de poeira ao redor do módulo lunar, simulando a poeira levantada ao pousar.
  - **StarField.js**: Cria o fundo estrelado, com estrelas de tamanhos e opacidades variados, simulando um céu noturno dinâmico.

- **Padrão Protótipo (Prototype Pattern)**: Utilizado para definir métodos nas classes do jogo, economizando memória ao compartilhar funcionalidades entre instâncias.

- **Padrão Loop de Jogo (Game Loop Pattern)**: Gerencia a atualização constante do estado do jogo e a renderização dos elementos visuais, garantindo uma experiência fluida para o jogador.

### Arquivos do Projeto
- **index.html**: Arquivo principal que carrega o canvas do jogo e os modais de interface.
- **/css/styles.css**: Estilização dos elementos da interface, incluindo modais e canvas.
- **/js/main.js**: Módulo principal que controla o jogo e gerencia o loop do jogo.
- **/js/Lander.js**: Define o comportamento do módulo lunar.
- **/js/StarField.js**: Define o campo estrelado dinâmico.
- **/js/DustParticle.js**: Cria partículas de poeira para o efeito visual do pouso.

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
