# Moira · Decisões de arquitetura e pendências

> Registro vivo do que foi decidido, do que é **provisório** e do que precisa ser revisto.
> Atualize este arquivo sempre que uma pendência for resolvida ou uma decisão mudar.
> Última atualização: M1 (interpretação inicial com IA), setembro/2026.

---

## 1. Visão geral do fluxo (M1)

```
Navegador (React)                      Backend .NET                          Provedor de IA
─────────────────                      ────────────                          ──────────────
/leitura: nome + pergunta ──POST /api/readings/question──▶ valida + TRIAGEM DE RISCO
                                                           ├─ risco → "support" (CVV/SAMU), sem mesa
                                                           └─ ok → embaralha 22 arcanos (CSPRNG),
                                                                   guarda 12 na "mesa" (só no servidor)
ritual: embaralhar/cortar (animação local, efeito IKEA)
mesa: toca 3 de 12 cartas ──POST /{id}/draw {picks}──────▶ mapeia posição → arcano (idempotente)
revelação (cartas viram) ──POST /{id}/interpretation─────▶ contexto (pergunta+cartas+posições+significados)
                                                           → IInterpretationModel ─────────────▶ Groq (grátis)
                                                           ← JSON validado + guarda de saída     ou Template
leitura em "tinta" + convite 7 dias + oferta de continuidade (só depois da revelação)
```

- **O cliente nunca sabe quais cartas estão na mesa**: envia apenas índices (0–11). O servidor devolve as cartas depois da escolha.
- **Prompt e chave de API vivem só no backend**: o prompt é recurso embutido na DLL (`backend/Prompts/interpretation-system.md`) e a chave vem de `user-secrets`/variável de ambiente.
- **Repetir é seguro**: `draw` não troca cartas já escolhidas; `interpretation` é *single-flight* por leitura (várias chamadas = uma chamada ao modelo) e falhas não consomem a leitura gratuita.

### Endpoints

| Método | Rota | Resposta | Erros |
|---|---|---|---|
| POST | `/api/readings/question` | `status: ready \| support`, `tableSlots`, `cardsToPick`, `support?` | 400 validação · 402 `free_reading_used` · 429 limite por IP |
| POST | `/api/readings/{id}/draw` | cartas sorteadas (posição, arcano, palavras-chave) | 400 escolha inválida · 404 · 409 `support_only` |
| POST | `/api/readings/{id}/interpretation` | `status`, `cards`, `interpretation?`, `support?` | 404 · 409 `cards_not_drawn` · 402 · 503 `interpretation_unavailable` (retryable) · 429 |

Erros sempre no formato `{ code, error, retryable }`.

---

## 2. Como ligar a IA (Groq, plano gratuito)

Sem configuração nenhuma, o backend usa o **modelo de template** (leitura montada a partir do catálogo, sem IA e sem custo). Para usar um LLM:

1. Crie uma conta e uma chave em <https://console.groq.com/keys> (plano gratuito, sem cartão).
2. Na pasta `backend/`:
   ```bash
   dotnet user-secrets set "Moira:Llm:Provider" "OpenAICompatible"
   dotnet user-secrets set "Moira:Llm:ApiKey" "gsk_SUA_CHAVE"
   ```
3. `dotnet run` → o log mostra `Interpretação usando https://api.groq.com/openai/v1 (llama-3.3-70b-versatile)`.

Trocar de provedor = trocar `BaseUrl`, `Model` e `ApiKey` (qualquer API no formato OpenAI Chat Completions: OpenRouter, Mistral, OpenAI, Ollama local…).

**Por que Groq no teste:** gratuito, compatível com o formato OpenAI e, por contrato, não treina com os dados enviados. O Gemini gratuito, por exemplo, declara que usa o conteúdo do plano free para melhorar os produtos, o que é inadequado para perguntas íntimas.

---

## 3. Decisões tomadas no M1

