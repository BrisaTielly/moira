# PostgreSQL Backend Infrastructure Implementation Plan

> **For the agent:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Disponibilizar PostgreSQL local persistente e conectar o backend ASP.NET Core por configuração, com um health check que torne falhas identificáveis.

**Architecture:** O Docker Compose executará somente o PostgreSQL e manterá os dados em um volume nomeado. O backend terá um `MoiraDbContext` vazio, configurado com o provider Npgsql e uma connection string recebida por variável de ambiente; nenhuma entidade ou migration de produto será criada neste card.

**Tech Stack:** Docker Compose, PostgreSQL, ASP.NET Core 10, EF Core 10, Npgsql.

---

### Task 1: Configuração local do PostgreSQL

**Files:**
- Create: `compose.yaml`
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: Criar as variáveis de ambiente de exemplo**

Adicionar nomes de banco, usuário, senha e a connection string do backend em `.env.example`, usando somente credenciais locais de desenvolvimento.

**Step 2: Criar o serviço PostgreSQL**

Criar `compose.yaml` com imagem `postgres:17-alpine`, porta configurável, health check por `pg_isready` e volume nomeado `postgres_data` montado em `/var/lib/postgresql/data`.

**Step 3: Proteger configurações locais**

Adicionar `.env` ao `.gitignore`, preservando `.env.example` como documentação versionada.

**Step 4: Validar a configuração**

Run: `docker compose --env-file .env.example config`

Expected: configuração válida contendo o serviço `postgres` e o volume `postgres_data`.

### Task 2: Provider PostgreSQL e health check do backend

**Files:**
- Modify: `backend/backend.csproj`
- Modify: `backend/Program.cs`
- Create: `backend/Infrastructure/MoiraDbContext.cs`
- Create: `backend/HealthChecks/DatabaseHealthCheck.cs`

**Step 1: Adicionar o provider**

Adicionar `Npgsql.EntityFrameworkCore.PostgreSQL` compatível com EF Core 10.

**Step 2: Criar o contexto vazio de infraestrutura**

```csharp
public sealed class MoiraDbContext(DbContextOptions<MoiraDbContext> options)
    : DbContext(options);
```

O contexto não terá `DbSet` neste card.

**Step 3: Criar a verificação de conexão**

Implementar `IHealthCheck` usando `Database.CanConnectAsync`, retornando `Healthy` quando o PostgreSQL responder e `Unhealthy` com a exceção quando não responder.

**Step 4: Registrar infraestrutura no pipeline**

Ler `ConnectionStrings:Postgres`, falhar com mensagem clara quando ausente, registrar `UseNpgsql`, registrar o health check e mapear `GET /health/database` com resposta JSON.

**Step 5: Verificar o backend**

Run: `/home/brisa/.dotnet/dotnet build backend/backend.csproj`

Expected: build sem erros.

Run: `/home/brisa/.dotnet/dotnet test backend.Tests/backend.Tests.csproj`

Expected: todos os testes existentes passam.

### Task 3: Documentação e verificação integrada

**Files:**
- Create: `README.md`

**Step 1: Documentar execução local**

Documentar cópia de `.env.example`, subida do PostgreSQL, export das variáveis para o processo .NET, execução do backend e consulta a `/health/database`.

**Step 2: Subir o PostgreSQL**

Run: `docker compose --env-file .env.example up -d postgres`

Expected: container saudável.

**Step 3: Verificar persistência do volume**

Criar uma tabela temporária de prova, reiniciar o container sem remover o volume, confirmar que o dado permanece e remover a tabela de prova.

**Step 4: Verificar o health check**

Iniciar o backend com `ConnectionStrings__Postgres` carregada de `.env.example` e consultar `GET /health/database`.

Expected: HTTP 200 e status `Healthy`.

**Step 5: Revisar o escopo**

Confirmar que nenhuma entidade, migration ou tabela de produto foi adicionada e que somente os arquivos desta task serão versionados.
