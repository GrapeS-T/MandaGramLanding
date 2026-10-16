export interface KbHeading {
  level: number;
  id: string;
  text: string;
}

export interface KbArticle {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  sectionsCount: string;
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
  headings: KbHeading[];
  content: string;
}

export interface KbCategory {
  title: string;
  description: string;
  articles: Array<{
    slug: string;
    title: string;
    readTime: string;
  }>;
}

export const kbCategories: KbCategory[] = [
  {
    title: "Начало работы",
    description: "Установка, базовые принципы и настройка клиента MandaGram",
    articles: [
      { slug: "intro", title: "Введение в MandaGram", readTime: "3 мин" },
      { slug: "installation", title: "Установка на Windows и Linux", readTime: "4 мин" },
      { slug: "hotkeys", title: "Горячие клавиши и шорткаты", readTime: "3 мин" }
    ]
  },
  {
    title: "Разработка плагинов",
    description: "Нативный C ABI, перехват хуков, горячая замена и сборка на разных языках",
    articles: [
      { slug: "quickstart", title: "Быстрый старт: первый плагин", readTime: "7 мин" },
      { slug: "api", title: "C API и перехват методов", readTime: "12 мин" },
      { slug: "examples", title: "Примеры на C++, Rust, Zig и D", readTime: "8 мин" },
      { slug: "hotreload", title: "Горячая перезагрузка (Hot-Reload)", readTime: "7 мин" },
      { slug: "storage", title: "Хранилище, настройки и Watchdog", readTime: "8 мин" },
      { slug: "architecture", title: "Архитектура ядра и Compose", readTime: "9 мин" }
    ]
  },
  {
    title: "Функции клиента",
    description: "Оформление, приватность, VLC-плеер и сетевые настройки",
    articles: [
      { slug: "themes", title: "Material 3 Expressive и темы Monet", readTime: "4 мин" },
      { slug: "privacy", title: "Приватность, предпросмотр и блокировка", readTime: "4 мин" },
      { slug: "media", title: "Встроенный медиаплеер VLC", readTime: "3 мин" },
      { slug: "proxy", title: "Прокси и диагностика соединения", readTime: "4 мин" }
    ]
  },
  {
    title: "Поддержка",
    description: "Диагностика ошибок, безопасный режим и каналы связи",
    articles: [
      { slug: "troubleshooting", title: "Решение проблем и Safe Mode", readTime: "4 мин" },
      { slug: "community", title: "Сообщество и контакты", readTime: "2 мин" }
    ]
  }
];

export const kbPopularQuickLinks: Array<[string, string]> = [
  ["quickstart", "Быстрый старт плагинов"],
  ["hotreload", "Горячая перезагрузка"],
  ["api", "C API и HookParam"],
  ["privacy", "Приватность и блокировка"],
  ["installation", "Установка на ПК"]
];