| # | Decisão | Motivo |
|---|---|---|
| D1 | Sorteio com `RandomNumberGenerator` no servidor; mesa de 12 cartas; cliente só envia índices | Ninguém forja cartas pelo navegador; o gesto de escolher continua sendo da usuária (IKEA) |
| D2 | Tiragem de 3 cartas com posições **reflexivas**: "O que pesa", "O que sustenta", "O caminho" | Evitar "passado/presente/futuro", que sugere previsão |
| D3 | Só Arcanos Maiores (22), sempre na posição normal | Escopo enxuto do M1 |
| D4 | `IInterpretationModel` com 2 implementações: `TemplateInterpretationModel` e `OpenAiCompatibleModel` | Testável com fake; roda sem chave; troca de provedor sem mexer no domínio |
| D5 | Modelo responde **JSON estruturado** (abertura, 3 cartas, síntese, convite); parser rígido | A UI renderiza como página de grimório, não como chat; saída fora do formato vira fallback seguro |
| D6 | Resposta inteira (sem streaming) + animação de "tinta" no cliente | Mesmo efeito ritual do streaming com muito menos complexidade |
| D7 | Triagem de risco **antes** do modelo (regex pt-BR) + instrução no prompt + guarda de saída | Defesa em camadas; risco nunca chega ao LLM |
| D8 | Em risco: sem tarot, sem oferta; acolhimento com CVV 188, SAMU 192, 190 e 180 (violência) | Critério de segurança do card |
| D9 | Temas de saúde/jurídico/finanças: leitura acontece, com `careNote` e instrução de não prescrever | Reflexão sim, decisão profissional não |
| D10 | Degustação: 1 leitura completa por `sessionId`; oferta de continuidade só **após** a revelação | Timing do paywall (aha moment) e loop aberto (Zeigarnik) |
| D11 | Oferta de continuidade sem preço e sem urgência; o botão informa que os planos estão sendo preparados | Não existe pagamento ainda; nada de promessa falsa |
| D12 | Rate limit por IP: 30 req/10 min (pergunta/escolha) e 10 req/10 min (interpretação) | Proteger a cota gratuita do provedor enquanto não há contas |
| D13 | Frontend chama `/api` relativo; o Vite faz proxy para `http://localhost:5152` | Sem URL de backend nem CORS no código do navegador em dev |

---

## 4. Pendências e itens provisórios (revisar antes de produção)

### Persistência e identidade
- [ ] **Armazenamento em memória** (`InMemoryReadingStore`, `InMemoryFreeReadingPolicy`, `InterpretationCache`): tudo se perde ao reiniciar e não funciona com mais de uma instância. → Banco de dados (leituras, sessões, grimório) quando houver.
- [ ] **TTL de 24h** das leituras em memória é arbitrário. → Definir junto com o Grimório Pessoal.
- [ ] **Limite gratuito por `sessionId` é contornável** (limpar o navegador gera outra sessão). O rate limit por IP só reduz abuso. → Contas de usuária ou fingerprint leve e ético (avaliar LGPD).
- [ ] **CLAUDE.md pede nome + data de nascimento** na primeira tiragem; hoje só o nome é coletado. → Adicionar data de nascimento (arquétipo/número pessoal) e levar ao contexto do prompt (efeito Forer).

### IA e conteúdo
- [ ] **Provedor gratuito é para teste.** Limites da Groq free (≈30 req/min, ≈1.000 req/dia, ≈200 mil tokens/dia) e o catálogo de modelos mudam sem aviso. → Escolher o modelo definitivo (qualidade em pt-BR, custo por leitura, política de dados) e medir custo por leitura.
- [ ] **Modelo padrão `llama-3.3-70b-versatile`**: validar a qualidade em pt-BR contra `openai/gpt-oss-120b` e outros; ajustar `Temperature`/`MaxTokens`.
- [ ] **Prompt versionado só no código.** → Versionar prompts (ex.: `interpretation-system.v2.md`), registrar qual versão gerou cada leitura e criar avaliação com leituras de referência.
- [ ] **Textos do catálogo de arcanos** foram escritos para o M1; precisam de curadoria de conteúdo (tom da marca, revisão por tarólogo(a)).
- [ ] **Cartas invertidas, Arcanos Menores e outras tiragens**: fora do M1.
- [ ] **Ilustrações das cartas**: hoje são glifos provisórios (5 desenhos + selo com numeral). → Substituir pela arte final do baralho Moira.
- [ ] **Streaming** da interpretação (SSE) se o tempo de resposta do modelo definitivo passar de ~6 s.

