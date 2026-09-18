import React, { useState } from 'react';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { readingService } from '../../services/readingService';
import type { StartReadingResponse } from '../../types/session';
import { Sparkles, Heart, Compass, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QuestionStepProps {
  userName: string;
  sessionId: string;
  initialQuestion?: string;
  onEditName: () => void;
  onQuestionSubmitted: (response: StartReadingResponse) => void;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  userName,
  sessionId,
  initialQuestion = '',
  onEditName,
  onQuestionSubmitted,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StartReadingResponse | null>(null);

  const validateQuestion = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Por favor, escreva sua pergunta para a Moira.';
    }
    if (trimmed.length < 5) {
      return 'Conte um pouco mais sobre o que gostaria de olhar (mínimo de 5 caracteres).';
    }
    if (trimmed.length > 500) {
      return 'Sua pergunta não deve ultrapassar 500 caracteres.';
    }
    return null;
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validationError = validateQuestion(question);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await readingService.submitQuestion(
        {
          sessionId,
          userName,
          question: question.trim(),
        },
        simulateError
      );

      setSubmissionResult(response);
      onQuestionSubmitted(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro ao enviar sua pergunta.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Permite envio por teclado com Ctrl+Enter ou Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '48px',
        alignItems: 'start',
        width: '100%',
        maxWidth: '1120px',
        margin: '0 auto',
      }}
    >
      {/* Coluna Esquerda: Título Ritualístico e Pilares de Escuta */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '32px',
          textAlign: 'left',
          padding: '8px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '44px',
              lineHeight: '1.15',
              marginBottom: '16px',
              color: 'var(--text-main)',
            }}
          >
            O que você gostaria de olhar hoje?
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
            }}
          >
            Faça sua pergunta com calma. Quanto mais real e verdadeira for, mais significativa será a sua leitura.
          </p>
        </div>

        {/* Pilares com Ícones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FAF5EE',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-orange)',
                flexShrink: 0,
              }}
            >
              <Compass size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                Qualquer tema da sua vida
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Relacionamentos, decisões profissionais, finanças ou transições internas.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FAF5EE',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-plum)',
                flexShrink: 0,
              }}
            >
              <Heart size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                Um olhar gentil e sem julgamentos
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                A Moira escuta suas dúvidas com respeito, criando um espaço seguro de reflexão.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FAF5EE',
                border: '1px solid var(--border-subtle)',
                color: '#65A30D',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
                Respostas para novos caminhos
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Não certezas engessadas sobre o futuro, mas um espelho claro para agir no presente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Cartão com Textarea e Ações */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          textAlign: 'left',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Cabeçalho do Cartão com Nome Editável */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-faint)' }}>Consulente:</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
              {userName}
            </span>
          </div>
          <button
            type="button"
            onClick={onEditName}
            title="Alterar seu nome"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-plum)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            Alterar nome
          </button>
        </div>

        {/* Feedback de Erro da API / Rede com botão de Retry */}
        {apiError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--accent-error-bg)',
              border: '1px solid var(--accent-error-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-error)',
              fontSize: '14px',
            }}
          >
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Erro ao enviar pergunta</p>
              <p>{apiError}</p>
              <button
                type="button"
                onClick={() => handleFormSubmit()}
                style={{
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--accent-error)',
                  borderRadius: '4px',
                  color: 'var(--accent-error)',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} /> Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Confirmação de Envio Bem-sucedido (Feedback Visual) */}
        {submissionResult && (
          <div
            role="status"
            className="fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              backgroundColor: '#F7FCEB',
              border: '1px solid #D9ED92',
              borderRadius: 'var(--radius-sm)',
              color: '#2B5E05',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="#4D8B08" />
              <strong style={{ fontSize: '15px' }}>Pergunta acolhida com sucesso!</strong>
            </div>
            <p style={{ fontSize: '14px', color: '#3A6B0A' }}>
              {submissionResult.message}
            </p>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(255,255,255,0.6)',
                padding: '6px 10px',
                borderRadius: '4px',
                color: '#4B5563',
              }}
            >
              Protocolo da Leitura: {submissionResult.readingId}
            </div>
          </div>
        )}

        {/* Formulário Principal de Pergunta */}
        <form onSubmit={handleFormSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Textarea
            label="Sua pergunta"
            placeholder="Ex: Estou pensando em mudar de trabalho, mas sinto insegurança de perder a estabilidade. O que preciso compreender agora?"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            error={error || undefined}
            helperText="Pressione Ctrl + Enter ou clique no botão para enviar."
            charCount={{ current: question.length, max: 500 }}
            disabled={isLoading}
            autoFocus
          />

          <Button
            type="submit"
            variant="plum"
            isLoading={isLoading}
            disabled={isLoading}
            icon={<ArrowRight size={18} />}
          >
            Escolher minhas cartas
          </Button>

          {/* Ferramenta auxiliar de teste de estado de erro (acessível no rodapé do formulário) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-faint)',
            }}
          >
            <span>Sessão temporária segura</span>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Simular falha de rede para teste
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};
