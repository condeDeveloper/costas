// O medidor: roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js             todas
//   node ferramentas/medidor.js algebrica   so uma
//
// Nenhum numero do README e digitado a mao: sai daqui.

import {
  tabelaVarredura,
  tabelaPoda,
  tabelaOrbitas,
  tabelaAlgebrica,
  tabelaConstrucoes,
  tabelaVetores,
} from '../src/medidas.js';

const num = (x) => x.toLocaleString('pt-BR');
const dec = (x, c = 4) => x.toLocaleString('pt-BR', { minimumFractionDigits: c, maximumFractionDigits: c });
const pct = (x, c = 4) => dec(x * 100, c) + '%';

function imprimir(titulo, colunas, linhas) {
  console.log('\n### ' + titulo);
  const larguras = colunas.map((c, i) => Math.max(c.length, ...linhas.map((l) => String(l[i]).length)));
  const linha = (cs) => '| ' + cs.map((c, i) => String(c).padStart(larguras[i])).join(' | ') + ' |';
  console.log(linha(colunas));
  console.log('|' + larguras.map((w) => '-'.repeat(w + 2)).join('|') + '|');
  for (const l of linhas) console.log(linha(l));
}

const tabelas = {
  varredura() {
    imprimir(
      'A varredura por ordem, contra os valores conhecidos',
      ['n', 'permutacoes', 'de Costas', 'conhecido', 'bate', 'fracao'],
      tabelaVarredura(12).map((l) => [
        l.n, num(l.permutacoes), num(l.total), l.conhecido === null ? '-' : num(l.conhecido),
        l.bate === null ? '-' : l.bate ? 'sim' : 'NAO', pct(l.fracao),
      ])
    );
  },

  poda() {
    imprimir(
      'O que a poda economiza',
      ['n', 'nos com poda', 'nos sem poda', 'razao', 'nos por array achado'],
      tabelaPoda(12).map((l) => [
        l.n, num(l.nos), num(l.semPoda), dec(l.razao, 1) + 'x', dec(l.nosPorArray, 1),
      ])
    );
  },

  orbitas() {
    imprimir(
      'As orbitas das oito simetrias do quadrado',
      ['n', 'de Costas', 'orbitas', 'tamanho medio', 'orbitas simetricas', 'arrays simetricos'],
      tabelaOrbitas(11).map((l) => [
        l.n, num(l.total), num(l.orbitas), dec(l.tamanhoMedio, 2),
        num(l.orbitasSimetricas), num(l.arraysSimetricos),
      ])
    );
  },

  algebrica() {
    imprimir(
      'A cobertura de Welch e Golomb sobre corpo primo (um piso)',
      ['n', 'de Costas', 'familia algebrica', 'cobertos', 'fracao'],
      tabelaAlgebrica(11).map((l) => [
        l.n, num(l.total), num(l.familia), num(l.cobertos), pct(l.fracao, 2),
      ])
    );
  },

  construcoes() {
    const t = tabelaConstrucoes(40);
    console.log('\n### As construcoes algebricas conferidas uma a uma');
    console.log();
    console.log('primos ate ' + t.atePrimo + ': ' + num(t.welchs) + ' arrays de Welch e ' +
      num(t.golombs) + ' de Golomb, ' + num(t.total) + ' ao todo.');
    console.log('todos passaram pela conferencia ingenua de `ehCostas`.');
  },

  vetores() {
    imprimir(
      'Os vetores conferidos pelo criterio ingenuo, array a array',
      ['n', 'arrays', 'vetores por array', 'todos distintos'],
      tabelaVetores(10).map((l) => [
        l.n, num(l.arrays), l.vetoresPorArray, l.distintosSempre ? 'sim' : 'NAO',
      ])
    );
  },
};

const pedido = process.argv[2];
if (pedido && !tabelas[pedido]) {
  console.error('tabela desconhecida: ' + pedido);
  console.error('disponiveis: ' + Object.keys(tabelas).join(', '));
  process.exit(1);
}
for (const [nome, fn] of Object.entries(tabelas)) {
  if (!pedido || pedido === nome) fn();
}
console.log();
