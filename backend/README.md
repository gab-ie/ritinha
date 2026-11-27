# Backend do Sistema Rita

Fundação Django independente do React. O pacote `config` contém configurações, URLs e o endpoint de saúde. O app `accounts` concentra o modelo de usuário e sua configuração no Django Admin.

## Dependências

- Django 5.2 LTS para o projeto, as migrações e a autenticação.
- Django REST Framework 3.18 para a API.
- Psycopg 3 com distribuição binária para conectar ao PostgreSQL sem compilação local.
- python-dotenv para carregar `backend/.env`. Variáveis já definidas no ambiente têm prioridade.

As versões instaláveis estão fixadas em `requirements.txt`. A base usa Python 3.14 e PostgreSQL 18.

## Configuração local no PowerShell

Abra um terminal em `backend/`.

```powershell
python -m venv .venv
python -m pip --python .venv install -r requirements.txt
Copy-Item .env.example .env
```

Gere uma chave para o desenvolvimento local com o comando abaixo e guarde o resultado em `DJANGO_SECRET_KEY` no `.env`.

```powershell
.\.venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Preencha `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD` com os dados de um banco de desenvolvimento dedicado ao Rita. Se ele ainda não existir, solicite a criação do banco e de um usuário com permissão para criar tabelas nesse banco. Ajuste `POSTGRES_HOST` e `POSTGRES_PORT` se o servidor usar outro endereço. O Git deve incluir `.env.example`. O arquivo `.env` e o ambiente virtual estão na lista de exclusões.

Com o banco dedicado configurado, confira a conexão e revise o plano da primeira migração. Aplique as migrações somente após confirmar o banco de destino.

```powershell
.\.venv\Scripts\python.exe manage.py check --database default
.\.venv\Scripts\python.exe manage.py migrate --plan
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

`GET /api/health/` retorna HTTP 200 e `{"status":"ok"}`. O endpoint é público e indica que a API responde. A verificação de conexão com o banco é feita pelos comandos acima.

## Testes locais

```powershell
.\.venv\Scripts\python.exe manage.py check --settings=config.test_settings
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run --settings=config.test_settings
.\.venv\Scripts\python.exe manage.py test --settings=config.test_settings
```

As configurações de teste usam SQLite em memória e uma chave efêmera. O teste da rota de saúde usa `SimpleTestCase`, que bloqueia consultas ao banco durante o teste.

## Usuários e autorização

`AUTH_USER_MODEL` aponta para `accounts.User`, derivado de `AbstractUser`, desde a primeira migração do app. O campo `role` aceita `recepcao`, `enfermagem`, `medico` e `admin`. O valor em branco representa conta sem perfil de negócio atribuído. O perfil Administração representa o setor do Rita. O acesso ao Django Admin continua sujeito às flags e permissões nativas do Django.

Os próximos endpoints devem validar as permissões de operação e, quando aplicável, o acesso a cada registro. Grupos e permissões do Django permanecem disponíveis para essa etapa. A API exige autenticação por sessão por padrão, com exceção da rota pública de saúde.
