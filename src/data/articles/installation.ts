export default {
  slug: "installation",
  title: "Установка на Windows и Linux",
  category: "Начало работы",
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
};
