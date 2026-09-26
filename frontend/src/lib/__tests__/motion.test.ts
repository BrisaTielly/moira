import { describe, expect, it } from 'vitest';
import { clamp, pageProgress, sectionProgress, staggerDelay } from '../motion';

describe('clamp', () => {
  it('limita ao intervalo e trata NaN', () => {
    expect(clamp(2)).toBe(1);
    expect(clamp(-1)).toBe(0);
    expect(clamp(0.4)).toBe(0.4);
    expect(clamp(Number.NaN)).toBe(0);
  });
});

describe('sectionProgress', () => {
  it('é 0 antes da seção cruzar a linha de leitura', () => {
    expect(sectionProgress(900, 1000, 800)).toBe(0);
  });
  it('cresce enquanto a seção atravessa a linha', () => {
    // linha em 480px; topo a -20px => 500/1000
    expect(sectionProgress(-20, 1000, 800)).toBeCloseTo(0.5);
  });
  it('é 1 quando a seção já passou', () => {
    expect(sectionProgress(-5000, 1000, 800)).toBe(1);
  });
  it('medidas inválidas retornam 0 em vez de NaN/Infinity', () => {
    expect(sectionProgress(0, 0, 800)).toBe(0);
    expect(sectionProgress(0, 1000, 0)).toBe(0);
    expect(sectionProgress(Number.NaN, 1000, 800)).toBe(0);
  });
});

describe('pageProgress', () => {
  it('calcula a fração rolada', () => {
    expect(pageProgress(500, 2000, 1000)).toBe(0.5);
  });
  it('página sem rolagem é 0', () => {
    expect(pageProgress(0, 800, 1000)).toBe(0);
  });
  it('overscroll (iOS) fica entre 0 e 1', () => {
    expect(pageProgress(-40, 2000, 1000)).toBe(0);
    expect(pageProgress(1200, 2000, 1000)).toBe(1);
  });
});

describe('staggerDelay', () => {
  it('escalona e respeita o teto', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(3, 100)).toBe(300);
    expect(staggerDelay(50, 100, 0, 600)).toBe(600);
  });
  it('índices inválidos caem no atraso base', () => {
    expect(staggerDelay(-1, 100, 40)).toBe(40);
    expect(staggerDelay(Number.NaN, 100, 40)).toBe(40);
  });
});

import { inkSchedule } from '../inkSchedule';

describe('inkSchedule', () => {
  it('encadeia seções pelo número de palavras', () => {
    expect(inkSchedule([{ text: 'um dois três' }, { text: 'quatro', gap: 100 }], 0, 10)).toEqual([0, 530, 640]);
  });
  it('texto vazio não quebra a sequência', () => {
    expect(inkSchedule([{ text: '   ' }], 0, 10)).toEqual([0, 500]);
  });
});
