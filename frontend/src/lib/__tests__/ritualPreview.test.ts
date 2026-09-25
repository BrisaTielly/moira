import { describe, expect, it } from 'vitest';
import {
  MAX_SHUFFLES,
  RITUAL_ERRORS,
  initialRitualState,
  ritualHint,
  ritualReducer,
  type RitualAction,
  type RitualState,
} from '../ritualPreview';

const run = (actions: RitualAction[], from: RitualState = initialRitualState) =>
  actions.reduce(ritualReducer, from);

describe('ritualReducer — caminho feliz', () => {
  it('embaralha, corta e fica pronto para a revelação', () => {
    const state = run([
      { type: 'SHUFFLE' },
      { type: 'SHUFFLE_DONE' },
      { type: 'CUT' },
      { type: 'CUT_DONE' },
    ]);
    expect(state).toEqual({ phase: 'ready', shuffles: 1, error: null });
  });

  it('permite embaralhar de novo antes de cortar e conta os embaralhamentos', () => {
    const state = run([
      { type: 'SHUFFLE' },
      { type: 'SHUFFLE_DONE' },
      { type: 'SHUFFLE' },
      { type: 'SHUFFLE_DONE' },
    ]);
    expect(state.phase).toBe('shuffled');
    expect(state.shuffles).toBe(2);
  });

  it('RESET volta ao estado inicial de qualquer fase', () => {
    const ready = run([{ type: 'SHUFFLE' }, { type: 'SHUFFLE_DONE' }, { type: 'CUT' }, { type: 'CUT_DONE' }]);
    expect(ritualReducer(ready, { type: 'RESET' })).toEqual(initialRitualState);
  });
});

describe('ritualReducer — cenários de falha', () => {
  it('recusa cortar antes de embaralhar, com mensagem gentil', () => {
    const state = ritualReducer(initialRitualState, { type: 'CUT' });
    expect(state.phase).toBe('idle');
    expect(state.error).toBe(RITUAL_ERRORS.cutBeforeShuffle);
  });

  it('recusa embaralhar depois que o baralho foi cortado', () => {
    const ready = run([{ type: 'SHUFFLE' }, { type: 'SHUFFLE_DONE' }, { type: 'CUT' }, { type: 'CUT_DONE' }]);
    const state = ritualReducer(ready, { type: 'SHUFFLE' });
    expect(state.phase).toBe('ready');
    expect(state.error).toBe(RITUAL_ERRORS.shuffleAfterCut);
  });

  it('ignora cliques repetidos durante animações (sem erro, sem mudar estado)', () => {
    const shuffling = ritualReducer(initialRitualState, { type: 'SHUFFLE' });
    expect(ritualReducer(shuffling, { type: 'SHUFFLE' })).toBe(shuffling);
    expect(ritualReducer(shuffling, { type: 'CUT' })).toBe(shuffling);

    const cutting = run([{ type: 'SHUFFLE_DONE' }, { type: 'CUT' }], shuffling);
    expect(ritualReducer(cutting, { type: 'SHUFFLE' })).toBe(cutting);
    expect(ritualReducer(cutting, { type: 'CUT' })).toBe(cutting);
  });

  it('ignora eventos "DONE" fora de ordem (ex.: timer atrasado após RESET)', () => {
    expect(ritualReducer(initialRitualState, { type: 'SHUFFLE_DONE' })).toBe(initialRitualState);
    expect(ritualReducer(initialRitualState, { type: 'CUT_DONE' })).toBe(initialRitualState);
  });

  it('limita o número de embaralhamentos e orienta a cortar', () => {
    let state = initialRitualState;
    for (let i = 0; i < MAX_SHUFFLES; i++) {
      state = run([{ type: 'SHUFFLE' }, { type: 'SHUFFLE_DONE' }], state);
    }
    const blocked = ritualReducer(state, { type: 'SHUFFLE' });
    expect(blocked.phase).toBe('shuffled');
    expect(blocked.shuffles).toBe(MAX_SHUFFLES);
    expect(blocked.error).toBe(RITUAL_ERRORS.tooManyShuffles);
  });

  it('limpa o erro quando a visitante faz a ação certa', () => {
    const withError = ritualReducer(initialRitualState, { type: 'CUT' });
    expect(ritualReducer(withError, { type: 'SHUFFLE' }).error).toBeNull();
  });

  it('ignora ações desconhecidas', () => {
    const bogus = { type: 'SUMMON' } as unknown as RitualAction;
    expect(ritualReducer(initialRitualState, bogus)).toBe(initialRitualState);
  });
});

describe('ritualHint', () => {
  it('tem orientação para todas as fases', () => {
    for (const phase of ['idle', 'shuffling', 'shuffled', 'cutting', 'ready'] as const) {
      expect(ritualHint(phase).length).toBeGreaterThan(5);
    }
  });
});
