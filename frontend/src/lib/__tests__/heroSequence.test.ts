import { describe, expect, it } from 'vitest';
import { HERO_TIMELINE, TYPING_LEAD_MS, isTypingAt, timelineDuration, visibleSteps } from '../heroSequence';

describe('heroSequence', () => {
  it('não mostra nada antes do primeiro passo', () => {
    expect(visibleSteps(0).size).toBe(0);
  });

  it('revela os passos em ordem cronológica', () => {
    const at = HERO_TIMELINE.find((b) => b.step === 'card1')!.at;
    const steps = visibleSteps(at);
    expect(steps.has('greeting')).toBe(true);
    expect(steps.has('question')).toBe(true);
    expect(steps.has('intro')).toBe(true);
    expect(steps.has('card1')).toBe(true);
    expect(steps.has('card2')).toBe(false);
  });

  it('mostra tudo ao final (e com movimento reduzido, via Infinity)', () => {
    expect(visibleSteps(timelineDuration()).size).toBe(HERO_TIMELINE.length);
    expect(visibleSteps(Number.POSITIVE_INFINITY).size).toBe(HERO_TIMELINE.length);
  });

  it('trata tempo inválido sem quebrar', () => {
    expect(visibleSteps(Number.NaN).size).toBe(0);
    expect(visibleSteps(-500).size).toBe(0);
    expect(isTypingAt(Number.NaN)).toBe(false);
    expect(isTypingAt(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it('a Moira "digita" apenas antes das mensagens dela', () => {
    const greeting = HERO_TIMELINE[0];
    expect(isTypingAt(greeting.at - TYPING_LEAD_MS / 2)).toBe(true);
    expect(isTypingAt(greeting.at)).toBe(false);

    const question = HERO_TIMELINE.find((b) => b.step === 'question')!;
    // logo antes da pergunta da consulente, ninguém está digitando
    expect(isTypingAt(question.at - 50)).toBe(false);
  });

  it('timeline vazia é segura', () => {
    expect(timelineDuration([])).toBe(0);
    expect(visibleSteps(1000, []).size).toBe(0);
  });
});