export const kbArticles: Record<string, KbArticle> = {
  "intro": {
    slug: "intro",
    title: "Введение в MandaGram",
    category: "Начало работы",
    readingTime: "3 мин чтения",
    sectionsCount: "4 раздела",
    prev: null,
    next: { slug: "installation", title: "Установка на Windows и Linux" },
    headings: [
      { level: 2, id: "what-is", text: "Что такое MandaGram" },
      { level: 2, id: "core-principles", text: "Возможности клиента" },
      { level: 2, id: "tech-stack", text: "Технологический стек" },
      { level: 2, id: "comparison", text: "Расширения и границы безопасности" }
    ],
    content: `
      <section id="what-is">
        <h2>Что такое MandaGram</h2>
        <p>MandaGram — неофициальный портативный клиент Telegram для Windows x64 и Linux x86_64. Он работает без установки и хранит аккаунты, настройки и кэш в каталоге <code>data/</code> portable root. Не передавайте этот каталог другим: он содержит ваши сессии.</p>
        <p>Эта база знаний описывает реализацию клиента и нативного движка, а не гарантии будущих выпусков. Наличие исходников сборки не означает, что пакет для каждой платформы уже опубликован; проверяйте состав конкретного выпуска.</p>
      </section>
      <section id="core-principles">
        <h2>Возможности клиента</h2>
        <ul>
          <li>Несколько аккаунтов, папки чатов, каналы и группы с отдельными темами.</li>
          <li>Поиск, ответы, пересылка, форматирование, контекстное меню сообщений и реакции с учётом прав Telegram.</li>
          <li>Фото, видео, файлы, стикеры, custom emoji, профили, подарки и музыка профиля.</li>
          <li>Настройки приватности, уведомлений, автозагрузки и энергосбережения; код-пароль и работа в трее.</li>
          <li>SOCKS5 и MTProto-прокси. WEB отключён и при сохранённом выборе блокирует сеть до явного изменения режима.</li>
        </ul>
        <p>Действия в группах, сохранение защищённого контента и Premium-функции ограничиваются правами и ответами Telegram. Клиент не обходит эти ограничения.</p>
      </section>
      <section id="tech-stack">
        <h2>Технологический стек</h2>
        <ul>
          <li><strong>TDLib:</strong> связь с Telegram, аккаунты, события и локальные базы. Само использование TDLib не делает обычные облачные чаты сквозным шифрованным каналом.</li>
          <li><strong>Kotlin и Compose Desktop:</strong> интерфейс Material 3 Expressive, рендеринг через Skia и шрифты Google Sans/Flex.</li>
          <li><strong>LibVLC:</strong> нативное воспроизведение медиа; поддержка конкретного файла зависит от поставляемого runtime.</li>
          <li><strong>C ABI и Java FFM:</strong> загрузка нативных плагинов и вызовы API клиента.</li>
        </ul>
      </section>
      <section id="comparison">
        <h2>Расширения и границы безопасности</h2>
        <p>Плагины — библиотеки <code>.dll</code> или <code>.so</code>, исполняемые внутри процесса клиента. Они получают доступ к API, хукам и данным с правами этого процесса. Устанавливайте только доверенные расширения.</p>
        <p>Watchdog учитывает ошибки и след предыдущего аварийного запуска, но не является песочницей: нативный сбой или зависание могут затронуть весь клиент. Ограничения перезагрузки, владения памятью и callback описаны в <a href="/kb/quickstart/">руководстве разработчика</a>.</p>
      </section>
    `
  },

  "installation": {
    slug: "installation",
    title: "Установка на Windows и Linux",
    category: "Начало работы",
    readingTime: "4 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "intro", title: "Введение в MandaGram" },
    next: { slug: "hotkeys", title: "Горячие клавиши и шорткаты" },
    headings: [
      { level: 2, id: "windows", text: "Запуск на Windows" },
      { level: 2, id: "linux", text: "Запуск на Linux" },
      { level: 2, id: "paths", text: "Данные и обновление" },
      { level: 2, id: "requirements", text: "Платформы и диагностика запуска" }
    ],
    content: `
      <section id="windows">
        <h2>Запуск на Windows</h2>
        <p>Формат Windows-сборки — портативный <code>MandaGram.exe</code>, а не мастер установки. Поместите его в доступную для записи папку и запустите. Java runtime и LibVLC входят в пакет; отдельно устанавливать VLC не требуется.</p>
        <p>Выбирайте файл из <a href="https://github.com/GrapeS-T/MandaGram/releases" target="_blank" rel="noopener">конкретного выпуска</a>. Не считайте наличие поддержки платформы гарантией наличия её пакета в каждом выпуске.</p>
      </section>
      <section id="linux">
        <h2>Запуск на Linux</h2>
        <p>Для Linux предусмотрен AppImage. Замените VERSION на версию скачанного файла:</p>
        <div class="code-block"><div class="code-header"><span>Терминал Linux</span></div><div class="code-content"><pre>chmod +x MandaGram-VERSION-linux-x86_64.AppImage
./MandaGram-VERSION-linux-x86_64.AppImage
# Если FUSE недоступен:
./MandaGram-VERSION-linux-x86_64.AppImage --appimage-extract-and-run</pre></div></div>
        <p>Нужны Linux x86_64, glibc 2.35 или новее, X11 либо XWayland и системный OpenGL. Java и нативные библиотеки включаются в пакет, но графическая среда остаётся системной зависимостью.</p>
      </section>
      <section id="paths">
        <h2>Данные и обновление</h2>
        <p>Штатные пакеты размещают <code>data/</code> рядом с EXE или AppImage. Внутри находятся сессии TDLib, файлы, настройки аккаунтов, прокси и журналы. Сохраните этот каталог при обновлении. Не удаляйте его ради очистки кэша и не прикладывайте к отчётам об ошибках.</p>
        <p>Явный portable root задаётся аргументом <code>--portable-dir=&lt;каталог&gt;</code>; аргумент с пробелами передавайте целиком в кавычках. Внутри клиента приоритет: свойство <code>mandagram.portable.dir</code>, переменная <code>MANDAGRAM_PORTABLE_DIR</code>, рабочий каталог. У отдельно извлечённого AppDir без override данные могут оказаться в рабочем каталоге.</p>
        <p>Текущий загрузчик ищет библиотеки в отдельном <code>plugins/</code> под portable root. Фактические пути плагинного хранилища и ограничения описаны в <a href="/kb/storage/">статье о хранилище</a>; не переносите их по аналогии с TDLib.</p>
      </section>
      <section id="requirements">
        <h2>Платформы и диагностика запуска</h2>
        <p>Поддерживаемые целевые архитектуры — Windows 10/11 x64 и Linux x86_64. Пакеты и плагины должны соответствовать ОС и архитектуре процесса.</p>
        <p>При проблемах с графикой можно попробовать <code>--software</code> (программный рендеринг) или <code>--opengl</code>. Также предусмотрены <code>--vulkan</code> и Windows-режим <code>--d3d</code>. Эти параметры меняют рендеринг интерфейса, а не набор кодеков VLC.</p>
      </section>
    `
  },

  "hotkeys": {
    slug: "hotkeys",
    title: "Горячие клавиши и шорткаты",
    category: "Начало работы",
    readingTime: "3 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "installation", title: "Установка на Windows и Linux" },
    next: { slug: "quickstart", title: "Быстрый старт: первый плагин" },
    headings: [
      { level: 2, id: "formatting", text: "Форматирование текста" },
      { level: 2, id: "chat-actions", text: "Действия в чате" },
      { level: 2, id: "system-keys", text: "Навигация и окно" }
    ],
    content: `
      <section id="formatting">
        <h2>Форматирование текста</h2>
        <p>Комбинации применяются в редакторе сообщения; действие зависит от фокуса и выделения текста.</p>
        <ul>
          <li><code>Ctrl+B</code>, <code>Ctrl+I</code>, <code>Ctrl+U</code> — жирный, курсив и подчёркивание.</li>
          <li><code>Ctrl+Shift+M</code> — моноширинный текст; <code>Ctrl+Shift+X</code> — зачёркивание.</li>
          <li><code>Ctrl+Shift+P</code> — спойлер; <code>Ctrl+Shift+.</code> — цитата.</li>
          <li><code>Ctrl+K</code> — ссылка; <code>Ctrl+Shift+N</code> — убрать форматирование.</li>
        </ul>
      </section>
      <section id="chat-actions">
        <h2>Действия в чате</h2>
        <ul>
          <li><code>Ctrl+F</code> — поиск в текущем диалоге при соответствующем фокусе, иначе глобальный поиск.</li>
          <li><code>Ctrl+R</code> — пометить чат прочитанным.</li>
          <li><code>Ctrl+]</code> — предпросмотр последних 30 уже загруженных сообщений. Он не отменяет отправленные отметки прочтения.</li>
          <li><code>Ctrl+&#92;</code> — меню текущего чата; <code>Ctrl+O</code> — прикрепить медиа.</li>
          <li><code>Shift+F10</code> на сообщении в фокусе — контекстное меню с действиями, разрешёнными Telegram.</li>
        </ul>
      </section>
      <section id="system-keys">
        <h2>Навигация и окно</h2>
        <p><code>Ctrl+Tab</code> открывает переключатель недавних чатов и топиков. Tab/Shift+Tab листают текущую область; двойной Tab при удержании Ctrl переключает историю и быстрые действия. Стрелки перемещают выбор; отпускание Ctrl или Enter открывает выбранное, Escape отменяет переход.</p>
        <ul>
          <li><code>Ctrl+M</code> — минимизировать окно, не отключить звук чата.</li>
          <li><code>Ctrl+W</code> или <code>Ctrl+F4</code> — скрыть окно; <code>Ctrl+Q</code> — завершить приложение.</li>
          <li><code>Ctrl+L</code> — блокировка при включённом PIN.</li>
          <li>В просмотрщике медиа стрелки листают сообщения, Shift+стрелки перематывают видео, Escape закрывает просмотрщик.</li>
        </ul>
        <p>Panic вызывается из меню трея с подтверждением, а не комбинацией Ctrl+Shift+Escape. Это удаление локальных данных, не блокировка; см. <a href="/kb/privacy/">ограничения приватности</a>.</p>
      </section>
    `
  },

  "quickstart": {
    slug: "quickstart",
    title: "Быстрый старт: первый плагин",
    category: "Разработка плагинов",
    readingTime: "7 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "hotkeys", title: "Горячие клавиши и шорткаты" },
    next: { slug: "api", title: "C API и перехват методов" },
    headings: [
      { level: 2, id: "how-it-works", text: "Как устроен плагин MandaGram" },
      { level: 2, id: "exports", text: "Экспортируемые функции" },
      { level: 2, id: "minimal-example", text: "Минимальный пример (C++)" },
      { level: 2, id: "compile", text: "Сборка в одну строку" }
    ],
    content: `
      <section id="how-it-works">
        <h2>Как устроен плагин MandaGram</h2>
        <p>Плагин — динамическая библиотека C ABI: <code>.dll</code> в Windows или <code>.so</code> в Linux. Загрузчик ищет файлы непосредственно в каталоге <code>plugins/</code> клиента и использует имя файла без расширения как технический идентификатор. Отображаемое имя из метаданных — отдельное значение.</p><p>Код исполняется внутри процесса MandaGram с его правами. Это не песочница: плагин имеет доступ к памяти процесса, файлам и возможностям авторизованного клиента. Устанавливайте только проверенный исходный код или доверенные бинарные сборки. Для разработки используйте отдельную тестовую установку, а не рабочую переписку.</p>
      </section>

      <section id="exports">
        <h2>Экспортируемые функции</h2>
        <div class="code-block"><div class="code-header"><span>C ABI</span></div><div class="code-content"><pre>const PluginMetadata* mandagram_plugin_metadata(void);
bool mandagram_plugin_init(const PluginApi* api);</pre></div></div><p>Обязателен <code>mandagram_plugin_init</code>; <code>true</code> означает успешную инициализацию. Метаданные необязательны, но нужны для понятной карточки плагина. Их структура содержит четыре UTF-8 строки с завершающим нулём: <code>name</code>, <code>version</code>, <code>author</code>, <code>description</code>. Храните структуру и строки в статической памяти. <code>version</code> — версия самого плагина, не ABI.</p><p>Текущий SDK содержит таблицу из <strong>53 указателей на функции</strong>. Поля <code>api_version</code>, размера таблицы или механизма согласования версий нет. Используйте SDK той же ревизии клиента; бинарная совместимость между выпусками не обещана. Не добавляйте старое поле <code>env</code> в <code>HookParam</code>.</p><p>Регистрируйте хуки синхронно внутри init: именно в этом вызове загрузчик связывает регистрации с владельцем. Экспорт <code>mandagram_plugin_deinit</code> не вызывается. Не создавайте долгоживущие фоновые потоки и внешние callback без собственного безопасного завершения до выгрузки.</p>
      </section>

      <section id="minimal-example">
        <h2>Минимальный пример (C++)</h2>
        <p>Скачайте <a href="/include/mandagram_plugin.h" download>mandagram_plugin.h</a> и сохраните в <code>include/</code>. Макрос экспорта называется <code>PLUGIN_EXPORT</code>; обе функции логирования принимают тег и сообщение.</p><div class="code-block"><div class="code-header"><span>hello.cpp</span></div><div class="code-content"><pre>#include "mandagram_plugin.h"
static const PluginMetadata meta = {
    "Hello Plugin", "1.0.0", "Dev", "Minimal native plugin"
};
extern "C" PLUGIN_EXPORT const PluginMetadata* mandagram_plugin_metadata() {
    return &amp;meta;
}
extern "C" PLUGIN_EXPORT bool mandagram_plugin_init(const PluginApi* api) {
    if (!api) return false;
    api-&gt;log_info("HelloPlugin", "Plugin initialized");
    return true;
}</pre></div></div>
      </section>

      <section id="compile">
        <h2>Сборка в одну строку</h2>
        <p>Собирайте под ОС и архитектуру клиента; приведённые команды — для 64-битного окружения с установленным компилятором. Сначала создайте готовую библиотеку вне наблюдаемой папки, затем скопируйте её в <code>plugins/</code>. Зависимости C/C++ runtime должны быть доступны загрузчику ОС.</p><div class="code-block"><div class="code-header"><span>Windows · Clang</span></div><div class="code-content"><pre>clang++ -std=c++17 -shared -O2 -Iinclude hello.cpp -o hello.dll</pre></div></div><div class="code-block"><div class="code-header"><span>Linux · GCC</span></div><div class="code-content"><pre>g++ -std=c++17 -shared -fPIC -O2 -Iinclude hello.cpp -o hello.so</pre></div></div><p>Откройте список плагинов и журнал клиента: ищите сообщения загрузчика и тег <code>HelloPlugin</code>. Если библиотека не активна, проверьте экспорт символов, архитектуру, зависимости, возвращаемое значение init и состояние отключения. При ошибке загрузки не рассчитывайте на автоматический откат. Полные примеры для четырёх языков — в <a href="/kb/examples">следующей статье</a>.</p>
      </section>
    `
  },

  "api": {
    slug: "api",
    title: "C API и перехват методов",
    category: "Разработка плагинов",
    readingTime: "12 мин чтения",
    sectionsCount: "6 разделов",
    prev: { slug: "quickstart", title: "Быстрый старт: первый плагин" },
    next: { slug: "examples", title: "Примеры на C++, Rust, Zig и D" },
    headings: [
      { level: 2, id: "header", text: "Заголовочный файл mandagram_plugin.h" },
      { level: 2, id: "hookparam", text: "Структура HookParam" },
      { level: 2, id: "method-hooks", text: "Хуки Before и After" },
      { level: 2, id: "message-hooks", text: "Хуки отправки сообщений TDLib" },
      { level: 2, id: "memory-threads", text: "Память, строки и потоки" },
      { level: 2, id: "tdlib-query", text: "Вызовы TDLib через JSON" }
    ],
    content: `
      <section id="header">
        <h2>Заголовочный файл mandagram_plugin.h</h2>
        <p>Скачиваемые <a href="/include/mandagram_plugin.h" download>C-заголовок</a>, <a href="/include/mandagram_plugin.hpp" download>C++-обёртки</a> и <a href="/include/mandagram_plugin.zig" download>Zig SDK</a> повторяют клиентский <code>src/native/include/</code>. C-заголовок задаёт порядок полей и точные сигнатуры. Не переставляйте функции и не используйте упакованные структуры.</p><ul><li><strong>0–8:</strong> register_hook, log_info/error, get_storage_dir, get_cache_dir, resolve_asset, get_current_user_id, get_active_chat_id, execute_tdlib_query.</li><li><strong>9–16:</strong> create_composable_lambda, create_scoped_lambda, replace_composable и операции composer.</li><li><strong>17–20:</strong> register_update_hook, register_message_send_hook, register_message_receive_hook, register_chat_action.</li><li><strong>21–34:</strong> чтение/запись object/int/long/bool полей, строки UTF-8, attached fields и Compose State.</li><li><strong>35–45:</strong> Compose Modifier; <strong>46–52:</strong> Row, Column, Box, Spacer, Text, Image и получение bitmap аватара.</li></ul><p>Таблица не содержит номера ABI, размера, функции освобождения строк, публичного unregister или callback завершения. Нулевой необязательный указатель можно проверить, но это не проверка совместимости со старой, более короткой таблицей.</p>
      </section>

      <section id="hookparam">
        <h2>Структура HookParam</h2>
        <div class="code-block"><div class="code-header"><span>Актуальная структура C</span></div><div class="code-content"><pre>typedef struct HookParam {
    void* this_ptr;
    void** args;
    uint32_t args_count;
    uint32_t padding;
    void* result;
    uint8_t return_early;
    uint8_t has_result;
    uint16_t reserved;
    uint32_t padding2;
} HookParam;</pre></div></div><p>На текущем 64-битном мосте структура занимает 40 байт: this_ptr — offset 0, args — 8, args_count — 16, result — 24, флаги — 32 и 33. <code>env/JNIEnv</code> отсутствует. <code>this_ptr</code>, элементы args и result — непрозрачные идентификаторы JVM-объектов, упакованные в pointer-sized значения, а не адреса объектов и не JNI references. Не разыменовывайте их и не передавайте в JNI. У статического метода this_ptr равен null; примитивные аргументы представлены объектами-обёртками.</p><p>Используйте <code>get_object_field</code>, типизированные get/set полей, <code>get_string_utf</code> и <code>create_string_utf</code>. Для данных, привязанных к JVM-объекту, есть <code>get_attached_field/set_attached_field</code>; для существующего Compose State — <code>get_state_value/set_state_value</code>. Изменение типа значения должно соответствовать JVM-методу или полю.</p>
      </section>

      <section id="method-hooks">
        <h2>Хуки Before и After</h2>
        <div class="code-block"><div class="code-header"><span>Регистрация</span></div><div class="code-content"><pre>int32_t register_hook(const char* class_name,
    const char* method_name, const char* method_descriptor,
    HookBeforeFn before_cb, HookAfterFn after_cb);</pre></div></div><p>Имя класса допускает точки или слеши. Передайте точный JVM descriptor для нужной перегрузки; <code>null</code> означает перехват по имени без ограничения дескриптора. Kotlin top-level функции, suspend-функции и Compose имеют скомпилированные имена и дополнительные параметры — сверяйтесь с байткодом своей версии клиента. Успешная регистрация возвращает 0, но сама по себе не доказывает наличие или успешную трансформацию нужного метода: смотрите журнал.</p><ul><li><strong>Before:</strong> изменение <code>args[i]</code> на другой handle записывается обратно. <code>return_early != 0</code> или <code>has_result != 0</code> пропускает оригинал; result должен иметь подходящий JVM-тип.</li><li><strong>After:</strong> для подмены результата установите <code>has_result = 1</code> и result. Изменения args после вызова не переписываются обратно мостом.</li><li><strong>Ограничение null:</strong> before-мост заменяет отсутствующий результат на Kotlin Unit, а after-адаптер применяет только ненулевые результаты. Не используйте null как универсальный способ вернуть JVM null или отменить любой метод.</li><li>Abstract/native методы трансформер пропускает. Перехват зависит от доступной JVM instrumentation и изменяемости класса. Во время выполнения method-hook вложенный dispatch before подавляется для защиты от рекурсии.</li></ul>
      </section>

      <section id="message-hooks">
        <h2>Хуки отправки сообщений TDLib</h2>
        <div class="code-block"><div class="code-header"><span>Сигнатуры callback</span></div><div class="code-content"><pre>typedef bool (*UpdateHookFn)(const char* json, uintptr_t user_data);
typedef const char* (*MessageBeforeSendFn)(int64_t chat_id,
    const char* text, uintptr_t user_data);
typedef void (*MessageAfterSendFn)(int64_t chat_id,
    int64_t message_id, uintptr_t user_data);
// before_cb и after_cb можно передать независимо:
api-&gt;register_message_send_hook(before_cb, after_cb, user_data);</pre></div></div><p>Before вызывается для <code>InputMessageText</code> в обычном пути отправки клиента. Верните исходный указатель или <code>null</code>, чтобы оставить текст без изменений; <strong>null не отменяет отправку</strong>. Возврат другой UTF-8 строки подменяет текст и сбрасывает entities форматирования. Строка с точным началом <code>{&quot;@type&quot;:</code> также может быть разобрана как InputMessageContent; при неудаче разбора объекта содержимое может стать обычным текстом. Это не общий фильтр всех медиа и всех запросов TDLib.</p><p>After получает chat_id и message_id после получения объекта сообщения путём отправки клиента; это не подтверждение прочтения или гарантированной доставки адресату. Receive получает идентификаторы и текст для MessageText, для прочих типов — пустую строку. Update получает JSON; <code>false</code> запрещает дальнейшую обработку обновления клиентом, а не отменяет событие на сервере. Остальные update-хуки всё равно вызываются.</p><p><code>register_chat_action(id, label, click_cb, user_data)</code> добавляет действие в меню шапки чата. Callback получает chat_id. Регистрации событий возвращают 0 при добавлении; владение и снятие регистраций привязаны к init.</p>
      </section>

      <section id="memory-threads">
        <h2>Память, строки и потоки</h2>
        <p>HookParam, массив args, входные строки и локальные handles принадлежат вызову хоста. Не сохраняйте их для будущих callback или другого потока. Локальные handles method-hook удаляются при выходе из frame; API не предоставляет retain/release или global-reference функции. Копируйте нужные текстовые/числовые данные в собственную память.</p><p>Результат before-send читается мостом сразу после возврата callback, без free со стороны клиента. Можно вернуть исходную строку, её корректную NUL-terminated подстроку или статическую строку. Указатель на стек уже недействителен; strdup без собственного освобождения течёт. Общий изменяемый буфер небезопасен при конкурентных вызовах.</p><p>Функции с out_buf/max_len пишут UTF-8 и завершающий ноль, возвращая число <em>скопированных</em> байт без нуля; при ошибке адаптера — -1. Максимум — max_len − 1. Результат, равный этому пределу, считайте потенциально усечённым; требуемый размер API не сообщает. Нельзя допускать обрезания JSON или пути. Нулевой буфер/размер возвращает 0, это не запрос размера.</p><p>Callback исполняется синхронно на потоке вызывающего кода. Method-hook может оказаться на UI-потоке; события не обещают единую очередь или сериализацию. Не блокируйте их диском, сетью, ожиданием lock или длительными вычислениями. Не выпускайте C++ exceptions, Rust panic или D exceptions через C ABI. Проверяйте аргументы и завершайте callback быстро.</p>
      </section>

      <section id="tdlib-query">
        <h2>Вызовы TDLib через JSON</h2>
        <p><code>execute_tdlib_query(json, out_buf, max_len)</code> — синхронный мост к текущему TDLib-клиенту. Принимает JSON с <code>@type</code>, преобразует его в классы TdApi и возвращает JSON результата или error. Есть быстрые пути базовых функций и reflection-разбор остальных; поддержка зависит от классов TDLib и возможностей преобразования полей, а не от обещания принять любой JSON.</p><div class="code-block"><div class="code-header"><span>Пример тела запроса</span></div><div class="code-content"><pre>{"@type":"getMe"}</pre></div></div><p>Вызов блокирует вызывающий поток через runBlocking. Асинхронный send-ответ ожидается до 7 секунд; этот срок не является общим таймаутом всех операций или защитой от зависаний. Возможны error 400 (ввод/неподдерживаемая функция), 503 (клиент не активен), 408 (ожидание ответа), 500 и ошибки TDLib. Проверяйте JSON, не только положительную длину.</p><p>Не вызывайте блокирующие запросы из Compose и UI-хуков; не создавайте цикл отправки из before-send. <code>get_current_user_id()</code> и <code>get_active_chat_id()</code> возвращают 0, если соответствующего значения сейчас нет. Прямой TDLib query — не замена обычному пути отправки клиента и не обещает повторный проход высокоуровневых хуков.</p>
      </section>
    `
  },

  "examples": {
    slug: "examples",
    title: "Примеры на C++, Rust, Zig и D",
    category: "Разработка плагинов",
    readingTime: "8 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "api", title: "C API и перехват методов" },
    next: { slug: "hotreload", title: "Горячая перезагрузка (Hot-Reload)" },
    headings: [
      { level: 2, id: "cpp", text: "Пример на C++" },
      { level: 2, id: "rust", text: "Пример на Rust" },
      { level: 2, id: "zig", text: "Пример на Zig" },
      { level: 2, id: "d", text: "Пример на D (betterC)" }
    ],
    content: `
      <section id="cpp">
        <h2>Пример на C++</h2>
        <p>Все четыре скачиваемых примера реализуют одно действие: удаляют префикс <code>.plain </code> из исходящего текстового сообщения. Нет фиктивных имён JVM-методов, JNI или динамического выделения памяти в обработчике. Прочий текст проходит без изменений; это не отмена отправки. При изменении текста движок сбрасывает entities форматирования.</p><p>Сохраните <a href="/examples/cpp/plugin.cpp" download>plugin.cpp</a> в <code>examples/cpp/</code>, а <a href="/examples/include/mandagram_plugin.h" download>mandagram_plugin.h</a> в <code>examples/include/</code>.</p><div class="code-block"><div class="code-header"><span>Обработчик из plugin.cpp</span></div><div class="code-content"><pre>static const char* before_send(int64_t, const char* text, uintptr_t) noexcept {
    if (text &amp;&amp; std::strncmp(text, ".plain ", 7) == 0) return text + 7;
    return text;
}
// В mandagram_plugin_init:
return api-&gt;register_message_send_hook(before_send, nullptr, 0) == 0;</pre></div></div><div class="code-block"><div class="code-header"><span>Из examples/cpp · Linux</span></div><div class="code-content"><pre>g++ -std=c++17 -shared -fPIC -O2 -I../include plugin.cpp -o plain_cpp.so</pre></div></div><div class="code-block"><div class="code-header"><span>Из examples/cpp · Windows</span></div><div class="code-content"><pre>clang++ -std=c++17 -shared -O2 -I../include plugin.cpp -o plain_cpp.dll</pre></div></div><p>Полный файл содержит метаданные и init. Возвращаемая подстрока принадлежит входному буферу: мост копирует её до его освобождения. Ничего освобождать или удерживать после вызова не нужно.</p>
      </section>

      <section id="rust">
        <h2>Пример на Rust</h2>
        <p>Сохраните <a href="/examples/rust/Cargo.toml" download>Cargo.toml</a> и <a href="/examples/rust/src/lib.rs" download>src/lib.rs</a> с этой структурой каталогов. Пример использует edition 2021 и <code>cdylib</code>. Определения repr(C) включают все 53 функции текущего ABI; C callback имеют extern &quot;C&quot;, uintptr_t представлен usize, строки — c_char.</p><div class="code-block"><div class="code-header"><span>Из examples/rust</span></div><div class="code-content"><pre>cargo build --release</pre></div></div><p>Артефакт находится в <code>target/release/</code>: <code>mandagram_plugin_rust.dll</code> или <code>libmandagram_plugin_rust.so</code>. Метаданные содержат только неизменяемые статические строки; поэтому для этой структуры обоснован Sync. Функция before_send возвращает исходный указатель со смещением, без CString, unwrap и аллокаций.</p><p>Release-профиль задаёт <code>panic = &quot;abort&quot;</code>: это запрет unwind через ABI, <strong>не восстановление</strong>. Panic способен завершить весь клиент. Не переносите Rust reference за пределы времени жизни переданных хостом данных.</p>
      </section>

      <section id="zig">
        <h2>Пример на Zig</h2>
        <p>Сохраните <a href="/examples/zig/plugin.zig" download>plugin.zig</a>, <a href="/examples/zig/build.zig" download>build.zig</a> и соседний <a href="/examples/include/mandagram_plugin.zig" download>include/mandagram_plugin.zig</a>. Build-файл рассчитан на Zig 0.14.x: каталог <code>include</code> должен быть рядом с каталогом <code>zig</code>. SDK подключается как именованный модуль, а не как импорт за пределами module root.</p><div class="code-block"><div class="code-header"><span>Из examples/zig</span></div><div class="code-content"><pre>zig build -Doptimize=ReleaseSafe</pre></div></div><p>Библиотека устанавливается в <code>zig-out/</code> (подкаталог зависит от платформы). Callback объявлены с <code>callconv(.c)</code>; строки — sentinel-terminated UTF-8. Пример использует SDK, а не собственную неполную копию HookParam. Проверка optional callback не заменяет подбор совместимой версии клиента.</p>
      </section>

      <section id="d">
        <h2>Пример на D (betterC)</h2>
        <p>Сохраните <a href="/examples/d/mandagram_plugin.d" download>mandagram_plugin.d</a> и <a href="/examples/d/dub.json" download>dub.json</a>. В одном модуле находятся актуальные C-совместимые структуры, полная таблица API, статические метаданные и обработчик <code>.plain </code>. Старый JNI chaos-пример удалён: он не соответствует pure FFI движку.</p><div class="code-block"><div class="code-header"><span>Из examples/d · LDC</span></div><div class="code-content"><pre>ldc2 -shared -betterC mandagram_plugin.d</pre></div></div><p>Либо используйте <code>dub build --compiler=ldc2</code>. Функции имеют extern(C); данные плагина не требуют GC или D runtime. Собирайте под текущую платформу, затем переносите готовую библиотеку в каталог плагинов. Никаких собственных DllMainCRTStartup или подмен JNI-таблиц пример не требует.</p><p>Эти команды описывают сборку исходников, а не готовые проверенные бинарники. После сборки для своей версии клиента сначала проверьте загрузку и отправку в отдельном тестовом чате. Не тестируйте несовместимый ABI на рабочем профиле.</p>
      </section>
    `
  },

  "hotreload": {
    slug: "hotreload",
    title: "Горячая перезагрузка (Hot-Reload)",
    category: "Разработка плагинов",
    readingTime: "7 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "examples", title: "Примеры на C++, Rust, Zig и D" },
    next: { slug: "storage", title: "Хранилище, настройки и Watchdog" },
    headings: [
      { level: 2, id: "mechanism", text: "Механика горячей перезагрузки" },
      { level: 2, id: "shadow-copies", text: "Теневые копии и блокировки файлов" },
      { level: 2, id: "lifecycle", text: "Жизненный цикл плагина" }
    ],
    content: `
      <section id="mechanism">
        <h2>Механика горячей перезагрузки</h2>
        <p>PluginLoader использует WatchService для верхнего уровня <code>plugins/</code>. При включённом watcher создание файла вызывает load, изменение — unload/load, удаление — unload. Обрабатывается расширение текущей ОС (.dll или .so), скрытые файлы пропускаются; подкаталоги рекурсивно не наблюдаются.</p><p>Перед create/modify стоит ожидание <strong>150 мс</strong>. Это задержка, а не проверка целостности сборки, не гарантированный debounce и не SLA времени перезагрузки. После установки через интерфейс события для того же имени игнорируются в течение 2 секунд. Watcher может завершиться с ошибкой, что отражается в журнале.</p><p>Собирайте библиотеку вне plugins, затем публикуйте полностью готовый файл. Несколько событий ОС могут вызвать несколько загрузок. Старый экземпляр снимается до попытки загрузить новый; при неудаче автоматического отката нет. Отключённый плагин не становится включённым просто из-за перезаписи файла.</p>
      </section>

      <section id="shadow-copies">
        <h2>Теневые копии и блокировки файлов</h2>
        <p>Перед загрузкой создаётся <code>plugins/.cache/&lt;имя&gt;_&lt;timestamp&gt;.&lt;ext&gt;</code>. JVM загружает теневую копию, чтобы исходную DLL обычно можно было заменить даже в Windows. Если копирование не удалось, реализация пробует исходный файл; поэтому свобода от файловых блокировок не гарантирована.</p><p>При unload предпринимается удаление теневой копии, при старте очищается служебная .cache. Это не тот же каталог, что <code>plugins/cache/&lt;имя&gt;/</code> с пользовательским кэшем плагина. Не складывайте свои данные в .cache и не используйте путь теневой копии как постоянный идентификатор.</p>
      </section>

      <section id="lifecycle">
        <h2>Жизненный цикл плагина</h2>
        <ol><li>Загрузка библиотеки через SymbolLookup/Arena, чтение необязательных метаданных.</li><li>Создание таблицы PluginApi и синхронный вызов init в контексте технического имени плагина.</li><li>При true arena сохраняется до unload; зарегистрированные хуки работают на потоках вызывающего кода.</li><li>Unload снимает связанные расширения HookRegistry и method hooks, затем закрывает arena библиотеки.</li></ol><p><strong>Deinit/shutdown callback отсутствует.</strong> Загрузчик не ждёт ваши worker threads, не освобождает вашу native heap и не доказывает, что сохранённая Compose-лямбда больше не будет вызвана. Нет общей гарантии безопасной выгрузки при активных native callback. Не оставляйте внешних обработчиков и фоновых работ, ссылающихся на код или API выгруженной библиотеки.</p><p>Регистрация с произвольного потока вне init получает владельца <code>global</code>, а не имя плагина: обычная выгрузка по имени её не снимет. Все регистрации делайте синхронно в init. При возврате false arena закрывается, но rollback уже зарегистрированных хуков этим путём не выполняется. Сначала завершите проверки и подготовку, затем регистрируйте callbacks; не рассчитывайте на транзакционную инициализацию.</p><p>Для изменений с долгоживущими ресурсами, retained Compose callback или сомнениями в ABI безопаснее полностью перезапустить тестовый клиент. Hot-reload — удобство разработки, а не изоляция ошибок и не обещание перезагрузки за 10–15 мс.</p>
      </section>
    `
  },

  "storage": {
    slug: "storage",
    title: "Хранилище, настройки и Watchdog",
    category: "Разработка плагинов",
    readingTime: "8 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "hotreload", title: "Горячая перезагрузка (Hot-Reload)" },
    next: { slug: "architecture", title: "Архитектура ядра и Compose" },
    headings: [
      { level: 2, id: "isolated-storage", text: "Каталоги данных, кэша и ресурсов" },
      { level: 2, id: "declarative-ui", text: "Настройки плагина и интерфейс" },
      { level: 2, id: "watchdog", text: "Watchdog и границы Safe Mode" }
    ],
    content: `
      <section id="isolated-storage">
        <h2>Каталоги данных, кэша и ресурсов</h2>
        <p>Мост создаёт персональные каталоги по переданному имени:</p><ul><li><code>plugins/data/&lt;name&gt;/</code> — постоянные данные;</li><li><code>plugins/cache/&lt;name&gt;/</code> — кэш плагина;</li><li><code>plugins/assets/&lt;name&gt;/</code> — первая точка поиска ресурсов.</li></ul><div class="code-block"><div class="code-header"><span>C ABI</span></div><div class="code-content"><pre>char path[4096];
int32_t n = api-&gt;get_storage_dir("plain_cpp", path, sizeof path);
if (n &gt; 0 &amp;&amp; n &lt; (int32_t)sizeof(path) - 1) {
    api-&gt;log_info("PlainCpp", path);
}</pre></div></div><p><code>get_cache_dir</code> использует такую же сигнатуру. Имя задаёт сам плагин; используйте стабильное техническое имя и не формируйте его из недоверенного ввода. Данные не удаляются при обычной перезагрузке, но миграции форматов и сохранность при удалении файлов — ваша ответственность.</p><p><code>resolve_asset(name, asset, out_buf, max_len)</code> ищет существующий файл последовательно в assets/name, plugins/name, data/cache, dist/data/cache и по переданному относительному пути. Отсутствие ресурса даёт пустую строку/0, ошибка адаптера — -1. Поиск не ограничен приватной директорией и не является проверкой безопасности пути.</p><p>Это разделение по соглашению, а не изоляция файловой системы: native код может обращаться к любым файлам, доступным процессу. API не предоставляет отдельный защищённый key-value store или шифрование секретов. Не сохраняйте токены и содержимое переписки без необходимости; не выводите их в журнал.</p>
      </section>

      <section id="declarative-ui">
        <h2>Настройки плагина и интерфейс</h2>
        <p>В текущем C ABI нет экспорта схемы настроек и автоматического генератора формы с переключателями. Хранить конфигурацию и читать её нужно самому через обычные файловые операции, используя полученные пути. Формат, значения по умолчанию и обновление конфигурации определяет плагин.</p><p>Для взаимодействия с UI доступны действие в шапке чата (<code>register_chat_action</code>) и низкоуровневые <a href="/kb/architecture#compose-slots">Compose-примитивы</a>. Наличие внутренних Kotlin extension interfaces не означает, что каждый из них доступен через C-таблицу. Не объявляйте несуществующий settings-export в надежде, что загрузчик его обнаружит.</p>
      </section>

      <section id="watchdog">
        <h2>Watchdog и границы Safe Mode</h2>
        <p>PluginWatchdog хранит счётчики ошибок, список отключённых имён и маркер незавершённого исполнения. Это механизм учёта и восстановления при следующем запуске, <strong>не песочница и не таймер прерывания native кода</strong>.</p><ul><li>Перед init записывается <code>plugins/.crash_flag</code>, после завершения он удаляется. Если маркер остался, следующий старт устанавливает признак Safe Mode, добавляет указанное имя в отключённые и удаляет маркер.</li><li><code>recordError</code> увеличивает счётчик; при 5 учтённых ошибках вызывается отключение/выгрузка и сохранение <code>.disabled_plugins</code>. Успешный init сбрасывает счётчик.</li><li>Не всякая ошибка native callback достигает счётчика: часть адаптеров сама ловит Throwable и возвращает прежнее значение. Маркер init также не является надёжной атрибуцией любого последующего сбоя.</li><li>Загрузчик проверяет конкретные отключённые имена. Сам флаг Safe Mode не означает безусловный запрет всех плагинов или отдельный защищённый процесс.</li></ul><p>Нет отсечения потока через 2500 мс. Segmentation fault, access violation, повреждение памяти и бесконечный native цикл могут завершить или повесить весь клиент. Java try/catch и Watchdog не гарантируют спасение сессии. Если native вызов завис, интерфейс может быть недоступен; после остановки приложения уберите проблемную библиотеку из тестовой установки и изучите журнал. Повторно включайте её только после устранения причины.</p>
      </section>
    `
  },

  "architecture": {
    slug: "architecture",
    title: "Архитектура ядра и Compose",
    category: "Разработка плагинов",
    readingTime: "9 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "storage", title: "Хранилище, настройки и Watchdog" },
    next: { slug: "themes", title: "Material 3 Expressive и темы Monet" },
    headings: [
      { level: 2, id: "jni-bridge", text: "Pure FFI-мост и Class-File instrumentation" },
      { level: 2, id: "compose-slots", text: "Compose UI через C ABI" },
      { level: 2, id: "tdlib-flow", text: "Интеграция с потоком событий TDLib" }
    ],
    content: `
      <section id="jni-bridge">
        <h2>Pure FFI-мост и Class-File instrumentation</h2>
        <p>Текущий PluginBridge реализован на Java Foreign Function &amp; Memory API: SymbolLookup загружает библиотеку, Linker связывает native вызовы и upcall stubs, Arena владеет временем жизни таблицы API. Внешняя JNI bridge-библиотека для этого пути не нужна. Старые SDK с JNIEnv и jni_accessor несовместимы с этой таблицей.</p><p>Method hooks работают через JDK instrumentation agent и ClassFileHookTransformer на Class-File API, а не через ByteBuddy. XposedEngine ведёт registry before/after callbacks и ретрансформирует доступные классы. Интерфейс похож на Xposed, но не является Android Xposed runtime.</p><p>ObjectHandleScope сопоставляет целочисленные идентификаторы с JVM-объектами. C typedef <code>jobject = void*</code> здесь только транспортный тип. Идентификатор нельзя разыменовать, привести к структуре объекта или сохранить как JNI global reference. C++ <code>getArgAs&lt;T&gt;</code> не превращает handle в настоящий native адрес.</p>
      </section>

      <section id="compose-slots">
        <h2>Compose UI через C ABI</h2>
        <p>Нативный плагин может создать composable-лямбду, scoped-лямбду или заменить перехваченный composable через <code>replace_composable(param, callback, user_data)</code>. Мост ищет Composer среди args, открывает replaceable group, вызывает callback и пропускает оригинал с результатом Unit. Без Composer замена не выполняется, ошибка пишется в журнал. Применяйте это только к подходящему composable с результатом Unit, зная его точную JVM-сигнатуру.</p><div class="code-block"><div class="code-header"><span>Сигнатуры Compose callback</span></div><div class="code-content"><pre>typedef void (*ComposableFn)(jobject composer, uintptr_t user_data);
typedef void (*ScopedComposableFn)(jobject scope,
    jobject composer, uintptr_t user_data);</pre></div></div><p>Нет дополнительного параметра env. <code>create_composable_lambda</code> возвращает объект функции Compose, <code>create_scoped_lambda</code> — вариант для Row/Column/Box scope. Эти handles можно передать в соответствующие compose_* функции в текущей композиции.</p><ul><li><strong>Runtime:</strong> composer_start_group/end_group, composer_get_remembered/set_remembered, composer_is_skipping. Соблюдайте парность групп; remembered-значения — JVM-объекты, не native указатели.</li><li><strong>Layout:</strong> compose_row, compose_column, compose_box, compose_spacer. Scoped content получает scope; modifier_weight требует RowScope или ColumnScope.</li><li><strong>Содержимое:</strong> compose_text принимает UTF-8, ARGB, размер sp, bold и max_lines; compose_image — bitmap handle. get_avatar_bitmap читает bitmap из клиентского кэша по пути, не является универсальным загрузчиком изображения из сети.</li><li><strong>Modifier:</strong> empty, size, width/height, fill_max_width/height, padding, background, border, clickable, weight. Размеры и отступы — dp, цвет — 32-битный ARGB.</li></ul><p><code>modifier_clickable</code> ожидает JVM Function0. ComposableFn — не click callback; API создания обычной Function0 из C здесь нет. Для действия чата используйте register_chat_action, а не небезопасное приведение типов.</p><p>Compose выполняется в контексте активной композиции: не вызывайте его из init или фонового native потока, не удерживайте Composer между callback и не выполняйте внутри блокирующие запросы. Обёртки компонентов используют reflection и зависят от версии Compose; это не обещание стабильных слотов во всех экранах.</p><p>У C ABI нет общей регистрации UI-слотов sidebar/message-bubble/input-panel и нет settings schema API. Доступны показанные примитивы и перехват конкретного метода. Сохранённые JVM-лямбды могут содержать адрес native callback; автоматическая очистка всех таких ссылок при hot-reload не гарантирована.</p>
      </section>

      <section id="tdlib-flow">
        <h2>Интеграция с потоком событий TDLib</h2>
        <p>TDLib update проходит через HookRegistry до обычной обработки сессией. Возврат false из update-hook может скрыть изменение от клиентского состояния; он не отменяет получение данных TDLib и не меняет сервер. При новом сообщении ConversationController уведомляет receive-хуки.</p><p>MessageCommands пропускает обычную отправку через before-хуки и уведомляет after-хуки после ответа с объектом сообщения. Эти события не эквивалентны подтверждению доставки. Низкоуровневые запросы или другие пути отправки не обязаны проходить тот же registry.</p><p>Текст и обновления передаются в native код синхронно, а не через отдельный изолированный worker. Медленный hook задерживает своего вызывающего. Общие mutable данные требуют синхронизации; не переносите callback-local handles между потоками. JSON запросы и события — адаптация классов TdApi, а не отдельный MTProto-клиент.</p><p>Для большинства расширений начните с высокоуровневых событий и действий чата. Перехват приватных полей, внутренних методов и Compose оправдан только при привязке к конкретной версии клиента и понимании времени жизни объектов.</p>
      </section>
    `
  },

  "themes": {
    slug: "themes",
    title: "Material 3 Expressive и темы Monet",
    category: "Функции клиента",
    readingTime: "4 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "architecture", title: "Архитектура ядра и Compose" },
    next: { slug: "privacy", title: "Приватность, предпросмотр и блокировка" },
    headings: [
      { level: 2, id: "m3e-overview", text: "Интерфейс Material 3 Expressive" },
      { level: 2, id: "monet-palettes", text: "Палитры движка и доступные настройки" },
      { level: 2, id: "typography", text: "Шрифты Google Sans и Flex" }
    ],
    content: `
      <section id="m3e-overview">
        <h2>Интерфейс Material 3 Expressive</h2>
        <p>Интерфейс реализован на Compose Desktop: панели, карточки, меню и переходы используют Material 3 Expressive. По умолчанию включены тёмное оформление и палитра Evening Red. Настройки темы этого сайта не изменяют оформление установленного клиента.</p>
      </section>
      <section id="monet-palettes">
        <h2>Палитры движка и доступные настройки</h2>
        <p>В Theme.kt определены Evening Red, Pistachio, Lavender, Ocean, Peach и Slate. Для тёмных Evening Red и Pistachio предусмотрены готовые схемы, для остальных — динамическая генерация Expressive.</p>
        <p><strong>Отдельного пользовательского переключателя этих тем в текущем интерфейсе нет.</strong> Наличие setSeed и toggleDarkMode в движке не означает наличия меню «Оформление». Не нужно искать несуществующий пункт настроек или менять внутренние файлы по инструкции от другой версии.</p>
      </section>
      <section id="typography">
        <h2>Шрифты Google Sans и Flex</h2>
        <p>Google Sans и Google Sans Flex входят в ресурсы клиента и используются в нескольких начертаниях. Они не требуют ручной установки в систему. Пользовательский редактор вариативных осей шрифта не предусмотрен.</p>
        <p>При ошибках отображения сообщите версию, ОС, масштаб экрана и приложите обезличенный снимок. Проблемы графического backend проверяйте отдельно от настройки шрифта: см. <a href="/kb/installation/#requirements">параметры запуска</a>.</p>
      </section>
    `
  },

  "privacy": {
    slug: "privacy",
    title: "Приватность, предпросмотр и блокировка",
    category: "Функции клиента",
    readingTime: "4 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "themes", title: "Material 3 Expressive и темы Monet" },
    next: { slug: "media", title: "Встроенный медиаплеер VLC" },
    headings: [
      { level: 2, id: "ghost-mode", text: "Предпросмотр и границы Ghost Mode" },
      { level: 2, id: "typing-status", text: "Серверные настройки приватности" },
      { level: 2, id: "app-lock", text: "Блокировка код-паролем" },
      { level: 2, id: "panic-mode", text: "Panic: удаление локальных данных" }
    ],
    content: `
      <section id="ghost-mode">
        <h2>Предпросмотр и границы Ghost Mode</h2>
        <p><code>Ctrl+]</code> открывает последние 30 уже загруженных сообщений текущего чата. Пока открыт этот диалог, обычная отправка отметок прочтения по видимой области чата отключена.</p>
        <p><strong>Предпросмотр не отменяет уже отправленные отметки.</strong> Обычный чат мог отметить сообщения до его открытия. Это не гарантия невидимости до ответа и не режим скрытого чтения всей истории. <code>Ctrl+R</code> вручную отмечает чат прочитанным.</p>
      </section>
      <section id="typing-status">
        <h2>Серверные настройки приватности</h2>
        <p>В настройках конфиденциальности доступны правила видимости номера телефона, последнего онлайна, фото профиля, ссылки на аккаунт при пересылке и права звонить. Изменения обрабатывает TDLib с учётом серверных ограничений.</p>
        <p>Отдельный пользовательский переключатель «скрыть набор текста» в текущем интерфейсе не подтверждён. Не считайте предпросмотр способом скрыть любые действия от Telegram. Настройка права звонить сама по себе не означает наличие полноценного интерфейса звонков.</p>
      </section>
      <section id="app-lock">
        <h2>Блокировка код-паролем</h2>
        <p>В «Настройки → Конфиденциальность» можно включить шестизначный цифровой PIN. Интервалы автоблокировки — 1, 5, 15 или 60 минут. <code>Ctrl+L</code> блокирует клиент при включённом PIN. После пяти неверных попыток действует задержка повторного ввода.</p>
        <p>Код защищает интерфейс, <strong>но не шифрует базы и файлы TDLib</strong>. Доступ к диску защищайте средствами ОС; не распространяйте portable-каталог вместе с личными данными.</p>
      </section>
      <section id="panic-mode">
        <h2>Panic: удаление локальных данных</h2>
        <p><strong>Режим паники — разрушительная операция, не блокировка и не сворачивание.</strong> Он вызывается из меню трея с подтверждением, пытается завершить активную Telegram-сессию, очищает список аккаунтов и удаляет содержимое локальной <code>data/</code>, затем возвращает экран входа.</p>
        <p>Запрос выхода относится к активному клиенту и имеет ограниченное ожидание. Это не гарантия отзыва всех серверных сессий, успешного удаления каждого занятого файла или безопасного стирания диска. Для обычной защиты окна используйте PIN, а не Panic.</p>
      </section>
    `
  },

  "media": {
    slug: "media",
    title: "Встроенный медиаплеер VLC",
    category: "Функции клиента",
    readingTime: "3 мин чтения",
    sectionsCount: "3 раздела",
    prev: { slug: "privacy", title: "Приватность, предпросмотр и блокировка" },
    next: { slug: "proxy", title: "Прокси и диагностика соединения" },
    headings: [
      { level: 2, id: "libvlc", text: "Движок LibVLC" },
      { level: 2, id: "codecs", text: "Просмотрщик и управление" },
      { level: 2, id: "performance", text: "Декодирование и политики медиа" }
    ],
    content: `
      <section id="libvlc">
        <h2>Движок LibVLC</h2>
        <p>Видео и аудио воспроизводятся нативным LibVLC, поставляемым с клиентом. Совместимость зависит от конкретного файла и версии runtime: универсальная поддержка любых кодеков и контейнеров не гарантируется.</p>
      </section>
      <section id="codecs">
        <h2>Просмотрщик и управление</h2>
        <p>Фото, видео и GIF открываются в общем просмотрщике. Из чата доступна смешанная галерея, из раздела профиля — выбранный тип медиа, из топика — медиа этой темы. Соседние сообщения подгружаются при листании.</p>
        <ul>
          <li>Стрелки на экране и клавиатуре — предыдущий/следующий элемент; Shift+стрелки — перемотка видео; Escape — закрытие.</li>
          <li>Для видео доступны воспроизведение/пауза, отключение звука и скорость воспроизведения.</li>
          <li>ПКМ по плитке или нижняя панель просмотрщика позволяют перейти к исходному сообщению; тема открывается в исходном топике.</li>
          <li>Сохранение оригинала и копирование ссылки зависят от доступности файла и ограничений Telegram. Защита контента не обходится.</li>
        </ul>
      </section>
      <section id="performance">
        <h2>Декодирование и политики медиа</h2>
        <p>В текущем VlcManager задано <code>--avcodec-hw=none</code>: аппаратное декодирование видео отключено. GPU-рендеринг Compose не означает DXVA/VA-API-декодирование VLC.</p>
        <p>Автозагрузка фото, видео и файлов, автопроигрывание GIF/видео и энергосбережение управляются отдельными настройками. При скрытии или минимизации native player освобождается; восстановление сохраняет позицию, скорость и намерение воспроизведения/паузы.</p>
      </section>
    `
  },

  "proxy": {
    slug: "proxy",
    title: "Прокси и диагностика соединения",
    category: "Функции клиента",
    readingTime: "4 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "media", title: "Встроенный медиаплеер VLC" },
    next: { slug: "troubleshooting", title: "Решение проблем и Safe Mode" },
    headings: [
      { level: 2, id: "protocols", text: "Поддерживаемые протоколы" },
      { level: 2, id: "web-disabled", text: "Почему сохранённый WEB блокирует сеть" },
      { level: 2, id: "auto-switch", text: "Пинг и автоматическое переключение" },
      { level: 2, id: "import", text: "Добавление, импорт и экспорт" }
    ],
    content: `
      <section id="protocols">
        <h2>Поддерживаемые протоколы</h2>
        <p>Доступны SOCKS5 (включая логин/пароль) и MTProto. HTTP CONNECT и WEB не поддерживаются. Старые HTTP-конфигурации при чтении или импорте превращаются в недоступные WEB-записи; их поля сохраняются для экспорта и удаления.</p>
      </section>
      <section id="web-disabled">
        <h2>Почему сохранённый WEB блокирует сеть</h2>
        <p>Если ранее был выбран WEB, клиент передаёт TDLib <code>NetworkTypeNone</code>. Нельзя подключить или пинговать такой прокси. Автопереключение и прямой fallback не обходят блокировку.</p>
        <p>Удаление выбранной WEB-записи само по себе не включает сеть: остаётся CUSTOM без выбранного ID. Для восстановления <strong>явно выберите SOCKS5/MTProto, системный режим или отключите прокси</strong>. Последнее разрешает прямое соединение; выбирайте его только если это соответствует вашим требованиям к сети.</p>
      </section>
      <section id="auto-switch">
        <h2>Пинг и автоматическое переключение</h2>
        <p>Проверки запускаются при открытии настроек прокси, ручном обновлении, импорте и загрузке пользовательской конфигурации. Периодический фоновый мониторинг не следует считать гарантированной возможностью.</p>
        <p>Автовыбор ищет минимальный положительный пинг среди рабочих альтернатив, когда проверка выбранного поддерживаемого прокси завершилась неуспешно. Он не меняет исправный сервер только потому, что другой быстрее. Значение тайм-аута из настроек сейчас не используется в решении checkAutoSwitch; переключение через заданное число секунд не гарантируется.</p>
        <p>Смена прокси может прервать текущее соединение; бесшовная работа загрузок и звонков не обещается.</p>
      </section>
      <section id="import">
        <h2>Добавление, импорт и экспорт</h2>
        <p>Используйте ручное добавление, ссылки <code>tg://proxy</code>, <code>tg://socks</code> и соответствующие адреса t.me, либо импорт/экспорт JSON. Даже если диалог позволяет выбрать .txt, содержимое должно быть JSON-конфигурацией, а не произвольным списком адресов.</p>
        <p>Сканер QR для прокси в текущем интерфейсе не предусмотрен. Не публикуйте конфигурации с паролями и секретами MTProto.</p>
      </section>
    `
  },

  "troubleshooting": {
    slug: "troubleshooting",
    title: "Решение проблем и Safe Mode",
    category: "Поддержка",
    readingTime: "4 мин чтения",
    sectionsCount: "4 раздела",
    prev: { slug: "proxy", title: "Прокси и диагностика соединения" },
    next: { slug: "community", title: "Сообщество и контакты" },
    headings: [
      { level: 2, id: "plugin-issues", text: "Плагин не загружается" },
      { level: 2, id: "safe-mode", text: "Восстановление после ошибки плагина" },
      { level: 2, id: "reset-cache", text: "Кэш и сохранность данных" },
      { level: 2, id: "diagnostics", text: "Окно, сеть и журналы" }
    ],
    content: `
      <section id="plugin-issues">
        <h2>Плагин не загружается</h2>
        <p>Проверьте ОС, архитектуру x86_64 и зависимости библиотеки. Загрузчик ищет её в <code>plugins/</code> portable root. Используйте совместимый с клиентом SDK и экспорт <code>mandagram_plugin_init</code> без C++ name mangling. Метаданные и точный контракт описаны в <a href="/kb/quickstart/">быстром старте</a>.</p>
        <p>Не пытайтесь исправить несовместимость ABI переименованием .so в .dll или добавлением полей из старого JNI-примера. При ошибке init изучите журнал; не включайте проблемный модуль снова без исправления.</p>
      </section>
      <section id="safe-mode">
        <h2>Восстановление после ошибки плагина</h2>
        <p>В «Настройки → Плагины» доступны «Сбросить», «Перезагрузить все плагины», «Очистить кэш теневых копий» и «Открыть папку плагинов». Сначала удалите или обновите проблемное расширение; если оно мешает запуску, работайте с его файлом только при закрытом клиенте.</p>
        <p>Safe Mode — признак обнаруженного аварийного следа. Загрузчик проверяет отключение по имени плагина, поэтому этот признак не гарантирует, что ни один другой модуль не загружен. «Сбросить» очищает состояние Watchdog, но не перезапускает процесс и не загружает библиотеки автоматически. Подробности и ограничения — в <a href="/kb/storage/#watchdog">описании Watchdog</a>.</p>
      </section>
      <section id="reset-cache">
        <h2>Кэш и сохранность данных</h2>
        <p>В «Данные и память» кнопка «Очистить кэш» сейчас очищает кэш аватаров; это не полная очистка скачанных медиа. «Оптимизировать» вызывает TDLib OptimizeStorage. Кэш теневых копий плагинов управляется отдельно в настройках плагинов.</p>
        <p><strong>Не удаляйте всю data ради устранения ошибки.</strong> В ней хранятся аккаунты и сессии. Перед ручным изменением файлов закройте клиент и сохраните приватную резервную копию. Не используйте Panic как очистку кэша.</p>
      </section>
      <section id="diagnostics">
        <h2>Окно, сеть и журналы</h2>
        <p>При проблемах окна попробуйте <code>--software</code> или другой <a href="/kb/installation/#requirements">поддерживаемый renderer</a>. Если нет сети, проверьте сохранённый WEB и явно измените режим прокси.</p>
        <p>Журналы находятся в <code>data/mandagram.log</code> и <code>data/bugs.jsonl</code>; у последнего может быть копия <code>bugs.jsonl.bak</code>. Структурированный журнал ошибок TDLib ограничен 2 МиБ на файл с одной резервной копией. Перед отправкой проверьте и обезличьте содержимое: старые записи автоматически не очищаются от личной информации.</p>
        <p>В отчёте укажите версию, ОС, действия, ожидаемый и фактический результат. Не прикладывайте сессии, базы, тексты сообщений, секреты или полный каталог data.</p>
      </section>
    `
  },

  "community": {
    slug: "community",
    title: "Сообщество и контакты",
    category: "Поддержка",
    readingTime: "2 мин чтения",
    sectionsCount: "2 раздела",
    prev: { slug: "troubleshooting", title: "Решение проблем и Safe Mode" },
    next: null,
    headings: [
      { level: 2, id: "channels", text: "Каналы проекта" },
      { level: 2, id: "contributing", text: "Разработка и сообщения об ошибках" }
    ],
    content: `
      <section id="channels">
        <h2>Каналы проекта</h2>
        <ul>
          <li><a href="https://t.me/MandaGram" target="_blank" rel="noopener">@MandaGram</a> — новости проекта.</li>
          <li><a href="https://t.me/MandaBeta" target="_blank" rel="noopener">@MandaBeta</a> — тестовые сборки, без обещания ежедневного расписания.</li>
          <li><a href="https://t.me/+orCNbISKx9dkYjgy" target="_blank" rel="noopener">КБТ</a> — приглашение в сообщество тестирования.</li>
          <li><a href="https://github.com/GrapeS-T/MandaGram" target="_blank" rel="noopener">GitHub MandaGram</a> — исходный код, выпуски и задачи.</li>
        </ul>
      </section>
      <section id="contributing">
        <h2>Разработка и сообщения об ошибках</h2>
        <p>Для участия прочитайте README и документацию разработки в репозитории клиента. Полезны исправления, воспроизводимые отчёты, уточнения документации и примеры плагинов для актуального ABI.</p>
        <p>В отчёте укажите версию клиента, ОС, шаги воспроизведения, ожидаемый и фактический результат. Для плагина добавьте версию SDK, язык/компилятор и минимальный пример без приватных данных. Не публикуйте data, сессии и секреты; журналы предварительно обезличивайте.</p>
      </section>
    `
  }
};

export const kbSearchData = {
  a: Object.values(kbArticles).map(article => [
    article.slug,
    article.title,
    article.category,
    article.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/&(?:lt|gt|amp|quot|#39|#92);/g, entity => ({
        '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&#92;': '\\'
      })[entity] ?? entity)
      .replace(/\s+/g, ' ')
      .trim()
  ])
};
