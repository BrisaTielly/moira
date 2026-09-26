import React, { useState } from 'react';
import { Compass, Heart, Sparkles, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { readingService } from '../../services/readingService';
import { ApiError } from '../../services/apiClient';
import type { StartReadingResponse } from '../../types/session';

interface InteractiveReadingSectionProps {
  userName?: string;
  sessionId: string;
  initialQuestion?: string;
  onSaveName: (name: string) => void;
  onEditName: () => void;
  onQuestionSubmitted: (response: StartReadingResponse) => void;
  /** Chamado quando a sessão já usou a leitura gratuita (402). */
  onFreeReadingUsed?: () => void;
}

export const InteractiveReadingSection: React.FC<InteractiveReadingSectionProps> = ({
  userName,
  sessionId,
  initialQuestion = '',
  onSaveName,
  onEditName,
  onQuestionSubmitted,
  onFreeReadingUsed,
}) => {
  // Estado local para coleta de nome (se ainda não preenchido)
  const [nameInput, setNameInput] = useState(userName || '');
  const [nameError, setNameError] = useState<string | null>(null);

  // Estado local para formulação da pergunta
  const [question, setQuestion] = useState(initialQuestion);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StartReadingResponse | null>(null);

  // Validação do nome
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Por favor, informe como gostaria de ser chamada.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }
    if (trimmed.length > 50) {
      setNameError('O nome não deve ultrapassar 50 caracteres.');
      return;
    }
    setNameError(null);
    onSaveName(trimmed);
  };

  // Validação e envio da pergunta
  const handleQuestionSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setQuestionError('Por favor, escreva o que gostaria de perguntar às cartas.');
      return;
    }
    if (trimmedQuestion.length < 5) {
      setQuestionError('Por favor, formule uma pergunta com ao menos 5 caracteres.');
      return;
    }
    if (trimmedQuestion.length > 500) {
      setQuestionError('Sua pergunta não deve ultrapassar 500 caracteres.');
      return;
    }

    setQuestionError(null);
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await readingService.submitQuestion(
        {
          sessionId,
          userName: userName || nameInput.trim(),
          question: trimmedQuestion,
        },
        simulateError
      );

      setSubmissionResult(response);
      onQuestionSubmitted(response);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 'free_reading_used' && onFreeReadingUsed) {
        onFreeReadingUsed();
        return;
      }
      const message = err instanceof Error ? err.message : 'Falha ao enviar sua pergunta ao santuário.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleQuestionSubmit();
    }
  };

  return (
    <section
      id="leitura"
      style={{
        width: '100%',
        padding: '56px 24px 96px',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* Caso 1: Usuário ainda não informou o nome */}
        {!userName ? (
          <>
            <Reveal variant="left">
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--brand-plum)',
                }}
              >
                ✦ Sua leitura começa aqui
              </span>

              <h2
                style={{
                  fontSize: 'clamp(32px, 4vw, 46px)',
                  lineHeight: '1.15',
                  color: 'var(--text-main)',
                }}
              >
                Como posso te chamar?
              </h2>

              <p
                style={{
                  fontSize: '18px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                }}
              >
                Só o nome ou apelido que você prefere. O resto vem depois, com calma e no seu tempo.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--brand-plum)' }}>✓</span>
                  <span>Sem necessidade de cadastro, senha ou e-mail agora</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--brand-plum)' }}>✓</span>
                  <span>Sua sessão fica associada a este navegador</span>
                </div>
              </div>
            </div>

            </Reveal>

            {/* Card para digitar o nome */}
            <Reveal variant="scale" delay={120}>
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'left',
              }}
            >
              <form onSubmit={handleNameSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    htmlFor="name-input"
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Seu nome
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="name-input"
                      type="text"
                      placeholder="Escreva aqui seu nome..."
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        fontSize: '16px',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--text-main)',
                        backgroundColor: '#FFFFFF',
                        border: nameError ? '1.5px solid var(--accent-error)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  {nameError && (
                    <span role="alert" style={{ fontSize: '13px', color: 'var(--accent-error)' }}>
                      ⚠ {nameError}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-pill btn-plum"
                  style={{ width: '100%', padding: '14px', fontSize: '16px' }}
                >
                  Continuar para minha pergunta
                  <ArrowRight size={18} />
                </button>

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-faint)' }}>
                  Ao continuar, você inicia sua primeira tiragem completa.
                </p>
              </form>
            </div>
            </Reveal>
          </>
        ) : (
          /* Caso 2: Nome já cadastrado/lembrado -> Tela de Pergunta (V2 Seção 02) */
          <>
            {/* Lado Esquerdo: Headline & 3 Pilares (V2) */}
            <Reveal variant="left">
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: 'var(--brand-plum)',
                  }}
                >
                  Sua pergunta · Passo 1 de 3
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(32px, 4vw, 44px)',
                    lineHeight: '1.15',
                    color: 'var(--text-main)',
                    marginTop: '8px',
                  }}
                >
                  O que você gostaria de olhar hoje?
                </h2>

                <p
                  style={{
                    fontSize: '17px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginTop: '12px',
                  }}
                >
                  Faça sua pergunta com calma. Quanto mais real e verdadeira for, mais significativa será a sua leitura.
                </p>
              </div>

              {/* 3 Pilares com Ícones do Mockup V2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-plum)',
                      flexShrink: 0,
                    }}
                  >
                    <Compass size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-main)' }}>
                      Qualquer tema da sua vida
                    </strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Trabalho, relacionamentos, escolhas difíceis ou sentimentos confusos.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-plum)',
                      flexShrink: 0,
                    }}
                  >
                    <Heart size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-main)' }}>
                      Um olhar gentil e sem julgamentos
                    </strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Um ambiente seguro para clarear pensamentos e acolher suas dúvidas.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-plum)',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-main)' }}>
                      Respostas para novos caminhos
                    </strong>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      Não uma sentença do destino, mas clareza prática para os seus próximos passos.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            </Reveal>

            {/* Lado Direito: Card com a Textarea da Pergunta */}
            <Reveal variant="scale" delay={120}>
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Barra superior de identificação do consulente (editável) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--brand-plum)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>Consulente:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{userName}</strong>
                </div>
                <button
                  type="button"
                  onClick={onEditName}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-plum)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Alterar nome
                </button>
              </div>

              {/* Banner de Erro da API com Retry */}
              {apiError && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--accent-error-bg)',
                    border: '1px solid var(--accent-error-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-error)',
                    fontSize: '14px',
                  }}
                >
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>Erro ao enviar</p>
                    <p style={{ marginTop: '2px' }}>{apiError}</p>
                    <button
                      type="button"
                      onClick={() => handleQuestionSubmit()}
                      style={{
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: '1px solid var(--accent-error)',
                        borderRadius: '4px',
                        color: 'var(--accent-error)',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCcw size={12} /> Tentar novamente
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback de Confirmação do Contrato */}
              {submissionResult && (
                <div
                  role="status"
                  className="fade-in"
                  style={{
                    padding: '16px',
                    backgroundColor: '#F3F9F1',
                    border: '1px solid #C9E5C3',
                    borderRadius: '12px',
                    color: '#28581F',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#357D28" />
                    <strong style={{ fontSize: '15px' }}>Pergunta acolhida com sucesso!</strong>
                  </div>
                  <p style={{ fontSize: '13px', color: '#315C28' }}>
                    {submissionResult.message}
                  </p>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#556B51' }}>
                    Protocolo: {submissionResult.readingId}
                  </div>
                </div>
              )}

              {/* Formulário da Pergunta */}
              <form onSubmit={handleQuestionSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label
                      htmlFor="question-textarea"
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Sua pergunta
                    </label>
                    <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                      {question.length}/500
                    </span>
                  </div>

                  <textarea
                    id="question-textarea"
                    placeholder="Estou pensando em mudar de trabalho, mas tenho medo de perder estabilidade..."
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      if (questionError) setQuestionError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                    style={{
                      width: '100%',
                      minHeight: '130px',
                      padding: '16px',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--text-main)',
                      backgroundColor: '#FFFFFF',
                      border: questionError ? '1.5px solid var(--accent-error)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />

                  {questionError ? (
                    <span role="alert" style={{ fontSize: '13px', color: 'var(--accent-error)' }}>
                      ⚠ {questionError}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                      Pressione Ctrl + Enter para enviar
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-pill btn-plum"
                  style={{ width: '100%', padding: '14px', fontSize: '16px' }}
                >
                  {isLoading ? 'Acolhendo sua pergunta...' : 'Escolher minhas cartas'}
                  <ArrowRight size={18} />
                </button>

                {/* Switch de teste de erro para validação da task M1 (somente em desenvolvimento) */}
                {import.meta.env.DEV && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-faint)',
                  }}
                >
                  <span>Sessão local segura</span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={simulateError}
                      onChange={(e) => setSimulateError(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Simular erro de rede
                  </label>
                </div>
                )}
              </form>
            </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
};
