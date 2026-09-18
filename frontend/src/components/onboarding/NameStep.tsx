import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface NameStepProps {
  initialName?: string;
  onSaveName: (name: string) => void;
}

export const NameStep: React.FC<NameStepProps> = ({
  initialName = '',
  onSaveName,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Por favor, informe seu nome ou como você gostaria de ser chamada.';
    }
    if (trimmed.length < 2) {
      return 'O nome precisa ter pelo menos 2 caracteres.';
    }
    if (trimmed.length > 50) {
      return 'O nome não deve ultrapassar 50 caracteres.';
    }
    // Permite letras, acentos, espaços e hifens
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/;
    if (!nameRegex.test(trimmed)) {
      return 'Por favor, utilize apenas letras e espaços.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    // Transição suave para o próximo passo
    setTimeout(() => {
      onSaveName(name.trim());
      setIsSubmitting(false);
    }, 150);
  };

  return (
    <div
      className="fade-in"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Coluna Esquerda: Ilustração & Inspiração Ritualística */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px',
          padding: '16px',
        }}
      >
        <div style={{ maxWidth: '380px' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontStyle: 'italic',
              lineHeight: '1.4',
              color: 'var(--text-main)',
              marginBottom: '16px',
            }}
          >
            “Toda conversa começa quando alguém chama você pelo nome.”
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
            }}
          >
            A Moira é um santuário de escuta e clareza. Diga-nos apenas como se sente confortável em ser recebida hoje.
          </p>
        </div>

        {/* Gravura Ritualística Vectorial (Estilo Linocut do Portal) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1 / 1.15',
            backgroundColor: '#1C1917',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(28, 25, 23, 0.15)',
            border: '2px solid #1C1917',
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 380 440"
            style={{ width: '100%', height: '100%' }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Céu noturno escuro com textura */}
            <rect width="380" height="440" fill="#181615" />
            
            {/* Montanhas distantes com textura linocut */}
            <path d="M0 320L60 270L140 310L220 260L320 330L380 300V440H0V320Z" fill="#241E26" />
            <path d="M60 270L140 310L90 350Z" fill="#3D2B4A" opacity="0.6" />
            <path d="M220 260L320 330L260 360Z" fill="#3D2B4A" opacity="0.6" />

            {/* Portal central em arco de pedra */}
            <path
              d="M110 440V220C110 175.8 145.8 140 190 140C234.2 140 270 175.8 270 220V440H110Z"
              fill="#181615"
              stroke="#D4CEBE"
              strokeWidth="6"
              strokeDasharray="8 4"
            />

            {/* Brilho verde chartreuse do portal */}
            <circle cx="190" cy="200" r="54" fill="#C4DE2B" />
            {/* Estrela de 8 pontas radiante dentro do sol/portal */}
            <path
              d="M190 152L194 186L228 190L194 194L190 228L186 194L152 190L186 186Z"
              fill="#FFFFFF"
            />

            {/* Escadaria em perspectiva subindo até o arco */}
            <polygon points="120,440 260,440 240,360 140,360" fill="#2E2827" stroke="#E3DBD0" strokeWidth="2" />
            <polygon points="135,360 245,360 230,300 150,300" fill="#3A3331" stroke="#E3DBD0" strokeWidth="2" />
            <polygon points="148,300 232,300 220,250 160,250" fill="#4B4240" stroke="#E3DBD0" strokeWidth="2" />
            <polygon points="158,250 222,250 210,215 170,215" fill="#5F5451" stroke="#E3DBD0" strokeWidth="2" />

            {/* Ciprestes místicos nas laterais */}
            <path d="M70 360 C65 300, 68 240, 75 220 C82 240, 85 300, 80 360 Z" fill="#12100F" />
            <path d="M90 380 C86 320, 89 270, 95 250 C101 270, 104 320, 100 380 Z" fill="#12100F" />
            <path d="M290 370 C285 310, 288 260, 295 240 C302 260, 305 310, 300 370 Z" fill="#12100F" />
            <path d="M310 390 C306 330, 309 280, 315 260 C321 280, 324 330, 320 390 Z" fill="#12100F" />

            {/* Fases da Lua (Tripla Lua) na lateral direita em púrpura */}
            <circle cx="340" cy="80" r="14" fill="#6A468F" />
            <path d="M336 46C344 52 348 64 348 74C348 84 344 96 336 102C348 94 354 84 354 74C354 64 348 54 336 46Z" fill="#6A468F" />
            <path d="M344 46C336 52 332 64 332 74C332 84 336 96 344 102C332 94 326 84 326 74C326 64 332 54 344 46Z" fill="#6A468F" />

            {/* Estrela de 8 pontas em laranja quente na esquerda inferior */}
            <g transform="translate(45, 110)">
              <path
                d="M0 -22L4 -7L19 -19L7 -4L22 0L7 4L19 19L4 7L0 22L-4 7L-19 19L-7 4L-22 0L-7 -4L-19 -19L-4 -7Z"
                fill="#E65A28"
              />
            </g>

            {/* Silhueta da figura ascendendo as escadas */}
            <path
              d="M185 340 C182 330, 184 320, 190 318 C196 320, 198 330, 195 340 L202 385 C195 390, 185 390, 178 385 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
            <circle cx="190" cy="312" r="6" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Coluna Direita: Card de Onboarding com o Formulário */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 40px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          textAlign: 'left',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '42px',
              lineHeight: '1.15',
              marginBottom: '12px',
              color: 'var(--text-main)',
            }}
          >
            Como posso te chamar?
          </h1>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
            }}
          >
            Só o nome que você prefere. O resto vem depois.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Input
            label="Seu nome"
            placeholder="Escreva aqui..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            error={error || undefined}
            autoFocus
            maxLength={50}
            autoComplete="name"
          />

          <Button
            type="submit"
            variant="lime"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Continuar
          </Button>

          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--text-faint)',
              marginTop: '4px',
            }}
          >
            Você não precisa criar uma conta agora.
          </p>
        </form>
      </div>
    </div>
  );
};
