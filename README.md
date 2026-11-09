# Arrays de Costas

Todos os arrays de Costas de ordem 1 a **14** varridos, contados e conferidos
contra as construções algébricas de Welch e de Golomb. Node puro, sem
dependência nenhuma.

Um array de Costas de ordem `n` é uma permutação de `1..n` com uma exigência a
mais: olhando todos os pares de casas marcadas, os vetores que ligam uma à outra
têm de ser **todos diferentes**. Nenhum deslocamento leva o desenho a coincidir
consigo mesmo em mais de um ponto.

Eles nasceram em 1965, no radar e no sonar — essa propriedade é exatamente o que
faz a função de ambiguidade ter um pico só. E a contagem deles não tem fórmula:
sobe até a ordem 16 e depois desaba, e ninguém sabe dizer por quê.

## Os quatro achados

1. **A fração desaba e o número sobe, ao mesmo tempo.** De cada 100 permutações
   de três casas, 66,67 são de Costas. De cada 100 de doze casas, **0,0016**. E
   mesmo assim o número absoluto cresce o tempo todo, de 4 para 7.852: a peneira
   fecha mais rápido do que o domínio cresce, e os dois movimentos cabem na
   mesma tabela.
2. **A ordem 7 é a única, de 3 a 11, sem um único array vindo da álgebra.**
   Welch entrega ordem `p−1` e Golomb entrega `p−2`; com `p` primo nenhuma das
   duas alcança o 7. Os **200** arrays dessa ordem ficam todos sem explicação
   algébrica aqui — e é exatamente a ordem que precisaria de GF(9), o corpo de
   nove elementos, que não está implementado.
3. **A poda não economiza nada até a ordem 3 e economiza 335 vezes na 14.** Mas
   o preço de cada array achado sobe junto: 1 nó na ordem 1, 3.126 na ordem 12.
   A busca fica muito mais esperta e muito mais cara ao mesmo tempo.
4. **Toda ordem tem array simétrico.** As oito simetrias do quadrado agrupam os
   arrays em órbitas, e uma órbita menor que 8 é um array que coincide consigo
   mesmo por alguma reflexão. O tamanho médio sobe para **7,87** na ordem 11 e
   nunca chega a 8: são 72 arrays simétricos entre os 4.368.

## Três maneiras de ter certeza

- **O critério ingênuo** (`ehCostas`): monta os `n(n−1)/2` vetores num conjunto e
  procura repetido. É a definição, escrita do jeito mais direto possível.
- **A busca com poda** (`varrer`): ao escolher o valor da coluna `k`, confere só
  os vetores novos. Se um já apareceu, o ramo morre ali. Até a ordem 8 os dois
  caminhos são comparados **permutação por permutação**, e têm de achar
  exatamente o mesmo conjunto.
- **A álgebra** (`src/juiz.js`): Welch e Golomb não procuram nada, constroem. As
  **663** construções sobre primos até 40 passam todas pelo critério ingênuo, e
  a varredura tem de encontrar cada uma delas sozinha — e encontra.

## As medidas

Tudo abaixo sai de `node ferramentas/medidor.js`. Nenhum número foi digitado à
mão.

### A varredura por ordem, contra os valores conhecidos

| n | permutações | de Costas | conhecido | bate | fração |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | sim | 100,0000% |
| 2 | 2 | 2 | 2 | sim | 100,0000% |
| 3 | 6 | 4 | 4 | sim | 66,6667% |
| 4 | 24 | 12 | 12 | sim | 50,0000% |
| 5 | 120 | 40 | 40 | sim | 33,3333% |
| 6 | 720 | 116 | 116 | sim | 16,1111% |
| 7 | 5.040 | 200 | 200 | sim | 3,9683% |
| 8 | 40.320 | 444 | 444 | sim | 1,1012% |
| 9 | 362.880 | 760 | 760 | sim | 0,2094% |
| 10 | 3.628.800 | 2.160 | 2.160 | sim | 0,0595% |
| 11 | 39.916.800 | 4.368 | 4.368 | sim | 0,0109% |
| 12 | 479.001.600 | 7.852 | 7.852 | sim | 0,0016% |
| 13 | 6.227.020.800 | 12.828 | 12.828 | sim | 0,000206% |
| 14 | 87.178.291.200 | 17.252 | 17.252 | sim | 0,0000198% |

As ordens 13 e 14 estão num teste pesado; a 14 leva um minuto. **A ordem 15 leva
quase quatro minutos e a 16 passa de vinte**, e as duas ficaram de fora: a tabela
diz o que foi medido. É uma pena, porque o pico da sequência está justamente na
ordem 16.

### O que a poda economiza

