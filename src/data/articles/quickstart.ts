export default {
  slug: "quickstart",
  title: "Быстрый старт: первый плагин",
  category: "Разработка плагинов",
  content: `
      <section id="how-it-works">
        <h2>Как устроен плагин MandaGram</h2>
        <p>Плагин — динамическая библиотека C ABI: <code>.dll</code> в Windows или <code>.so</code> в Linux. Загрузчик ищет файлы непосредственно в <code>plugins/</code> portable root. Имя файла без расширения — технический идентификатор; отображаемое имя из метаданных — отдельное значение.</p>
        <blockquote><p><strong>Даже предпросмотр исполняет код.</strong> Перед подтверждением установки клиент может загрузить библиотеку и вызвать <code>mandagram_plugin_metadata</code>; при загрузке также могут выполняться native-конструкторы. «Отмена» не отменяет уже выполненный код. Не открывайте неизвестную DLL/SO ради проверки её описания.</p></blockquote>
        <p>Это не песочница: код работает внутри процесса с доступом к его памяти, файлам и авторизованному клиенту. Используйте доверенные исходники и отдельный пустой portable root без рабочих аккаунтов, сессий и переписки. Для HelloPlugin авторизация не нужна.</p>
      </section>

      <section id="prerequisites">
        <h2>Что подготовить</h2>
        <ul><li><strong>Windows x64:</strong> клиент x86_64, Visual Studio Build Tools с компонентом Desktop development with C++ и Windows SDK. Команды сборки выполняются в <strong>x64 Native Tools Command Prompt</strong>, команды запуска — в PowerShell.</li><li><strong>Linux x86_64:</strong> совместимый клиент, GCC с <code>g++</code> и development-файлы стандартной библиотеки. Условия запуска клиента, включая glibc и графическую среду, — в <a href="/kb/installation/">установке</a>.</li><li><a href="/sdk/mandagram-plugin-sdk.zip" download>Архив SDK и примеров</a> и <a href="/sdk/manifest.json">манифест SDK</a>. Распакуйте архив вне каталога клиента; для этого примера скопируйте только <code>include/mandagram_plugin.h</code> в рабочую папку ниже.</li></ul>
        <p>Документация и SDK привязаны к исходникам движка <code>259fc5a38b64a12c85121838278f78ee72541dfb</code>: <strong>source matched, не runtime certified</strong>. Сверка исходников или успешная компиляция не подтверждает загрузку в конкретном клиенте. Не подменяйте совпадение SDK и клиента предположением, что любой новый выпуск совместим.</p>
      </section>

      <section id="workspace">
        <h2>Отдельная рабочая папка</h2>
        <p>Создайте <code>C:/MandaGramPluginLab</code> в Windows или <code>$HOME/MandaGramPluginLab</code> в Linux. Подготовьте следующую структуру; <code>out/</code>, <code>test-root/data/</code> и <code>test-root/plugins/</code> сначала пусты:</p>
        <div class="code-block"><div class="code-header"><span>Структура перед сборкой</span></div><div class="code-content"><pre>MandaGramPluginLab/
  client/
    MandaGram.exe          (Windows)
    MandaGram.AppImage     (Linux; только файл своей ОС)
  hello/
    include/
      mandagram_plugin.h
    hello.cpp
    out/
  test-root/
    data/
    plugins/</pre></div></div>
        <p>В <code>client/</code> поместите доверенный пакет клиента, но не копируйте рабочую <code>data/</code>. Linux AppImage для команд ниже переименуйте в <code>MandaGram.AppImage</code>. Не используйте симлинк на рабочие данные. Явный <code>--portable-dir</code> отделяет тестовые файлы, но не ограничивает права native-кода.</p>
      </section>

      <section id="exports">
        <h2>Экспортируемые функции</h2>
        <div class="code-block"><div class="code-header"><span>C ABI</span></div><div class="code-content"><pre>const PluginMetadata* mandagram_plugin_metadata(void);
bool mandagram_plugin_init(const PluginApi* api);</pre></div></div>
        <p>Обязателен <code>mandagram_plugin_init</code>; <code>true</code> означает успешную инициализацию. Необязательные метаданные — четыре NUL-terminated UTF-8 строки: name, version, author, description. Структура и строки должны жить в статической памяти. <code>version</code> — версия плагина, не ABI.</p>
        <p>Таблица содержит <strong>53 указателя на функции</strong>, без api_version, размера и согласования версий. Не добавляйте старое поле env в HookParam. Регистрации делайте синхронно в init. Экспорт deinit не вызывается, публичного unregister нет: этот пример не создаёт потоков, внешних callback или долгоживущих ресурсов.</p>
      </section>

      <section id="minimal-example">
        <h2>Минимальный пример (C++)</h2>
        <p>Скопируйте <code>examples/cpp/hello.cpp</code> из архива в <code>hello/hello.cpp</code> или скачайте <a href="/examples/cpp/hello.cpp" download>тот же исходник отдельно</a>. Его содержимое приведено ниже. Макрос экспорта — <code>PLUGIN_EXPORT</code>, логирование принимает тег и сообщение.</p>
        <div class="code-block"><div class="code-header"><span>hello.cpp</span></div><div class="code-content"><pre>#include "mandagram_plugin.h"
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
        <h2>Сборка вне папки плагинов</h2>
        <p>Откройте терминал в <code>hello/</code>. Каталог <code>out/</code> должен существовать. Собирайте на той же ОС под x64; не направляйте вывод компилятора в наблюдаемую папку plugins.</p>
        <div class="code-block"><div class="code-header"><span>Windows · x64 Native Tools Command Prompt</span></div><div class="code-content"><pre>cd /d C:/MandaGramPluginLab/hello
cl /nologo /std:c++17 /O2 /EHsc /LD /Iinclude /Foout/hello.obj hello.cpp /link /OUT:out/hello.dll /IMPLIB:out/hello.lib</pre></div></div>
        <div class="code-block"><div class="code-header"><span>Linux · GCC</span></div><div class="code-content"><pre>cd "$HOME/MandaGramPluginLab/hello"
g++ -std=c++17 -shared -fPIC -O2 -Iinclude hello.cpp -o out/hello.so</pre></div></div>
        <p>Устанавливаемый артефакт — <code>hello/out/hello.dll</code> либо <code>hello/out/hello.so</code>. Не устанавливайте .obj, .lib и .exp. Зависимости выбранного C/C++ runtime должны быть доступны загрузчику ОС; для MSVC может потребоваться соответствующий Visual C++ Redistributable x64.</p>
      </section>

      <section id="install-check">
        <h2>Установка и ожидаемый результат</h2>
        <p>При закрытом клиенте скопируйте готовую <code>hello/out/hello.dll</code> или <code>hello/out/hello.so</code> непосредственно в <code>MandaGramPluginLab/test-root/plugins/</code>. Для первого запуска не нужны аккаунт и доступ к настройкам: загрузчик запускается до экрана авторизации. Затем запустите клиент с явным тестовым root:</p>
        <div class="code-block"><div class="code-header"><span>Windows · PowerShell</span></div><div class="code-content"><pre>&amp; C:/MandaGramPluginLab/client/MandaGram.exe "--portable-dir=C:/MandaGramPluginLab/test-root"</pre></div></div>
        <div class="code-block"><div class="code-header"><span>Linux</span></div><div class="code-content"><pre>chmod +x "$HOME/MandaGramPluginLab/client/MandaGram.AppImage"
"$HOME/MandaGramPluginLab/client/MandaGram.AppImage" "--portable-dir=$HOME/MandaGramPluginLab/test-root"</pre></div></div>
        <ol><li>Останьтесь на экране входа: авторизоваться ради HelloPlugin не нужно.</li><li>Откройте <code>MandaGramPluginLab/test-root/data/mandagram.log</code>. Проверьте указанный в стартовой записи portableDir: он должен совпадать с тестовым root, не с рабочим профилем.</li><li>Ожидается запись с тегом <code>HelloPlugin</code> и текстом <code>Plugin initialized</code>, а также сообщения загрузчика о библиотеке с техническим именем <code>hello</code>.</li></ol>
        <p><strong>Если в отдельном тестовом root уже авторизован тестовый аккаунт:</strong> откройте <strong>Настройки → Плагины → Открыть папку плагинов</strong> и сверьте путь с <code>MandaGramPluginLab/test-root/plugins/</code>. В списке ожидается <strong>Hello Plugin</strong>. На экране входа настройки плагинов недоступны; для проверки без авторизации достаточно файла и журнала.</p>
        <p>В Windows portable launcher обрабатывает --portable-dir и передаёт абсолютный путь клиенту. В Linux AppRun передаёт аргумент дальше, а Main задаёт свойство portable root до инициализации загрузчика. Рабочий каталог Linux launcher при этом может оставаться рядом с AppImage: для файлов плагина используйте возвращаемые API пути, а не относительные пути процесса.</p>
        <p>Пример только пишет в журнал: он не меняет сообщения и не создаёт UI. Это ожидаемый результат по исходникам, а не отчёт о выполненной здесь native-проверке. При отсутствии записи проверьте сообщения PluginLoader/PluginBridge, экспорт init, архитектуру, зависимости и отключение плагина по имени.</p>
      </section>

      <section id="recovery">
        <h2>Восстановление и следующие шаги</h2>
        <p>Если клиент завис или перестал запускаться, завершите тестовый процесс, уберите hello.dll/hello.so из тестовой папки plugins и снова запустите без него. Сохраните обезличенный журнал; не удаляйте data ради исправления плагина. Safe Mode и «Сбросить» не делают библиотеку безопасной и не заменяют исправление причины.</p>
        <blockquote><p><strong>Ограничение After:</strong> в этой ревизии native After не подменяет обычный результат метода установкой result/has_result. Мост не переносит нужный флаг в JVM. Не строите на таком приёме первый плагин; детали — в <a href="/kb/api/#method-hooks">описании хуков</a>.</p></blockquote>
        <p>Далее: <a href="/kb/examples/">примеры на четырёх языках</a>, <a href="/kb/api-reference/">справочник всех 53 функций</a>, <a href="/kb/plugin-recipes/">практические рецепты</a>, <a href="/kb/hotreload/">ограничения hot-reload</a> и <a href="/kb/troubleshooting/">диагностика</a>.</p>
      </section>
    `
};
