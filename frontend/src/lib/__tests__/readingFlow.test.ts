import { describe, expect, it } from 'vitest';
import {
  FLOW_NOTICES,
  createFlow,
  createReviewFlow,
  flowReducer,
  pendingRequest,
  type FlowAction,
  type FlowState,
} from '../readingFlow';
import type { DrawnCard, Interpretation } from '../../types/reading';

const CARDS: DrawnCard[] = [0, 1, 2].map((i) => ({
  position: i,
  positionTitle: ['O que pesa', 'O que sustenta', 'O caminho'][i],
  positionMeaning: '',
  number: [17, 8, 21][i],
  numeral: ['XVII', 'VIII', 'XXI'][i],
  name: ['A Estrela', 'A Força', 'O Mundo'][i],
  keywords: ['x'],
}));

const INTERP: Interpretation = {
  opening: 'Abertura',
  cards: CARDS.map((c) => ({ position: c.position, positionTitle: c.positionTitle, cardName: c.name, text: 't' })),
  synthesis: 'Síntese',
  invitation: 'Convite',
  careNote: null,
  disclaimer: 'Reflexão',
  source: 'model',
};

const SUPPORT = { title: 'Antes das cartas, você', message: 'm', resources: [] };

const run = (actions: FlowAction[], from: FlowState = createFlow({ tableSlots: 12, cardsToPick: 3 })) =>
  actions.reduce(flowReducer, from);

const chosen = () =>
  run([{ type: 'RITUAL_DONE' }, { type: 'TOGGLE_PICK', slot: 2 }, { type: 'TOGGLE_PICK', slot: 7 }, { type: 'TOGGLE_PICK', slot: 10 }]);

describe('readingFlow — caminho feliz', () => {
  it('ritual → escolha → sorteio → revelação → interpretação', () => {
    let s = chosen();
    expect(s.picks).toEqual([2, 7, 10]);
    s = flowReducer(s, { type: 'CONFIRM_PICKS' });
    expect(s.stage).toBe('drawing');
    expect(pendingRequest(s)).toBe('draw');

    s = flowReducer(s, { type: 'DRAW_OK', cards: CARDS });
    expect(s.stage).toBe('revealing');
    expect(pendingRequest(s)).toBe('interpret'); // interpretação começa enquanto as cartas viram

    s = flowReducer(s, { type: 'REVEAL_DONE' });
    expect(s.stage).toBe('interpreting');
    s = flowReducer(s, { type: 'INTERPRET_OK', interpretation: INTERP });
    expect(s.stage).toBe('revealed');
    expect(pendingRequest(s)).toBeNull();
  });

  it('se a interpretação chega antes das cartas terminarem de virar, espera a revelação', () => {
    let s = run([{ type: 'CONFIRM_PICKS' }, { type: 'DRAW_OK', cards: CARDS }], chosen());
    s = flowReducer(s, { type: 'INTERPRET_OK', interpretation: INTERP });
    expect(s.stage).toBe('revealing');
    expect(pendingRequest(s)).toBeNull();
    s = flowReducer(s, { type: 'REVEAL_DONE' });
    expect(s.stage).toBe('revealed');
  });

  it('desmarcar uma carta libera a escolha de outra', () => {
    const s = run([{ type: 'TOGGLE_PICK', slot: 7 }, { type: 'TOGGLE_PICK', slot: 0 }], chosen());
    expect(s.picks).toEqual([2, 10, 0]);
  });

  it('rever leitura começa direto na interpretação e usa as cartas do servidor', () => {
    let s = createReviewFlow();
    expect(pendingRequest(s)).toBe('interpret');
    s = flowReducer(s, { type: 'INTERPRET_OK', interpretation: INTERP, cards: CARDS });
    expect(s.stage).toBe('revealed');
    expect(s.cards).toEqual(CARDS);
  });
});