| n | nós com poda | nós sem poda | razão | nós por array achado |
|---|---|---|---|---|
| 1 | 1 | 1 | 1,0x | 1,0 |
| 2 | 4 | 4 | 1,0x | 2,0 |
| 3 | 15 | 15 | 1,0x | 3,8 |
| 4 | 60 | 64 | 1,1x | 5,0 |
| 5 | 261 | 325 | 1,2x | 6,5 |
| 6 | 1.248 | 1.956 | 1,6x | 10,8 |
| 7 | 6.239 | 13.699 | 2,2x | 31,2 |
| 8 | 31.784 | 109.600 | 3,4x | 71,6 |
| 9 | 163.909 | 986.409 | 6,0x | 215,7 |
| 10 | 866.756 | 9.864.100 | 11,4x | 401,3 |
| 11 | 4.569.919 | 108.505.111 | 23,7x | 1.046,2 |
| 12 | 24.547.436 | 1.302.061.344 | 53,0x | 3.126,3 |
| 14 | 706.309.620 | 236.975.164.804 | 335,5x | 40.940,7 |

**Nós sem poda** não é `n!`: é a soma dos arranjos, que conta os nós internos e
não só as folhas. Comparar nó com folha dá uma razão bonita e errada.

### As órbitas das oito simetrias do quadrado

| n | de Costas | órbitas | tamanho médio | órbitas simétricas | arrays simétricos |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1,00 | 1 | 1 |
| 2 | 2 | 1 | 2,00 | 1 | 2 |
| 3 | 4 | 1 | 4,00 | 1 | 4 |
| 4 | 12 | 2 | 6,00 | 1 | 4 |
| 5 | 40 | 6 | 6,67 | 2 | 8 |
| 6 | 116 | 17 | 6,82 | 5 | 20 |
| 7 | 200 | 30 | 6,67 | 10 | 40 |
| 8 | 444 | 60 | 7,40 | 9 | 36 |
| 9 | 760 | 100 | 7,60 | 10 | 40 |
| 10 | 2.160 | 277 | 7,80 | 14 | 56 |
| 11 | 4.368 | 555 | 7,87 | 18 | 72 |

### A cobertura de Welch e Golomb sobre corpo primo

| n | de Costas | família algébrica | cobertos | fração |
|---|---|---|---|---|
| 3 | 4 | 4 | 4 | 100,00% |
| 4 | 12 | 12 | 12 | 100,00% |
| 5 | 40 | 12 | 12 | 30,00% |
| 6 | 116 | 16 | 16 | 13,79% |
| **7** | **200** | **0** | **0** | **0,00%** |
| 8 | 444 | 12 | 12 | 2,70% |
| 9 | 760 | 32 | 32 | 4,21% |
| 10 | 2.160 | 44 | 44 | 2,04% |
| 11 | 4.368 | 32 | 32 | 0,73% |

**Esta tabela é um piso, não o total.** Só Welch e Golomb sobre corpo primo estão
implementados; as construções sobre corpo de ordem potência de primo (GF(4),
GF(8), GF(9), …) ficaram de fora, e é por isso que a ordem 7 aparece zerada. A
coluna "família algébrica" e a coluna "cobertos" são sempre iguais — tudo que a
álgebra constrói, a varredura acha.

Nas ordens 3 e 4 a álgebra dá conta de **todos**. Da 5 em diante ela vira uma
minoria, e na 11 explica menos de um em cem.

### Os vetores, conferidos pelo critério ingênuo

| n | arrays | vetores por array | todos distintos |
|---|---|---|---|
| 6 | 116 | 15 | sim |
| 7 | 200 | 21 | sim |
| 8 | 444 | 28 | sim |
| 9 | 760 | 36 | sim |
| 10 | 2.160 | 45 | sim |

## O que as medidas me corrigiram

- **Escrevi 27,1 de cabeça** para a razão de poda da ordem 14, estendendo a curva
  da ordem 12 (53,0) com o olho. O certo é **335,5**. A poda não cresce devagar:
  ela explode, e cada ordem nova vale mais que a anterior.
- **Comparei nós com `n!` na primeira versão da tabela.** Nó não é folha. O
  denominador honesto é a soma dos arranjos — 1.302.061.344 para a ordem 12,
  contra 479.001.600 de `12!` — e trocar um pelo outro inflava a razão em quase
  três vezes, sempre a meu favor.
- **Montei a tabela de valores conhecidos com um deslocamento de um** e passei a
  achar que a ordem 13 divergia. Os 12.828 estavam certos desde o começo; o
  gabarito é que estava torto. Levei três ordens inteiras para desconfiar do
  lado certo.
- **Esperava que a álgebra cobrisse bem as ordens pequenas e mal as grandes.**
  Cobre bem as ordens 3 e 4 e mal todas as outras — e, no meio delas, há uma que
  ela não toca de jeito nenhum.

## Rodar

```bash
node --test testes/*.test.js             # os 35 testes (o pesado leva ~1 min)
node ferramentas/medidor.js              # todas as tabelas
node ferramentas/medidor.js algebrica    # uma tabela só
```

São **35 testes**: 19 de comportamento, 13 prendendo os números das tabelas e 3
nas varreduras das ordens 13 e 14. Sem `npm install`: não há dependência
nenhuma. Node 20 ou mais novo.

## Licença

MIT.
