// Arrays de Costas.
//
// Um array de Costas de ordem n e uma permutacao de 1..n com uma exigencia a
// mais: olhando todos os pares de casas marcadas, os vetores que ligam uma a
// outra tem de ser TODOS diferentes. Nenhum deslocamento leva o desenho a
// coincidir consigo mesmo em mais de um ponto.
//
// Eles nasceram em 1965, no radar e no sonar: a propriedade dos vetores e
// exatamente o que faz a funcao de ambiguidade ter um pico so. E a contagem
// deles nao tem formula. Sobe ate a ordem 16 e depois DESABA, e ninguem sabe
// dizer por que — so se sabe varrendo.

/**
 * A conferencia ingenua: monta todos os n(n-1)/2 vetores e procura repetido.
 *
 * E o criterio, escrito do jeito mais direto possivel. A busca de `varrer` usa
 * outro caminho, incremental, e os dois tem de concordar em toda permutacao.
 */
export function ehCostas(p) {
  const n = p.length;
  const vistos = new Set();
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const chave = (j - i) + ',' + (p[j] - p[i]);
      if (vistos.has(chave)) return false;
      vistos.add(chave);
    }
  }
  return true;
}

/** Todos os vetores de um array, na ordem em que a conferencia os monta. */
export function vetores(p) {
  const n = p.length;
  const lista = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) lista.push([j - i, p[j] - p[i]]);
  }
  return lista;
}

/** Quantos vetores um array de ordem n tem: n(n-1)/2, todos distintos. */
export function quantosVetores(n) {
  return (n * (n - 1)) / 2;
}

/**
 * A varredura: todos os arrays de Costas de ordem n, por retrocesso.
 *
 * A poda e a propria definicao aplicada cedo: ao escolher o valor da coluna k,
 * confere-se so os vetores NOVOS, os que ligam a coluna k as anteriores. Se um
 * deles ja apareceu, o ramo inteiro morre ali.
 *
 * `visita(p)` recebe o vetor de trabalho, reusado entre as chamadas. Para
 * guardar, `p.slice()`.
 *
 * Devolve { total, nos }, com `nos` o numero de valores experimentados — e a
 * medida de quanto a poda economiza contra as n! folhas da forca bruta.
 */
export function varrer(n, visita) {
  const p = new Int32Array(n);
  const usado = new Uint8Array(n + 2);
  const largura = 2 * n + 1;
  const dif = new Uint8Array((n + 1) * largura);
  let total = 0;
  let nos = 0;

  function poe(k) {
    if (k === n) {
      total++;
      if (visita) visita(p);
      return;
    }
    for (let c = 1; c <= n; c++) {
      if (usado[c]) continue;
      nos++;
      let ok = true;
      let feitas = 0;
      for (let i = 0; i < k; i++) {
        const idx = (k - i) * largura + (c - p[i] + n);
        if (dif[idx]) {
          ok = false;
          break;
        }
        dif[idx] = 1;
        feitas++;
      }
      if (ok) {
        usado[c] = 1;
        p[k] = c;
        poe(k + 1);
        usado[c] = 0;
      }
      for (let i = 0; i < feitas; i++) {
        dif[(k - i) * largura + (c - p[i] + n)] = 0;
      }
    }
  }

  poe(0);
  return { n, total, nos };
}

/** Todos os arrays de Costas de ordem n, como copias. */
export function todos(n) {
  const lista = [];
  varrer(n, (p) => lista.push(Array.from(p)));
  return lista;
}

/** Quantos arrays de Costas tem a ordem n. */
export function quantos(n) {
  return varrer(n).total;
}

/** n! — o tamanho do dominio de onde os arrays de Costas sao peneirados. */
export function fatorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

// --- as oito simetrias do quadrado -----------------------------------------
//
// Um array de Costas e um desenho de pontos num tabuleiro quadrado, e girar ou
// espelhar o tabuleiro leva um array de Costas em outro. Sao oito simetrias, e
// elas agrupam os arrays em orbitas.

/** O inverso da permutacao: o tabuleiro refletido na diagonal. */
export function transposta(p) {
  const n = p.length;
  const q = new Array(n);
  for (let i = 0; i < n; i++) q[p[i] - 1] = i + 1;
  return q;
}

/** O tabuleiro espelhado da esquerda para a direita. */
export function espelhoHorizontal(p) {
  return p.slice().reverse();
}

/** O tabuleiro espelhado de cima para baixo. */
export function espelhoVertical(p) {
  const n = p.length;
  return p.map((x) => n + 1 - x);
}

/** As oito imagens de um array pelas simetrias do quadrado, sem repetir. */
export function orbita(p) {
  const vistos = new Map();
  const fila = [p.slice()];
  while (fila.length) {
    const atual = fila.pop();
    const chave = atual.join(',');
    if (vistos.has(chave)) continue;
    vistos.set(chave, atual);
    fila.push(transposta(atual), espelhoHorizontal(atual), espelhoVertical(atual));
  }
  return [...vistos.values()];
}

/** As orbitas da ordem n: os arrays agrupados pelas simetrias do quadrado. */
export function orbitas(n) {
  const lista = todos(n);
  const vistos = new Set();
  const grupos = [];
  for (const p of lista) {
    const chave = p.join(',');
    if (vistos.has(chave)) continue;
    const orb = orbita(p);
    for (const q of orb) vistos.add(q.join(','));
    grupos.push(orb);
  }
  return grupos;
}
