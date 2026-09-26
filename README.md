# Moira

## Banco de dados local

Pré-requisitos: Docker com Compose e .NET 10.

1. Crie a configuração local a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

2. Suba o PostgreSQL:

   ```bash
   docker compose up -d postgres
   docker compose ps
   ```

3. Carregue as variáveis no terminal e execute o backend:

   ```bash
   set -a
   source .env
   set +a
   dotnet run --project backend --launch-profile http
   ```

4. Em outro terminal, verifique a conexão:

   ```bash
   curl http://localhost:5152/health/database
   ```

Uma conexão disponível responde com HTTP `200` e status `Healthy`. Quando a configuração está incorreta ou o PostgreSQL está indisponível, o endpoint responde com HTTP `503` e identifica a verificação `postgres` como `Unhealthy`.

Para encerrar os serviços sem apagar os dados:

```bash
docker compose down
```

O volume `moira_postgres_data` mantém os dados entre recriações do container. Não use `docker compose down --volumes` se quiser preservá-los.

As entidades e migrations do produto não fazem parte desta configuração inicial.
