# Публикация сайта

Порядок публикации сайта и устройство production. Все пути к файлам проекта указаны относительно корня репозитория.

## Публикация на mandagram.com

Production публикуется из ветки `release` через `.github/workflows/deploy.yml`. Каждый push собирает статический сайт на Node.js 22 с `npm ci`, передаёт архив по SSH и проверяет SHA на `https://mandagram.com/deployment.txt`. Ручной запуск workflow также разрешён только для `release`; `main` и `dev` не деплоятся.

Разработку ведите в рабочих ветках от `dev`, не в `main` или `release`. Коммиты — Conventional Commits с scope и перечислением изменений в body. Публикация принятого состояния — отдельная операция:

```bash
git fetch origin
git switch release
git merge --ff-only origin/main
git push origin release
```

Если fast-forward невозможен, выясните расхождение; не используйте force push.

На сервере `ssh mandagram` сайт обслуживает Caddy с автоматически обновляемым HTTPS-сертификатом. Конфигурация: `deploy/Caddyfile` → `/etc/caddy/Caddyfile`. Статика: `/srv/mandagram/releases/<SHA>`, активный сайт — атомарно переключаемая ссылка `/srv/mandagram/current`. Предыдущие версии сохраняются для ручного отката; следите за свободным местом в `releases`.

Actions использует пользователя `mandagram-deploy` без sudo. Его SSH-ключ ограничен командой `/usr/local/bin/mandagram-landing-deploy` (исходник `deploy/receive.sh`), без shell, PTY и перенаправления портов. Приватный ключ хранится только в секрете `DEPLOY_SSH_KEY`; переменные `DEPLOY_HOST` и `DEPLOY_KNOWN_HOSTS` задают адрес и проверенный ключ сервера. При смене сервера/host key обновите переменные; receiver и Caddyfile устанавливаются через административный SSH. Не коммитьте ключи и серверные секреты.

Cloudflare проксирует `mandagram.com` на origin с публичным HTTPS-сертификатом, совместимым с Full (strict). API-токен Cloudflare для деплоя не нужен. `/deployment.txt` отдаётся с `Cache-Control: no-store`, файлы `/_a/` — с immutable-кешем.

## См. также

- [Разработка сайта](development.md)
- [База знаний и SDK](content.md)
- [Правила Git](git.md)
- [О проекте](../README.md)
