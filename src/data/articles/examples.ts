export default {
  slug: "examples",
  title: "Примеры на C++, Rust, Zig и D",
  category: "Разработка плагинов",
  content: `
      <section id="prepare">
        <h2>Один сценарий, четыре языка</h2>
        <p>Все примеры удаляют точный префикс <code>.plain </code> из исходящего текста. Нет фиктивных JVM-методов, JNI и выделения памяти в обработчике. Возвращается подстрока входного буфера; мост читает её до освобождения. Не сохраняйте этот указатель после callback.</p>
        <p>Скачайте <a href="/sdk/mandagram-plugin-sdk.zip" download>SDK с примерами</a> и сохраните структуру examples/include, examples/cpp, examples/rust/src, examples/zig, examples/d. Заголовки верхнего include и examples/include представляют тот же SDK. <a href="/sdk/manifest.json">Манифест</a> привязан к <code>259fc5a38b64a12c85121838278f78ee72541dfb</code>; статус — <strong>source matched, не runtime certified</strong>.</p>
        <blockquote><p><strong>Предпросмотр не безопасен для неизвестных файлов:</strong> клиент может загрузить библиотеку и вызвать metadata до подтверждения установки. Собирайте доверенные исходники для Windows/Linux x64 и используйте отдельный root из <a href="/kb/quickstart/">быстрого старта</a>, не рабочие аккаунты.</p></blockquote>
      </section>

      <section id="cpp">
        <h2>Пример на C++</h2>
        <p>Исходники: <a href="/examples/cpp/plugin.cpp" download>cpp/plugin.cpp</a> и <a href="/examples/include/mandagram_plugin.h" download>include/mandagram_plugin.h</a>. Нужен GCC с C++17 в Linux или Visual Studio Build Tools с C++ и Windows SDK в Windows. Windows-команда выполняется в x64 Native Tools Command Prompt. Обе команды ниже запускаются из <strong>examples/</strong>.</p>
        <div class="code-block"><div class="code-header"><span>Обработчик</span></div><div class="code-content"><pre>static const char* before_send(int64_t, const char* text, uintptr_t) noexcept {
    if (text &amp;&amp; std::strncmp(text, ".plain ", 7) == 0) return text + 7;
    return text;
}
// В mandagram_plugin_init:
return api-&gt;register_message_send_hook(before_send, nullptr, 0) == 0;</pre></div></div>
        <div class="code-block"><div class="code-header"><span>Linux · из examples/</span></div><div class="code-content"><pre>g++ -std=c++17 -O2 -fPIC -shared -Iinclude cpp/plugin.cpp -o plain_cpp.so</pre></div></div>
        <div class="code-block"><div class="code-header"><span>Windows · из examples/</span></div><div class="code-content"><pre>cl /nologo /std:c++17 /O2 /EHsc /LD /Iinclude cpp/plugin.cpp /link /OUT:plain_cpp.dll</pre></div></div>
        <p>Устанавливаемый файл — <code>examples/plain_cpp.so</code> или <code>examples/plain_cpp.dll</code>. Полный исходник содержит статические метаданные и init. Зависимости runtime компилятора должны быть доступны клиенту; .lib/.exp/.obj не являются плагинами.</p>
      </section>

      <section id="rust">
        <h2>Пример на Rust</h2>
        <p>Нужен Rust/Cargo <strong>1.85.0 или новее</strong> и системный linker. В Windows используйте x86_64-pc-windows-msvc и установленные MSVC Build Tools/Windows SDK, в Linux — x86_64-unknown-linux-gnu с системным C toolchain. Не копируйте Linux-артефакт в Windows.</p>
        <p>Файлы: <a href="/examples/rust/Cargo.toml" download>Cargo.toml</a> и <a href="/examples/rust/src/lib.rs" download>src/lib.rs</a>. Сохраните вложенность src. Пример — edition 2021, cdylib, repr(C), полная таблица 53 функций, extern C callbacks и usize для uintptr_t.</p>
        <div class="code-block"><div class="code-header"><span>Из examples/rust/</span></div><div class="code-content"><pre>cargo build --release</pre></div></div>
        <p>Артефакт: <code>target/release/mandagram_plugin_rust.dll</code> или <code>target/release/libmandagram_plugin_rust.so</code> относительно examples/rust. Метаданные используют неизменяемые статические строки; этим обоснован Sync структуры. Обработчик возвращает указатель со смещением без CString, unwrap и аллокаций.</p>
        <p><code>panic = "abort"</code> запрещает unwind через ABI, но <strong>не восстанавливает клиент после panic</strong>: процесс может завершиться. Не удерживайте Rust references к данным хоста после callback.</p>
      </section>

      <section id="zig">
        <h2>Пример на Zig</h2>
        <p>Используйте <strong>Zig 0.14.1</strong>; совместимость build API с другими версиями не предполагается. Файлы: <a href="/examples/zig/plugin.zig" download>plugin.zig</a>, <a href="/examples/zig/build.zig" download>build.zig</a> и соседний <a href="/examples/include/mandagram_plugin.zig" download>../include/mandagram_plugin.zig</a>. SDK подключён именованным модулем: не переносите include внутрь zig и не меняйте импорт на выход за module root.</p>
        <div class="code-block"><div class="code-header"><span>Из examples/zig/ · host x64</span></div><div class="code-content"><pre>zig build -Doptimize=ReleaseSafe</pre></div></div>
        <p>Артефакт относительно examples/zig: <code>zig-out/lib/libsample_plugin.so</code> в Linux или <code>zig-out/bin/sample_plugin.dll</code> в Windows. Callback использует callconv(.c), строки — sentinel-terminated UTF-8. Проверка optional function pointer не заменяет подбор совместимой таблицы ABI; ReleaseSafe не изолирует ошибку от процесса клиента.</p>
      </section>

      <section id="d">
        <h2>Пример на D (betterC)</h2>
        <p>Используйте <strong>LDC 1.40.0</strong> для x64 и системный linker; в Windows подготовьте Native Tools x64. Скачайте <a href="/examples/d/mandagram_plugin.d" download>mandagram_plugin.d</a> и <a href="/examples/d/dub.json" download>dub.json</a>. Один модуль содержит C-совместимые структуры, таблицу API, метаданные и обработчик.</p>
        <div class="code-block"><div class="code-header"><span>Linux · из examples/d/</span></div><div class="code-content"><pre>ldc2 -betterC -shared -O -relocation-model=pic mandagram_plugin.d -of=plain_d.so</pre></div></div>
        <div class="code-block"><div class="code-header"><span>Windows · из examples/d/</span></div><div class="code-content"><pre>ldc2 -betterC -shared -O mandagram_plugin.d "-of=plain_d.dll"</pre></div></div>
        <p>Устанавливаемый файл — <code>examples/d/plain_d.so</code> либо <code>examples/d/plain_d.dll</code>. Эти команды явно задают имя артефакта; DUB-конфигурация использует другое targetName. Функции имеют extern(C), обработчик не требует GC или D runtime. Не добавляйте собственный DllMainCRTStartup и не подменяйте JNI-таблицы.</p>
      </section>

      <section id="expected-output">
        <h2>Ожидаемое поведение и границы .plain</h2>
        <p>Установите только один пример за раз: все четыре регистрируют одинаковое преобразование, поэтому совместная установка не является независимой проверкой. После сборки перенесите готовый файл в верхний уровень plugins отдельного тестового клиента, лучше при закрытом процессе. Сообщения загрузчика — в <code>&lt;test-root&gt;/data/mandagram.log</code>.</p>
        <ul><li><code>.plain Привет</code> → <code>Привет</code> на обычном пути отправки текста. При замене текста сбрасываются entities форматирования.</li><li><code>Привет</code>, <code>.plain</code> без пробела и <code>.Plain Привет</code> проходят без изменения: сравнение точное и чувствительно к регистру.</li><li><code>.plain </code> даёт пустую строку, <strong>не отмену отправки</strong>. Дальнейшая обработка/ошибка пустого сообщения зависит от клиента и TDLib; не используйте это как cancel.</li><li>Если остаток начинается точно с <code>{&quot;@type&quot;:</code>, движок может интерпретировать его как структурированный InputMessageContent, а не буквальный текст. При неудаче разбора возможен обычный текст. Поэтому имя Plain Text не является гарантией безопасного экранирования JSON.</li><li>Это не общий фильтр медиа и не перехват любых прямых запросов TDLib; null из before-send также означает «без изменений», а не отмену.</li></ul>
        <p>Это ожидаемые результаты по исходникам, а не выполненная runtime-сертификация. Проверка реальной отправки требует отдельного тестового аккаунта и чата без личных данных; HelloPlugin из быстрого старта обходится без аккаунта. After-send сообщает объект отправленного сообщения, не прочтение или гарантированную доставку.</p>
      </section>

      <section id="buffers">
        <h2>Буферы и дальнейшие примеры</h2>
        <p>Обработчики .plain не создают выходной буфер: возвращаемая подстрока остаётся NUL-terminated в памяти текущего вызова. Не заменяйте её указателем на стек или общим изменяемым буфером для конкурентных callback.</p>
        <p>C++ SDK использует фиксированные 1024 байта для путей, 8192 для JSON, 2048 для строк. Обёртки молча возвращают усечённый результат. Для контролируемого чтения используйте C out_buf/max_len: длина — число скопированных байт без нуля, максимум max_len − 1; значение на пределе потенциально усечено. Полный требуемый размер не возвращается, обрезанный UTF-8/JSON нельзя принимать за полный ответ.</p>
        <p>Не повторяйте query с побочными эффектами только ради большего буфера или после 408: таймаут не отменяет уже отправленную операцию. Native After после обычного возврата метода не обеспечивает подмену результата — <a href="/kb/api/#method-hooks">известное ограничение моста</a>. В примерах используются высокоуровневые события, а не этот механизм.</p>
        <p>Далее: <a href="/kb/api-reference/">точный справочник API</a>, <a href="/kb/plugin-recipes/">практические рецепты</a> и <a href="/kb/hotreload/">жизненный цикл</a>. Shutdown/deinit отсутствует: примеры не рекомендуют фоновые native workers.</p>
      </section>
    `
};
