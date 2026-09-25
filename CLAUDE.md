# Diretrizes do Projeto: Tarot SaaS

## Contexto & ICP
- SaaS Web de tarot + IA focado em experiência ritualística, imersiva e de alta recorrência.
- ICP: Mulheres de 25 a 45 anos que valorizam autoconhecimento, rituais e simbolismo místico.
- A primeira tiragem exige apenas nome e data de nascimento; a experiência deve soar como um software proprietário com identidade única, não um wrapper genérico de chatbot.
- A tiragem ocorre em painel dedicado, separado do diálogo interpretativo.

## Economia Comportamental & Conversão (Psicologia de Venda Ética)
Toda funcionalidade, tela ou cópia desenvolvida deve ancorar-se em pelo menos um destes vieses:
- **Efeito IKEA (Investimento Psicológico):** Antes da leitura final, exija micro-compromissos do usuário (embaralhar cartas, cortar o baralho, definir intenção). Quanto maior o ritual ativo, maior o valor percebido do resultado.
- **Efeito Forer/Barnum Refinado:** A interpretação deve espelhar arquétipos profundos e ressonantes a partir do nome e data de nascimento[cite: 1], gerando validação emocional imediata ("isso me descreve perfeitamente").
- **Efeito Zeigarnik (Loops Abertos):** Entregue a resposta principal sem travas, mas encerre a leitura abrindo um ciclo futuro (ex: ciclos lunares, energia para os próximos 7 dias ou desdobramentos da carta guia) para ancorar a segunda sessão e planos recorrentes[cite: 1].
- **Endowment Effect (Sensação de Posse):** Trate o histórico do usuário não como logs, mas como um "Diário Místico" ou "Grimório Pessoal". O custo de saída aumenta conforme a jornada se acumula.
- **Timing do Paywall (Aha Moment):** O gatilho de assinatura/venda nunca surge antes da primeira entrega de valor[cite: 1]. O paywall aparece imediatamente após o pico da revelação emocional (quando a dopamina e a relevância subjetiva estão no auge).
- **Prova Social por Identidade:** Resultados devem ser exportáveis em cards estéticos (Instagram/Stories)[cite: 1], não como autopromoção do app, mas como afirmação de identidade da usuária.

## Stack Técnica & Arquitetura
- Backend: .NET (MVC + Services)[cite: 1]. Controllers finos, lógica de negócio isolada em Services[cite: 1].
- Frontend: React + TypeScript[cite: 1]. Componentização limpa, sem lógica de domínio dentro de hooks de UI[cite: 1].
- Princípios: Arquitetura enxuta (KISS), sem dependências externas prematuras[cite: 1].

## Hard Rules
- NUNCA use gatilhos de medo, falsa urgência ("restam 2 minutos"), maldições ou claims premonitórios falsos[cite: 1].
- Testes não devem ser alterados para mascarar regressões; corrija a implementação[cite: 1].
- Não altere `.env`, secrets ou realize migrations destrutivas sem ordem direta[cite: 1].
- Todo novo fluxo de conversão ou ritual de UI deve vir acompanhado de testes de integração/unidade cobrindo cenários com falha[cite: 1].