### Segurança
- [ ] **Triagem de risco é heurística por palavras-chave** (tende a falso positivo, pode deixar escapar frases indiretas). → Complementar com um classificador dedicado (ex.: modelo de moderação) e revisar a lista com profissional de saúde mental.
- [ ] **Guarda de saída por regex** cobre padrões conhecidos. → Somar uma checagem por modelo leve ou revisão amostral.
- [ ] **Logs**: hoje não registramos o texto das perguntas (só IDs e motivos de fallback). Manter assim e definir política de retenção/LGPD antes de persistir qualquer conteúdo.
- [ ] **HTTPS/CORS de produção**: CORS está liberado só para `localhost:5173/3000`. → Configurar domínio real, HTTPS e cabeçalhos de segurança no deploy.
- [ ] **Recursos de apoio são do Brasil** (CVV, SAMU, 190, 180). → Se houver público de outros países, localizar.

### Produto / conversão
- [ ] **Paywall é um placeholder** (`ContinuationTeaser`): sem preço nem checkout. → Integrar pagamento e planos; manter a regra de só exibir após a revelação.
- [ ] **Card para Stories, conversa contínua, ciclo de 7 dias e Grimório** aparecem como itens bloqueados. → Cards futuros (conversa e memória estão explicitamente fora do M1).
- [ ] **"Rever minha leitura"** depende da leitura ainda estar na memória do servidor (24h / até reiniciar).

### Qualidade
- [ ] **Os testes .NET foram escritos sem compilar no ambiente de desenvolvimento do Claude** (sem SDK disponível). Rodar `dotnet build` e `dotnet test` localmente e corrigir o que aparecer.
- [ ] **Não há CI.** → GitHub Actions com `dotnet test`, `npm test`, `npm run lint` e `npm run build`.
- [ ] Testes de componente React (Testing Library + jsdom) não foram adicionados para não trazer dependências novas; a lógica do fluxo está coberta por testes puros (`readingFlow`, `apiClient`). → Avaliar quando a UI estabilizar.

---

## 5. Onde está cada coisa

| Tema | Arquivo |
|---|---|
| Catálogo e posições | `backend/Domain/Arcana.cs`, `backend/Domain/ArcanaCatalog.cs` |
| Sorteio, sessão, degustação | `backend/Services/Readings/*`, `backend/Services/ReadingService.cs` |
| Triagem, acolhimento, guarda de saída | `backend/Services/Safety/*` |
| Prompt | `backend/Prompts/interpretation-system.md` |
| Interpretação (contrato, modelos, parser, serviço) | `backend/Services/Interpretation/*` |
| Rate limit | `backend/RateLimitPolicies.cs` |
| Configuração | `backend/appsettings.json` (seção `Moira`) + user-secrets |
| Roteiro manual reproduzível | `backend/roteiro-m1.http` |
| Testes backend | `tests/Moira.Backend.Tests/` → `dotnet test tests/Moira.Backend.Tests` |
| Fluxo do painel (lógica pura) | `frontend/src/lib/readingFlow.ts` (+ testes) |
| Cliente da API | `frontend/src/services/apiClient.ts`, `readingService.ts` (+ testes) |
| UI do ritual | `frontend/src/components/reading/*`, `frontend/src/styles/reading.css` |
