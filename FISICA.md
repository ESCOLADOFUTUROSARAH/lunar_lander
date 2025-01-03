# FISICA.md

## Modificando o Valor da Gravidade no Jogo

Este arquivo tem como objetivo explicar ao professor de física como modificar o valor da gravidade no jogo "Lunar Lander" e discutir o motivo do valor atual da gravidade.

### Onde Editar o Valor da Gravidade

Para modificar a gravidade no jogo, você precisa editar o arquivo **`Lander.js`**, localizado na pasta `/js/`. Dentro desse arquivo, há uma variável chamada `gravity` que controla a aceleração gravitacional aplicada ao módulo lunar.

- **Arquivo a ser Editado**: `/js/Lander.js`
- **Linha a Ser Modificada**: Logo após o início da definição do construtor da classe `Lander`, a variável `gravity` é definida. Ela se encontra nas primeiras linhas do construtor.

Exemplo de como encontrar e modificar o valor da gravidade:

```javascript
// Lander.js

export class Lander {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.gravity = 0.162; // <-- Aqui você pode alterar o valor da gravidade
        // Outras configurações da nave...
    }
}
```

### Como Modificar o Valor da Gravidade

- Para aumentar a gravidade, você pode definir um valor **maior** do que o valor atual (`0.162`). Isso fará com que o módulo lunar desça mais rapidamente, simulando uma força gravitacional mais forte.
- Para diminuir a gravidade, você pode definir um valor **menor** do que o valor atual (`0.162`). Isso fará com que o módulo desça mais lentamente, simulando um ambiente com menos força gravitacional, como a Lua ou outro corpo celeste de menor massa.

### Discussão sobre o Valor da Gravidade

O valor atual da gravidade está definido como `0.162` para proporcionar um equilíbrio entre o desafio e a jogabilidade. Este valor é fictício e não corresponde exatamente à gravidade da Terra ou da Lua, pois o jogo tem como objetivo ser um desafio divertido e intuitivo, em vez de uma simulação cientificamente precisa.

- **Gravidade da Terra**: A aceleração da gravidade na Terra é aproximadamente `9.81 m/s²`. No jogo, valores próximos disso tornariam o controle do módulo extremamente difícil, uma vez que a gravidade terrestre é muito intensa para um jogo deste tipo.
- **Gravidade da Lua**: A gravidade da Lua é cerca de `1/6` da gravidade terrestre, ou aproximadamente `1.62 m/s²`. Um valor mais baixo para a variável `gravity` poderia simular um ambiente similar ao da Lua, oferecendo uma experiência de pouso mais lenta e controlável.

O valor foi ajustado para garantir que o jogador possa controlar o módulo com os motores e realizar pousos suaves, enquanto ainda se depara com um desafio realista.

### Tabela de Sugestões de Valores para Gravidade
A tabela abaixo sugere valores para o professor testar diferentes ambientes celestes. Esses valores foram calculados proporcionalmente à gravidade da Terra, ajustando o valor de `0.162` do jogo para representar diferentes corpos celestes.

| Corpo Celeste          | Gravidade Real (m/s²) | Valor no Jogo (`gravity`) |
|------------------------|-----------------------|---------------------------|
| Terra                  | 9.81                  | 0.162                     |
| Lua                    | 1.62                  | 0.027                     |
| Marte                  | 3.71                  | 0.061                     |
| Mercúrio               | 3.7                   | 0.061                     |
| Vênus                  | 8.87                  | 0.146                     |
| Júpiter                | 24.79                 | 0.409                     |
| Saturno                | 10.44                 | 0.172                     |
| Urano                  | 8.69                  | 0.143                     |
| Netuno                 | 11.15                 | 0.184                     |
| Plutão                 | 0.62                  | 0.010                     |
| Asteroide (Ceres)      | 0.27                  | 0.004                     |

### Sugestões para o Professor
- Você pode experimentar diferentes valores de gravidade para explorar como o controle do módulo muda em diferentes ambientes.
- Sugere-se testar valores como `0.1`, `0.2` ou outros da tabela acima para notar as diferenças no comportamento do jogo e discutir com os alunos como a aceleração gravitacional influencia no movimento dos corpos.

### Conclusão
A modificação da gravidade permite adaptar o jogo para diferentes níveis de dificuldade ou para explorar conceitos físicos com os alunos. Ao testar valores diferentes, podemos entender melhor a relação entre a gravidade e o controle do movimento, enriquecendo a experiência educacional de forma lúdica.