describe('readingFlow — falhas e limites', () => {
  it('não aceita uma quarta carta', () => {
    const s = flowReducer(chosen(), { type: 'TOGGLE_PICK', slot: 11 });
    expect(s.picks).toEqual([2, 7, 10]);
    expect(s.notice).toBe(FLOW_NOTICES.tooMany(3));
  });

  it('não confirma com menos de três cartas', () => {
    const s = run([{ type: 'RITUAL_DONE' }, { type: 'TOGGLE_PICK', slot: 1 }, { type: 'CONFIRM_PICKS' }]);
    expect(s.stage).toBe('choosing');
    expect(s.notice).toBe(FLOW_NOTICES.notEnough(3));
  });

  it('recusa posições fora da mesa', () => {
    const s = run([{ type: 'RITUAL_DONE' }, { type: 'TOGGLE_PICK', slot: 12 }, { type: 'TOGGLE_PICK', slot: -1 }]);
    expect(s.picks).toEqual([]);
    expect(s.notice).toBe(FLOW_NOTICES.invalidSlot);
  });

  it('não permite escolher antes de concluir o ritual', () => {
    const s = run([{ type: 'TOGGLE_PICK', slot: 1 }]);
    expect(s.stage).toBe('ritual');
    expect(s.picks).toEqual([]);
  });

  it('falha no sorteio → nova tentativa reenvia as mesmas posições', () => {
    let s = run([{ type: 'CONFIRM_PICKS' }, { type: 'FAIL', step: 'draw', message: 'rede', retryable: true }], chosen());
    expect(s.stage).toBe('error');
    s = flowReducer(s, { type: 'RETRY' });
    expect(s.stage).toBe('drawing');
    expect(s.picks).toEqual([2, 7, 10]);
    expect(pendingRequest(s)).toBe('draw');
  });

  it('falha na interpretação → nova tentativa mantém as cartas e não volta ao sorteio', () => {
    let s = run(
      [{ type: 'CONFIRM_PICKS' }, { type: 'DRAW_OK', cards: CARDS }, { type: 'REVEAL_DONE' },
        { type: 'FAIL', step: 'interpret', message: 'indisponível', retryable: true }],
      chosen(),
    );
    expect(s.error?.step).toBe('interpret');
    s = flowReducer(s, { type: 'RETRY' });
    expect(s.stage).toBe('interpreting');
    expect(s.cards).toEqual(CARDS);
    expect(pendingRequest(s)).toBe('interpret');
  });

  it('erro não repetível não volta ao fluxo', () => {
    const s = run([{ type: 'CONFIRM_PICKS' }, { type: 'FAIL', step: 'draw', message: 'x', retryable: false }, { type: 'RETRY' }], chosen());
    expect(s.stage).toBe('error');
  });

  it('respostas atrasadas não sobrescrevem estados finais', () => {
    let s = run([{ type: 'CONFIRM_PICKS' }, { type: 'DRAW_OK', cards: CARDS }, { type: 'REVEAL_DONE' },
      { type: 'INTERPRET_OK', interpretation: INTERP }], chosen());
    s = flowReducer(s, { type: 'FAIL', step: 'interpret', message: 'tarde', retryable: true });
    expect(s.stage).toBe('revealed');
    expect(flowReducer(s, { type: 'DRAW_OK', cards: [] }).cards).toEqual(CARDS);
  });

  it('pergunta de risco começa e permanece em acolhimento, sem pedir sorteio', () => {
    let s = createFlow({ tableSlots: 0, cardsToPick: 0, support: SUPPORT });
    expect(s.stage).toBe('support');
    s = run([{ type: 'RITUAL_DONE' }, { type: 'CONFIRM_PICKS' }, { type: 'FAIL', step: 'draw', message: 'x', retryable: true }], s);
    expect(s.stage).toBe('support');
    expect(pendingRequest(s)).toBeNull();
  });

  it('servidor pode desviar para acolhimento durante a interpretação', () => {
    const s = run([{ type: 'CONFIRM_PICKS' }, { type: 'DRAW_OK', cards: CARDS }, { type: 'SUPPORT', support: SUPPORT }], chosen());
    expect(s.stage).toBe('support');
    expect(pendingRequest(s)).toBeNull();
  });

  it('degustação já usada leva ao estado de limite', () => {
    expect(flowReducer(chosen(), { type: 'LIMIT' }).stage).toBe('limit');
  });
});
