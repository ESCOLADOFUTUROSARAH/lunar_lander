# Lunar Lander

Um jogo clássico de pouso lunar desenvolvido com HTML5, CSS, e JavaScript, onde o jogador controla uma nave espacial tentando pousar suavemente em uma plataforma sem explodir. O projeto utiliza um canvas para renderizar gráficos e efeitos visuais, como partículas e estrelas cintilantes, para proporcionar uma experiência imersiva.

## 🚀 Funcionalidades

- **Controle de Nave:** Use as setas do teclado para controlar a nave (para cima, esquerda e direita).
- **Gravidade e Física Realistas:** Simulação de física com gravidade, velocidade e aceleração.
- **Pouso Suave:** O objetivo é pousar a nave suavemente em uma plataforma para ganhar pontos.
- **Efeitos Visuais:** Partículas simulando chamas dos propulsores, poeira ao pousar e explosões em caso de colisão.
- **Estrelas Cintilantes:** Fundo animado com estrelas cintilantes para um efeito visual de espaço.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Para estruturar a interface do jogo.
- **CSS3:** Para estilização e efeitos de transição.
- **JavaScript (ES6):** Para implementar a lógica do jogo, efeitos de partículas e física.

## 📂 Estrutura do Projeto

```
Lunar-Lander/
├── index.html         # Página principal do jogo
├── css/
│   └── styles.css     # Estilos do jogo
├── js/
    ├── main.js        # Lógica principal do jogo
    ├── Lander.js      # Classe da nave (Lander)
    ├── DustParticle.js# Classe das partículas
    └── StarField.js   # Classe para o campo de estrelas
```

## ⚙️ Como Executar o Projeto

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/seu-usuario/lunar-lander.git
   ```

2. **Acesse o diretório do projeto:**

   ```sh
   cd lunar-lander
   ```

3. **Abra o arquivo `index.html` em um navegador:**

   Você pode abrir o arquivo diretamente no navegador ou usar um servidor HTTP local para executar o jogo.

4. **Controles:**
   - **Seta para Cima:** Ativa o propulsor principal para diminuir a descida.
   - **Seta para a Esquerda/Direita:** Controla o movimento horizontal da nave.

## 🎮 Objetivo do Jogo

- Pouse suavemente na plataforma para ganhar pontos.
- Evite pousar com uma velocidade alta para não explodir a nave.
- Controle o uso do combustível, pois ele é limitado!

## 📈 Pontuação e Dificuldade

- Cada pouso bem-sucedido gera pontos adicionais.
- Cada vida perdida é exibida no canto superior direito.
- O jogo se torna mais difícil à medida que o combustível se esgota.

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Se você deseja melhorar este projeto, siga os passos abaixo:

1. Faça um **fork** deste repositório.
2. Crie uma **branch** para sua feature ou correção: `git checkout -b minha-feature`
3. Faça um **commit** das suas alterações: `git commit -m 'Adicionando minha feature'`
4. Envie para o **branch** original: `git push origin minha-feature`
5. Crie um **pull request** explicando suas alterações.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Prof. Maurizio Prizzi](https://github.com/maurizioprizzi).
