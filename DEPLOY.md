# Деплой Timax

## Перед деплоем

1. Установить зависимости:

```bash
npm install
```

2. Настроить переменные окружения по примеру из `.env.example`.

3. Применить схему базы:

```bash
npm run db:push
```

4. Проверить production-сборку:

```bash
npm run build
```

5. Запустить production-сервер:

```bash
npm run start
```

## База данных

Сейчас проект использует Prisma и SQLite через `DATABASE_URL`. Для VPS или обычного Node-сервера можно оставить `file:./dev.db`, если файл базы хранится на постоянном диске.

Для Vercel/других serverless-платформ локальный SQLite-файл не подходит для реальных заявок: файловая система там обычно временная. Для такого деплоя лучше заменить `DATABASE_URL` на постоянную базу, например PostgreSQL, Prisma Postgres или Turso, и выполнить `npm run db:push` уже для новой базы.

## Рекомендуемый недорогой вариант

Для текущего проекта самый простой и дешевый путь — VPS с Ubuntu, Nginx, Node.js и SQLite-файлом на диске сервера.

Минимум для старта:

- 1 vCPU
- 1 ГБ RAM
- 10 ГБ SSD/NVMe
- Ubuntu 24.04 или новее
- публичный IPv4

Лучше, если бюджет позволяет:

- 1 vCPU
- 2 ГБ RAM
- 15-20 ГБ SSD/NVMe

На сервере с 1 ГБ RAM обязательно добавь swap, иначе установка зависимостей или сборка могут упереться в память.

## Первый деплой на VPS

Ниже пример для домена `example.ru`, IP `SERVER_IP` и папки `/var/www/timax`. Замени их на свои значения.

### 1. Создать сервер

1. Заказать VPS.
2. Выбрать Ubuntu 24.04/26.04.
3. Получить IP сервера.
4. В DNS домена добавить A-запись:

```text
@     A     SERVER_IP
www   A     SERVER_IP
```

### 2. Подключиться к серверу

```bash
ssh root@SERVER_IP
```

### 3. Установить базовые пакеты

```bash
apt update && apt upgrade -y
apt install -y curl git nginx certbot python3-certbot-nginx rsync sqlite3
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

### 4. Установить Node.js

Next.js 16 требует Node.js `>=20.9.0`. Для продакшена можно поставить Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

### 5. Добавить swap для маленького VPS

Для сервера с 1 ГБ RAM:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

### 6. Создать папку проекта

```bash
mkdir -p /var/www/timax
id -u timax >/dev/null 2>&1 || useradd --system --user-group --home-dir /var/www/timax --shell /usr/sbin/nologin timax
chown -R timax:timax /var/www/timax
```

### 7. Загрузить проект с локального компьютера

Команду выполняй на своем компьютере из папки проекта:

```bash
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env \
  --exclude .DS_Store \
  --exclude 'prisma/*.db' \
  ./ root@SERVER_IP:/var/www/timax/
ssh root@SERVER_IP 'chown -R timax:timax /var/www/timax'
```

### 8. Настроить `.env` на сервере

На сервере:

```bash
cd /var/www/timax
nano .env
```

Пример:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="strong-admin-password"
ADMIN_SECRET="long-random-secret-at-least-32-chars"
TELEGRAM_BOT_TOKEN="telegram-bot-token"
TELEGRAM_CHAT_ID="123456789"
TELEGRAM_NOTIFY_TIMEOUT_MS="10000"
TELEGRAM_TIME_ZONE="Europe/Moscow"
```

Сгенерировать `ADMIN_SECRET` можно так:

```bash
openssl rand -hex 32
```

Закрыть файл с секретами:

```bash
chown timax:timax .env
chmod 600 .env
```

### 9. Установить зависимости и собрать проект

```bash
cd /var/www/timax
runuser -u timax -- npm ci
runuser -u timax -- npm run db:push
runuser -u timax -- npm run build
```

Если база пустая и нужны стартовые услуги, портфолио и отзывы:

```bash
runuser -u timax -- npm run db:seed
```

Не запускай `npm run db:seed` после появления реальных заявок: seed очищает таблицы и перезаписывает демо-данные.

### 10. Запустить через systemd

Создать сервис:

```bash
nano /etc/systemd/system/timax.service
```

Содержимое:

```ini
[Unit]
Description=Timax Next.js app
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/timax
User=timax
Group=timax
Environment=NODE_ENV=production
EnvironmentFile=/var/www/timax/.env
ExecStart=/usr/bin/npm run start -- -H 127.0.0.1 -p 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Включить и запустить:

```bash
systemctl daemon-reload
systemctl enable timax
systemctl start timax
systemctl status timax
```

Логи:

```bash
journalctl -u timax -f
```

### 11. Настроить Nginx

Создать конфиг:

```bash
nano /etc/nginx/sites-available/timax
```

Содержимое:

```nginx
server {
    listen 80;
    server_name example.ru www.example.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активировать:

```bash
ln -s /etc/nginx/sites-available/timax /etc/nginx/sites-enabled/timax
nginx -t
systemctl reload nginx
```

### 12. Подключить HTTPS

Когда DNS уже указывает на сервер:

```bash
certbot --nginx -d example.ru -d www.example.ru
certbot renew --dry-run
```

### 13. Проверить Telegram

```bash
cd /var/www/timax
npm run telegram:test
```

После этого проверь:

- главную страницу
- отправку заявки
- вход в `/admin`
- появление заявки в админке
- Telegram-уведомление

## Обновление проекта

На локальном компьютере из папки проекта:

```bash
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env \
  --exclude .DS_Store \
  --exclude 'prisma/*.db' \
  ./ root@SERVER_IP:/var/www/timax/
ssh root@SERVER_IP 'chown -R timax:timax /var/www/timax'
```

На сервере:

```bash
cd /var/www/timax
runuser -u timax -- npm ci
runuser -u timax -- npm run db:push
runuser -u timax -- npm run build
systemctl restart timax
systemctl status timax
```

## Бэкап SQLite

Минимально — копировать базу каждый день в отдельную папку:

```bash
mkdir -p /var/backups/timax
crontab -e
```

Добавить строку:

```cron
15 3 * * * sqlite3 /var/www/timax/prisma/dev.db ".backup '/var/backups/timax/dev-$(date +\%F).db'" && find /var/backups/timax -type f -mtime +14 -delete
```

Лучше дополнительно скачать бэкап к себе или включить автоматические бэкапы у хостинга.

## Telegram-уведомления о заявках

1. Открыть Telegram и написать `@BotFather`.
2. Создать бота командой `/newbot`.
3. Скопировать токен бота в `TELEGRAM_BOT_TOKEN`.
4. Добавить бота в нужный чат или канал.
5. Узнать `chat_id` и записать его в `TELEGRAM_CHAT_ID`.

Простой способ узнать `chat_id`:

1. Написать любое сообщение боту или в группу, куда добавлен бот.
2. Открыть в браузере:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
```

3. В ответе найти `chat.id`.

Чтобы отправлять заявки нескольким людям, укажи ID через запятую:

```env
TELEGRAM_CHAT_ID="123456789,987654321"
```

Если это личные сообщения, каждый человек должен сначала открыть бота и нажать `/start`. Если это группа, достаточно добавить бота в группу.

После этого каждая новая заявка из формы будет сохраняться в админке и отправляться сообщением в Telegram. Если Telegram временно не ответит, заявка всё равно сохранится.

Проверить отправку можно командой:

```bash
npm run telegram:test
```
