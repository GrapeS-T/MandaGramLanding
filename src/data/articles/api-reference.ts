export default {
  slug: "api-reference",
  title: "Справочник PluginApi: все 53 функции",
  category: "Разработка плагинов",
  content: `
    <section id="contract">
      <h2>Контракт, память и потоки</h2>
      <p>Справочник описывает 53 слота C ABI (0–52) по <code>src/native/include/mandagram_plugin.h</code>, <code>PluginBridge.kt</code>, <code>ComposeInterop.kt</code>, <code>ObjectHandleScope.kt</code>, <code>TdlibJsonBridge.kt</code> и <code>XposedEngine.kt</code> клиента, ревизия <code>259fc5a38b64a12c85121838278f78ee72541dfb</code>. Это анализ исходников, не подтверждение исполнения native-плагина в клиенте. <a href="/include/mandagram_plugin.h" download>Скачать точный C-заголовок</a>; <a href="/kb/plugin-recipes">полный практический пример</a>.</p>
      <p>Ниже записаны сигнатуры вызова через <code>api-&gt;имя(...)</code>; в структуре это указатели на функции. Текущая раскладка рассчитана на x64: <code>uintptr_t</code> и handles имеют 64 бита, <code>HookParam</code> — 40 байт. Нет поля версии/размера таблицы, negotiation, публичного unregister, deinit, retain/release или планировщика задач. Проверка ненулевых указателей не делает старую/короткую таблицу совместимой. Используйте SDK именно своей версии клиента.</p>
      <ul>
        <li><code>jobject</code>, <code>this_ptr</code>, элементы <code>args</code> и <code>result</code> — непрозрачные числовые handles JVM, упакованные в pointer-sized значения. Это не адреса объектов и не JNI references: не разыменовывайте, не освобождайте, не передавайте в JNI.</li>
        <li><code>HookParam*</code>, его массив аргументов и входные UTF-8 строки действуют только во время callback. Локальные handles method-hook удаляются при выходе из frame. Не сохраняйте их между вызовами или потоками. Внутренний реестр имеет global handles, но C API не предоставляет способа ими управлять; отсутствие frame в отдельных путях не является обещанием бессрочного владения.</li>
        <li>Строковые аргументы — корректная память с NUL-терминатором. Имена классов/методов/полей/ключей/плагинов, descriptor, asset name, action id/label и путь аватара читаются в окне 1024 байта: максимум 1023 байта до NUL. У журнала tag — 1024, msg — 4096; JSON, создаваемая строка и текст Compose не имеют такого малого ограничителя, поэтому особенно важен корректный NUL. Размеры — байты, не символы. Невалидный native-указатель не становится безопасным из-за Kotlin try/catch.</li>
        <li>Выходной буфер принадлежит вызывающему. Он не сохраняется хостом. Результат функции с буфером — число <em>скопированных</em> байтов без NUL, не требуемая длина. При <code>max_len &gt; 0</code> и ненулевом буфере записывается NUL. При null-буфере или неположительном размере мост возвращает 0; <code>uint32_t max_len</code> внутри читается как signed Int, поэтому не передавайте больше INT32_MAX. Отрицательный результат — ошибка обёртки. При <code>n == max_len - 1</code> нельзя отличить точное заполнение от усечения; UTF-8 и JSON могут оборваться посередине.</li>
        <li>C++ удобные обёртки используют фиксированные буферы: 1024 для путей, 8192 для JSON, 2048 для строк; усечение не сообщается отдельно. Для критичных данных используйте C-функцию и проверяйте длину. Повторный TDLib-вызов с большим буфером повторяет сам запрос, а не только чтение ответа.</li>
        <li>Callback выполняется на потоке вызывающего хоста: method-hook — на потоке метода, Compose — в текущей композиции, chat action — из UI, message/update — в соответствующем пути клиента. API не переводит произвольную работу на UI или отдельный worker и не обещает сериализацию callback. UI/state/Compose трогайте только в корректном контексте хоста, общие native-счётчики синхронизируйте. C++ исключения не должны пересекать FFI.</li>
        <li>Регистрируйте callbacks синхронно в init: принадлежность плагину определяется scoped-контекстом загрузчика; вне него используется ключ <code>global</code>. <code>user_data</code> — передаваемое без интерпретации 64-битное значение, хост не владеет указанной им памятью. Код callback и данные должны оставаться живы. Нет безопасного общего рецепта detached worker: при unload библиотека и API arena закрываются без deinit/join-протокола.</li>
      </ul>
      <p>Нулевой handle/0/false во многих getters означает как нормальное значение, так и ошибку. Единого <code>last_error</code> нет. Для void-вызовов отсутствие ошибки в журнале не подтверждает результат. Ошибки FFM и незащищённых Compose операций не имеют общего числового статуса.</p>
    </section>

    <section id="core"><h2>Ядро: слоты 0–8</h2></section>
    <section><h3 id="register_hook">register_hook · слот 0</h3>
      <pre><code>int32_t register_hook(const char* class_name, const char* method_name,
    const char* method_descriptor, HookBeforeFn before_cb, HookAfterFn after_cb);</code></pre>
      <p><code>class_name</code> — JVM-класс (точки или слеши); <code>method_name</code> — скомпилированное имя; <code>method_descriptor</code> — точный JVM descriptor либо null для выбора по имени. Before/After имеют тип <code>void (*)(HookParam*)</code>; каждый можно передать null. Возвращает 0 после регистрации, -1 при перехваченной ошибке; 0 не доказывает, что метод найден, инструментирован и вызван. Точный descriptor имеет приоритет: если для него есть список hooks, общий name-only список не объединяется с ним.</p>
      <p>Before может заменить <code>args[i]</code> подходящими handles. <code>return_early != 0</code> или <code>has_result != 0</code> пропускает оригинал; result должен соответствовать JVM-типу. Нулевой bridge.result в текущем Before преобразуется в Kotlin Unit: не обещается корректная подмена nullable-result на null. Не меняйте args_count, адрес массива или layout. В After изменения args обратно не копируются.</p>
      <p><strong>Известный дефект native After:</strong> на обычном возврате <code>PluginBridge.kt:1226–1243</code> присваивает result, но не выставляет <code>hasResultBeenSet</code>; <code>XposedEngine.kt:294</code> при отсутствии этого флага возвращает исходный результат. Даже установка native <code>has_result</code> не исправляет этот путь. Не используйте After как надёжную подмену результата. Нужны доказанные имя/descriptor/тип и диагностика своей сборки; <a href="/kb/plugin-recipes#advanced-diagnostics">порядок проверки</a>.</p>
    </section>
    <section><h3 id="log_info">log_info · слот 1</h3>
      <pre><code>void log_info(const char* tag, const char* msg);</code></pre>
      <p>Передаёт tag/msg в AppLogger на уровне info; NUL должен помещаться в 1024/4096 байт соответственно. Возврата/подтверждения нет, перехваченные ошибки молча игнорируются. Строки читаются в рамках вызова. Не записывайте тексты сообщений, токены, номера телефонов или полные TDLib-ответы; журнал может содержать чувствительные данные.</p>
    </section>
    <section><h3 id="log_error">log_error · слот 2</h3>
      <pre><code>void log_error(const char* tag, const char* msg);</code></pre>
      <p>Те же параметры и пределы, что у log_info, уровень error. Ошибка логирования не возвращается. Это не отключение плагина и не исключение для клиента; передавайте короткую обезличенную диагностику. Не используйте журнал в каждом receive callback.</p>
    </section>
    <section><h3 id="get_storage_dir">get_storage_dir · слот 3</h3>
      <pre><code>int32_t get_storage_dir(const char* plugin_name, char* out_buf, uint32_t max_len);</code></pre>
      <p><code>plugin_name</code> — выбранный стабильный namespace плагина, а не автоматически подставляемое metadata.name. Возвращает абсолютный путь <code>plugins/data/&lt;plugin_name&gt;</code>; менеджер пытается создать каталог. Результат — длина по общему контракту буферов, -1 при исключении. Успешная длина не доказывает успешность mkdir или возможность записи. Используйте постоянное безопасное имя без компонентов пути, не пользовательский ввод: это не sandbox. Файловое чтение/запись выполняет сам плагин. Конфигурацию читайте в init до регистрации callbacks.</p>
    </section>
    <section><h3 id="get_cache_dir">get_cache_dir · слот 4</h3>
      <pre><code>int32_t get_cache_dir(const char* plugin_name, char* out_buf, uint32_t max_len);</code></pre>
      <p>Те же параметры, результат и ошибки, что у get_storage_dir; путь — <code>plugins/cache/&lt;plugin_name&gt;</code>, каталог пытаются создать. Это место для восстанавливаемых файлов, не гарантия постоянного хранения или очистки по расписанию. Сам вызов не записывает содержимое кэша и не ограничивает доступ к остальной файловой системе.</p>
    </section>
    <section><h3 id="resolve_asset">resolve_asset · слот 5</h3>
      <pre><code>int32_t resolve_asset(const char* plugin_name, const char* asset_name,
    char* out_buf, uint32_t max_len);</code></pre>
      <p>Ищет существующий обычный файл. asset_name обрезается по краям и лишается одного ведущего / и одного ведущего обратного слеша; затем проверяются <code>plugins/assets/&lt;plugin&gt;/</code>, <code>plugins/&lt;plugin&gt;/</code>, <code>data/cache/</code>, <code>dist/data/cache/</code> и сам относительный путь. Возвращает длину абсолютного пути, 0 с пустой строкой при отсутствии, -1 при исключении. Общие правила усечения применимы. Это не извлечение ресурса и не защита от traversal: не передавайте недоверенные имена. Наличие файла сейчас не гарантирует последующее открытие.</p>
    </section>
    <section><h3 id="get_current_user_id">get_current_user_id · слот 6</h3>
      <pre><code>int64_t get_current_user_id(void);</code></pre>
      <p>Снимок <code>TelegramService.currentUser</code>: ID текущего пользователя или 0, если пользователя нет. Параметров нет, сеть не вызывается, отдельного статуса ошибки нет. Это не авторизация и не гарантия активности TDLib. ID — чувствительные данные; не выводите его без необходимости.</p>
    </section>
    <section><h3 id="get_active_chat_id">get_active_chat_id · слот 7</h3>
      <pre><code>int64_t get_active_chat_id(void);</code></pre>
      <p>Снимок активного чата или 0 при отсутствии. Не гарантирует, что пользователь не сменит чат сразу после чтения. В chat-action callback используйте переданный chat_id, а не новое глобальное чтение; он относится к действию. Параметров и отдельного кода ошибки нет.</p>
    </section>
    <section><h3 id="execute_tdlib_query">execute_tdlib_query · слот 8</h3>
      <pre><code>int32_t execute_tdlib_query(const char* json_query, char* out_buf, uint32_t max_len);</code></pre>
      <p><code>json_query</code> — UTF-8 объект с <code>@type</code>; например <code>{"@type":"getMe"}</code>. Возвращает количество байтов JSON-ответа или JSON-error, -1 при ошибке внешней обёртки. Положительная длина не означает успех TDLib. Проверяйте усечение, корректность JSON, <code>@type</code>, затем code/message либо ожидаемые поля результата. Нельзя запрашивать длину нулевым буфером: запрос всё равно выполняется.</p>
      <p>Внутри <code>runBlocking(AppDispatchers.Network)</code> блокирует вызывающий поток. Сначала пробуется synchronous execute, затем send с ожиданием future до 7 секунд. Error 400 — неправильный объект/неподдержанная функция; 503 — нет активного клиента (getMe может вернуть кэш currentUser); 408 — истекло ожидание send; 500 — перехваченное исключение. Также возвращаются ошибки TDLib с её кодами. <strong>408 не отменяет уже отправленный запрос</strong>; повтор mutation может выполнить действие дважды. 7 секунд — не общий deadline парсинга/execute/всего вызова.</p>
      <p>Это собственный bridge к TdApi, не полная совместимость с tdjson: ID передавайте JSON-числами без потери int64, bytes — числовыми массивами, не строками ID/base64. Ошибочные типы полей могут молча превратиться в 0, false, пустые значения или остаться значениями по умолчанию. Набор функций зависит от классов TdApi и reflection-конвертера. Не вызывайте из UI/Compose, update/receive callback или перехваченного метода с неизвестными блокировками. Нет предоставленного ABI безопасного async executor; <a href="/kb/plugin-recipes#tdlib-lifecycle">ограничение жизненного цикла</a>.</p>
    </section>

    <section id="compose-runtime"><h2>Низкоуровневый Compose: слоты 9–16</h2>
      <p>Работайте только в действующей композиции и на её потоке, с handles текущего вызова. Эти функции не создают UI-контекст и не обеспечивают ABI-совместимость разных Compose-компиляторов. Отсутствие exception не подтверждает отрисовку. Нативный UI-пример, проверенный исполнением для указанной ревизии, здесь не заявляется.</p>
    </section>
    <section><h3 id="create_composable_lambda">create_composable_lambda · слот 9</h3>
      <pre><code>jobject create_composable_lambda(ComposableFn cb, uintptr_t user_data);
// ComposableFn: void (*)(jobject composer, uintptr_t user_data)</code></pre>
      <p>Создаёт handle JVM Function2&lt;Composer, Int, Unit&gt;, вызывающей cb с composer и user_data. cb=null делает dispatch пустым, но не является диагностикой создания. Возвращённый handle не освобождайте и не сохраняйте как native global reference. Фабрика не ловит все ошибки и не возвращает унифицированный error status. Callback pointer может быть удержан JVM-лямбдой дольше текущего вызова; нет публичного протокола её отзыва перед unload. Это не Function0 для clickable.</p>
    </section>
    <section><h3 id="create_scoped_lambda">create_scoped_lambda · слот 10</h3>
      <pre><code>jobject create_scoped_lambda(ScopedComposableFn cb, uintptr_t user_data);
// ScopedComposableFn: void (*)(jobject scope, jobject composer, uintptr_t user_data)</code></pre>
      <p>Создаёт handle Function3&lt;Any?, Composer, Int, Unit&gt; для scoped content Row/Column/Box. scope приходит от контейнера, не создаётся плагином. Результат, cb=null, владение, ошибки и риск удержания native callback — как у create_composable_lambda. Используйте scope только в текущем вызове, например для modifier_weight у Row/Column.</p>
    </section>
    <section><h3 id="replace_composable">replace_composable · слот 11</h3>
      <pre><code>void replace_composable(HookParam* param, ComposableFn cb, uintptr_t user_data);</code></pre>
      <p>В Before ищет настоящий Composer среди handles args, открывает replaceable group с ключом <code>0x5850434C</code>, вызывает cb, закрывает группу и выставляет return_early/has_result с результатом Kotlin Unit. Рассчитано на совместимый Unit-returning composable, не произвольный метод. param=null или cb=null — no-op. При отсутствии Composer пишет <code>replace_composable: Composer not found in HookParam arguments!</code>; прочие перехваченные ошибки тоже журналируются, статуса нет. Не используйте как исправление дефекта After.</p>
    </section>
    <section><h3 id="composer_start_group">composer_start_group · слот 12</h3>
      <pre><code>void composer_start_group(jobject composer, int32_t key);</code></pre>
      <p>Открывает <code>startReplaceableGroup(key)</code>. composer — handle текущего Composer, key — стабильный ключ данной позиции композиции. Нулевой/не-Composer handle даёт no-op. Возврата нет; ошибки настоящего Composer не превращаются в status. Балансируйте end_group на том же потоке и пути исполнения. Это не restart group и не ручной планировщик recomposition.</p>
    </section>
    <section><h3 id="composer_end_group">composer_end_group · слот 13</h3>
      <pre><code>void composer_end_group(jobject composer);</code></pre>
      <p>Закрывает текущую replaceable group через endReplaceableGroup. Параметр — тот же действующий Composer; нулевой/неверного типа handle игнорируется, статуса нет. Лишний end или незакрытая группа повреждают протокол композиции; вызов не проверяет баланс за плагин.</p>
    </section>
    <section><h3 id="composer_get_remembered">composer_get_remembered · слот 14</h3>
      <pre><code>jobject composer_get_remembered(jobject composer);</code></pre>
      <p>Читает rememberedValue в текущей позиции группы и возвращает handle значения; не-Composer даёт null. Новый slot может содержать внутренний sentinel Compose, а не null; C ABI не экспортирует специальную проверку этого sentinel. Нельзя принимать любой ненулевой handle за инициализированное значение своего типа. Владение и поток — общие правила handles; отдельного error status нет.</p>
    </section>
    <section><h3 id="composer_set_remembered">composer_set_remembered · слот 15</h3>
      <pre><code>void composer_set_remembered(jobject composer, jobject val);</code></pre>
      <p>Передаёт объект val (null разрешён как значение) в updateRememberedValue текущей позиции; не-Composer игнорируется. Не создаёт MutableState, не закрепляет native handle и не предоставляет destructor для native user_data. Требуются корректные group/slot-порядок и поток; числового результата нет.</p>
    </section>
    <section><h3 id="composer_is_skipping">composer_is_skipping · слот 16</h3>
      <pre><code>bool composer_is_skipping(jobject composer);</code></pre>
      <p>Возвращает свойство skipping текущего Composer; null/другой тип — false. Это только чтение: функция не пропускает группу и не заменяет compiler-generated changed/default masks. False нельзя считать подтверждением валидности handle.</p>
    </section>

    <section id="events"><h2>События: слоты 17–20</h2>
      <p>Регистрации не возвращают subscription handle: 0 означает добавление extension, а не право позже вызвать unregister. Выполняйте их в init. user_data копируется как число. Callback должен быть коротким, потокобезопасным и без C++ исключений; хост не обещает, что unload дождётся всех выполняющихся callbacks.</p>
    </section>
    <section><h3 id="register_update_hook">register_update_hook · слот 17</h3>
      <pre><code>int32_t register_update_hook(UpdateHookFn cb, uintptr_t user_data);
// UpdateHookFn: bool (*)(const char* update_json, uintptr_t user_data)</code></pre>
      <p>Регистрирует наблюдение входящих TdApi.Update, сериализованных собственным JSON bridge. cb возвращает true для продолжения обычной обработки, false для запрета дальнейшей обработки update клиентом; остальные update hooks всё равно вызываются, их результат агрегируется. Это не отмена серверного события. cb=null, disabled-плагин и перехваченная ошибка callback пропускают update. update_json действует только во время вызова. Возвращает 0; внешний upcall регистрации не имеет общего catch с -1. Не блокируйте поток получения и не вызывайте здесь синхронный TDLib.</p>
    </section>
    <section><h3 id="register_message_send_hook">register_message_send_hook · слот 18</h3>
      <pre><code>int32_t register_message_send_hook(MessageBeforeSendFn before_cb,
    MessageAfterSendFn after_cb, uintptr_t user_data);
// before: const char* (*)(int64_t chat_id, const char* text, uintptr_t user_data)
// after: void (*)(int64_t chat_id, int64_t message_id, uintptr_t user_data)</code></pre>
      <p>before_cb и after_cb независимы, каждый может быть null. Before вызывается для InputMessageText в обычном пути отправки. Возврат исходного текста или null оставляет текст неизменным; <strong>null и пустая строка не отменяют отправку</strong>. Изменённый текст сбрасывает entities форматирования. Строка с точным префиксом <code>{&quot;@type&quot;:</code> может стать структурированным InputMessageContent; не рассматривайте удаление текстового префикса как всегда безопасный plain-text transform. Если распознанный объект не является InputMessageContent, остаётся текст; исключение разбора обрабатывается внешним catch.</p>
      <p>Хост копирует возвращённую NUL-строку сразу после возврата callback и не делает free. Разрешены исходный указатель, его живая подстрока или статическая строка; нельзя возвращать стековый буфер. After сообщает ID полученного объектом send результата Message, а не прочтение/окончательную доставку. Хук не покрывает все media/произвольные запросы TDLib. Регистрация возвращает 0; отдельного общего -1 catch для этого upcall нет.</p>
    </section>
    <section><h3 id="register_message_receive_hook">register_message_receive_hook · слот 19</h3>
      <pre><code>int32_t register_message_receive_hook(MessageReceiveFn cb, uintptr_t user_data);
// MessageReceiveFn: void (*)(int64_t chat_id, int64_t message_id,
//                           const char* text, uintptr_t user_data)</code></pre>
      <p>Сообщает chat_id/message_id и текст MessageText; для другого content передаётся пустая строка, не обязательно caption. Это уведомление текущего receive-пути, не выгрузка истории, не фильтр и не обещание exactly-once. cb=null ничего не делает при dispatch. Строка временная; для статистики не нужно её читать или сохранять. Возвращает 0; общего -1 catch регистрации нет. Callback не возвращает отмену. <a href="/kb/plugin-recipes#counter">Рецепт считает вызовы без хранения текста и ID</a>.</p>
    </section>
    <section><h3 id="register_chat_action">register_chat_action · слот 20</h3>
      <pre><code>int32_t register_chat_action(const char* id, const char* label,
    ChatActionClickFn click_cb, uintptr_t user_data);
// ChatActionClickFn: void (*)(int64_t chat_id, uintptr_t user_data)</code></pre>
      <p>id — стабильный уникальный идентификатор с namespace плагина; label — подпись действия. Обе строки копируются при регистрации, лимит чтения 1024 байта. Встраивает действие без иконки, callback получает целевой chat_id. Нет автоматической проверки уникальности или API изменения/удаления по id. click_cb=null оставляет действие без native-реакции. Возвращает 0 или -1 при перехваченной ошибке. UI callback не должен выполнять файловое чтение, ожидание future или execute_tdlib_query.</p>
    </section>

    <section id="reflection"><h2>Поля, строки и State: слоты 21–34</h2>
      <p>Доступ идёт к настоящим JVM-объектам, не к копиям. field_name/key — NUL-строки короче 1024 байт. Reflection-getters подавляют ошибки до null/0/false, setters — до no-op; ни диагностики типа, ни проверки успеха через status нет. Используйте доказанные имена/типы своей сборки и поток владельца объекта. Непрозрачный handle не даёт автоматической синхронизации.</p>
    </section>
    <section><h3 id="get_object_field">get_object_field · слот 21</h3>
      <pre><code>jobject get_object_field(jobject obj, const char* field_name);</code></pre>
      <p>obj — handle экземпляра, field_name — имя поля. Возвращает handle прочитанного объекта; null означает также null-поле, отсутствующий obj, недоступное/неизвестное поле или ошибку. Примитивное значение reflection может представить boxed-объектом, не native integer. Результат подчиняется сроку жизни текущего frame.</p>
    </section>
    <section><h3 id="set_object_field">set_object_field · слот 22</h3>
      <pre><code>void set_object_field(jobject obj, const char* field_name, jobject val);</code></pre>
      <p>Записывает JVM-объект val (нулевой handle означает null) в поле экземпляра obj. Тип должен быть присваиваемым полю. Нет результата; null obj и ошибки reflection молча игнорируются. Передача адреса native-структуры вместо handle не создаёт JVM-объект.</p>
    </section>
    <section><h3 id="get_int_field">get_int_field · слот 23</h3>
      <pre><code>int32_t get_int_field(jobject obj, const char* field_name);</code></pre>
      <p>Читает поле через Java reflection getInt и возвращает int32. Параметры — объект и точное имя совместимого примитивного поля. 0 означает как значение, так и null obj/ошибку; это не универсальное преобразование строки или boxed Number.</p>
    </section>
    <section><h3 id="set_int_field">set_int_field · слот 24</h3>
      <pre><code>void set_int_field(jobject obj, const char* field_name, int32_t val);</code></pre>
      <p>Записывает val через reflection setInt. Требуется совместимый тип поля; неправильное имя/тип/null obj молча игнорируются. Возврата и проверки записи нет; запись не является atomic/snapshot-операцией для модели клиента.</p>
    </section>
    <section><h3 id="get_long_field">get_long_field · слот 25</h3>
      <pre><code>int64_t get_long_field(jobject obj, const char* field_name);</code></pre>
      <p>Читает совместимое примитивное поле через getLong, возвращает int64 без JSON-преобразования. 0 также служит fallback для null obj и ошибок. Не используйте get_int_field для 64-битных chat/message ID.</p>
    </section>
    <section><h3 id="set_long_field">set_long_field · слот 26</h3>
      <pre><code>void set_long_field(jobject obj, const char* field_name, int64_t val);</code></pre>
      <p>Записывает int64 val через setLong в совместимое поле obj. Ошибки/отсутствующий объект подавляются, статус не возвращается. Не подменяет бизнес-операцию TDLib и не обновляет автоматически связанные данные клиента.</p>
    </section>
    <section><h3 id="get_bool_field">get_bool_field · слот 27</h3>
      <pre><code>bool get_bool_field(jobject obj, const char* field_name);</code></pre>
      <p>Читает примитивный boolean через getBoolean. false означает и нормальное значение, и null obj/ошибку; числовые/строковые поля не имеют обещанного coercion в bool. Параметры и срок жизни obj — общий reflection-контракт.</p>
    </section>
    <section><h3 id="set_bool_field">set_bool_field · слот 28</h3>
      <pre><code>void set_bool_field(jobject obj, const char* field_name, bool val);</code></pre>
      <p>Записывает val в boolean-поле через setBoolean. Null obj, неверный тип или имя дают молчаливый no-op. Статуса нет; поток и синхронизацию определяет модель JVM-объекта.</p>
    </section>
    <section><h3 id="get_string_utf">get_string_utf · слот 29</h3>
      <pre><code>int32_t get_string_utf(jobject jstr, char* out_buf, uint32_t max_len);</code></pre>
      <p>Вопреки узкому имени, вызывает <code>obj.toString()</code>, не только cast к String. Null/неизвестный handle превращается в пустую строку. Возвращает скопированную UTF-8 длину по общему контракту, -1 при исключении, например в toString. Чужой toString может выполнять код и раскрывать данные; не используйте для массового логирования объектов. Копия в out_buf — ваша, handle — нет.</p>
    </section>
    <section><h3 id="create_string_utf">create_string_utf · слот 30</h3>
      <pre><code>jobject create_string_utf(const char* str);</code></pre>
      <p>Читает корректную NUL-terminated UTF-8 строку и создаёт handle JVM String; исходный буфер после вызова можно освободить. Возвращает null при перехваченной ошибке. Не передавайте nullptr как способ получить пустую строку: передавайте <code>""</code>. Embedded NUL обрезает строку; полученный handle не становится глобальным.</p>
    </section>
    <section><h3 id="get_attached_field">get_attached_field · слот 31</h3>
      <pre><code>jobject get_attached_field(jobject obj, const char* key);</code></pre>
      <p>Читает дополнительное значение XposedHelpers, связанное с obj и строковым key; это не объявленное JVM-поле. Используйте ключ с namespace плагина. Возвращает handle значения либо null при отсутствии, null obj или ошибке. Не заменяет постоянное storage и не гарантирует независимость от жизненного цикла объекта.</p>
    </section>
    <section><h3 id="set_attached_field">set_attached_field · слот 32</h3>
      <pre><code>void set_attached_field(jobject obj, const char* key, jobject val);</code></pre>
      <p>Привязывает JVM-объект val к obj/key; val=null передаёт null как значение. Не принимает сырые native-указатели и не предоставляет cleanup callback для native-памяти. Возврата нет, null obj/ошибки игнорируются. Это не retain для handle val: последующее чтение создаёт новый handle объекта.</p>
    </section>
    <section><h3 id="get_state_value">get_state_value · слот 33</h3>
      <pre><code>jobject get_state_value(jobject state_obj);</code></pre>
      <p>Для существующего Compose State возвращает handle value. Null, объект другого типа, null value или исключение дают null. Не создаёт State и не устанавливает подписку вне механизма Compose. Читайте на допустимом для snapshot/композиции пути; не сохраняйте handle результата между callbacks.</p>
    </section>
    <section><h3 id="set_state_value">set_state_value · слот 34</h3>
      <pre><code>void set_state_value(jobject state_obj, jobject val);</code></pre>
      <p>Для существующего MutableState записывает JVM value из val (включая null). Обычный read-only State/неправильный объект не меняется, ошибки подавляются. Статуса нет. API не выполняет перевод на UI-поток или snapshot transaction за плагин; тип значения и контекст записи должны соответствовать состоянию владельца.</p>
    </section>

    <section id="modifiers"><h2>Compose Modifiers: слоты 35–45</h2>
      <p>Функции возвращают новый handle неизменяемой цепочки Modifier; исходный mod не изменяется. Если mod=null или handle не содержит Modifier, мост начинает с пустого Modifier. Это fallback, не проверка правильности кода. Размеры/отступы — dp, цвет — <code>0xAARRGGBB</code>. Используйте конечные допустимые значения и текущий Compose-контекст. Эти upcalls обычно не ловят исключения Compose: у них нет единого «null при любой ошибке». Handles не закрепляются для будущих callbacks.</p>
    </section>
    <section><h3 id="modifier_empty">modifier_empty · слот 35</h3>
      <pre><code>jobject modifier_empty(void);</code></pre>
      <p>Возвращает handle базового пустого Modifier. Параметров нет; это начало цепочки, не UI-элемент. Не освобождайте handle вручную; отдельного error status нет.</p>
    </section>
    <section><h3 id="modifier_size">modifier_size · слот 36</h3>
      <pre><code>jobject modifier_size(jobject mod, float width_dp, float height_dp);</code></pre>
      <p>Добавляет <code>size(width_dp.dp, height_dp.dp)</code>, возвращает новую цепочку. Родительские constraints всё ещё влияют на итоговый размер: это не requiredSize. Оба размера — dp; fallback mod и ошибки описаны выше.</p>
    </section>
    <section><h3 id="modifier_width">modifier_width · слот 37</h3>
      <pre><code>jobject modifier_width(jobject mod, float width_dp);</code></pre>
      <p>Добавляет width в dp, сохраняя остальную цепочку, возвращает handle результата. Высоту не задаёт, constraints родителя остаются в силе. Неправильный mod заменяется пустым, отдельного статуса ошибки нет.</p>
    </section>
    <section><h3 id="modifier_height">modifier_height · слот 38</h3>
      <pre><code>jobject modifier_height(jobject mod, float height_dp);</code></pre>
      <p>Добавляет height в dp, возвращает новый handle. Ширину не задаёт; действуют constraints родителя и общие ограничения входных чисел/handles. Ошибки не переводятся в стандартный код.</p>
    </section>
    <section><h3 id="modifier_fill_max_width">modifier_fill_max_width · слот 39</h3>
      <pre><code>jobject modifier_fill_max_width(jobject mod);</code></pre>
      <p>Добавляет fillMaxWidth с долей по умолчанию 1, возвращает новую цепочку. Аргумента fraction нет. Результат зависит от доступной ширины/ограничений; это не запрос размера окна. Fallback mod — пустой Modifier.</p>
    </section>
    <section><h3 id="modifier_fill_max_height">modifier_fill_max_height · слот 40</h3>
      <pre><code>jobject modifier_fill_max_height(jobject mod);</code></pre>
      <p>Добавляет fillMaxHeight с долей 1; единственный параметр — исходная цепочка. Возвращает новый handle, поведение определяется constraints высоты. Неправильный mod заменяется пустым, статуса успеха нет.</p>
    </section>
    <section><h3 id="modifier_padding">modifier_padding · слот 41</h3>
      <pre><code>jobject modifier_padding(jobject mod, float start_dp, float top_dp,
    float end_dp, float bottom_dp);</code></pre>
      <p>Добавляет четыре отступа в dp: start/end зависят от направления layout, это не жёсткие left/right. Возвращает цепочку; передавайте неотрицательные конечные значения. Порядок padding относительно background/border/clickable меняет результат. Отдельного кода ошибки нет.</p>
    </section>
    <section><h3 id="modifier_background">modifier_background · слот 42</h3>
      <pre><code>jobject modifier_background(jobject mod, uint32_t argb, float corner_radius_dp);</code></pre>
      <p>Добавляет фон цвета ARGB. Радиус больше 0 выбирает RoundedCornerShape, иначе RectangleShape; возвращает новую цепочку. Фон не обещает clipping дочернего содержимого. Параметры не проходят собственную расширенную валидацию моста; общие правила mod/ошибок сохраняются.</p>
    </section>
    <section><h3 id="modifier_border">modifier_border · слот 43</h3>
      <pre><code>jobject modifier_border(jobject mod, float width_dp,
    uint32_t argb, float corner_radius_dp);</code></pre>
      <p>Добавляет рамку: width_dp — толщина, argb — цвет, положительный radius — скругление, иначе прямоугольник. Возвращает новую цепочку. Требования к значениям толщины определяются Compose; мост не возвращает status валидации. Не путайте border с отступом.</p>
    </section>
    <section><h3 id="modifier_clickable">modifier_clickable · слот 44</h3>
      <pre><code>jobject modifier_clickable(jobject mod, jobject on_click_lambda);</code></pre>
      <p>on_click_lambda должен содержать JVM <code>Function0</code>. Тогда добавляется clickable, вызывающий эту лямбду; иначе возвращается handle исходной цепочки без clickable. <code>create_composable_lambda</code> создаёт Function2, <code>create_scoped_lambda</code> — Function3: они не подходят. Фабрики Function0 в 53 слотах нет. Не приводите C callback к jobject; для практического native-действия используйте register_chat_action. Status отсутствует.</p>
    </section>
    <section><h3 id="modifier_weight">modifier_weight · слот 45</h3>
      <pre><code>jobject modifier_weight(jobject scope, jobject mod, float weight);</code></pre>
      <p>scope — действующий RowScope или ColumnScope из scoped callback, mod — цепочка, weight — положительный вес. Вызывает соответствующий scope.weight с fill по умолчанию true. Для другого scope, включая BoxScope/null, возвращает цепочку без веса. Неправильный mod заменяется пустым; ошибки допустимости веса не имеют стандартного кода.</p>
    </section>

    <section id="components"><h2>Compose Components: слоты 46–52</h2>
      <p>Компоненты вызываются reflection по скомпилированным Compose-методам. composer=null приводит к no-op; mod=null обычно заменяется пустым Modifier, но неправильный ненулевой тип не обещает безопасный fallback. Не найденный метод может молча ничего не нарисовать, invocation errors журналируются. Ни одна void-функция ниже не подтверждает успешную отрисовку. Точные overloads/default masks зависят от сборки; диагностируйте их, а не выдавайте компиляцию C++ за native UI-проверку.</p>
    </section>
    <section><h3 id="compose_row">compose_row · слот 46</h3>
      <pre><code>void compose_row(jobject composer, jobject mod, jobject content_lambda);</code></pre>
      <p>Вызывает найденный Row с семью параметрами, передавая modifier и scoped content (Function3, обычно create_scoped_lambda). В cb scope — RowScope. Arrangement/alignment не задаются C API и выбираются default mask. Возврата нет; отсутствующий Composer/метод — no-op, invocation error — запись в журнал. Не передавайте unscoped Function2 вместо требуемого content.</p>
    </section>
    <section><h3 id="compose_column">compose_column · слот 47</h3>
      <pre><code>void compose_column(jobject composer, jobject mod, jobject content_lambda);</code></pre>
      <p>Аналогичный reflection-вызов Column: composer текущий, mod цепочка, content_lambda — scoped Function3 с ColumnScope. Не предоставляет отдельные параметры arrangement/alignment. Возврата нет; no-op при отсутствии Composer/метода, ошибки invocation журналируются. Применимы общие ограничения handles и версии Compose.</p>
    </section>
    <section><h3 id="compose_box">compose_box · слот 48</h3>
      <pre><code>void compose_box(jobject composer, jobject mod, jobject content_lambda);</code></pre>
      <p>При ненулевом content выбирается семипараметровый Box со scoped Function3/BoxScope, при null — трёхпараметровый overload без content. Alignment и propagateMinConstraints не управляются отдельными аргументами API. Возврата нет; отсутствие подходящего метода/Composer даёт no-op, invocation error журналируется. BoxScope не подходит для modifier_weight.</p>
    </section>
    <section><h3 id="compose_spacer">compose_spacer · слот 49</h3>
      <pre><code>void compose_spacer(jobject composer, jobject mod);</code></pre>
      <p>Вызывает трёхпараметровый Spacer с текущим Composer и mod. Размер задавайте цепочкой modifier, не отдельными параметрами. Ничего не возвращает; null Composer/отсутствующий метод — no-op, ошибки invocation журналируются.</p>
    </section>
    <section><h3 id="compose_text">compose_text · слот 50</h3>
      <pre><code>void compose_text(jobject composer, const char* text, jobject mod,
    uint32_t argb, float font_size_sp, bool is_bold, int32_t max_lines);</code></pre>
      <p>text — NUL-terminated UTF-8 (null трактуется как пустая строка); mod — цепочка; argb — цвет; font_size_sp — заявленный размер; is_bold — жирность; max_lines — лимит строк. <strong>В текущем ComposeInvoker font_size_sp не применяется.</strong> Material3 Text выбирается эвристикой по имени и числу параметров, is_bold пытаются передать как FontWeight, max_lines — по эвристическому индексу. При ошибке пробуется BasicText, где эти параметры не сохраняются как полноценный стиль. Нельзя обещать размер, цвет, жирность или лимит строк без проверки конкретного overload. Статуса нет; fallback тоже может не сработать, ошибки смотрите в журнале.</p>
    </section>
    <section><h3 id="compose_image">compose_image · слот 51</h3>
      <pre><code>void compose_image(jobject composer, jobject bitmap, jobject mod);</code></pre>
      <p>bitmap — handle совместимого ImageBitmap (например get_avatar_bitmap), не путь/сырые пиксели. При null composer или bitmap возвращается без действия. Выбирается первый Image-подобный reflection-метод; contentDescription передаётся null, float-параметры — 1.0, int — 0. Отдельных contentScale/alignment/accessibility аргументов нет; совместимость overload не гарантирована. Ошибки журналируются, результата нет.</p>
    </section>
    <section><h3 id="get_avatar_bitmap">get_avatar_bitmap · слот 52</h3>
      <pre><code>jobject get_avatar_bitmap(const char* path);</code></pre>
      <p>path — локальный путь UTF-8 (NUL в пределах 1024 байт), не user ID и не URL. Возвращает handle ImageBitmap из AvatarCacheManager или null при пустом/null пути, отсутствии/пустом файле, ошибке декодирования или другом перехваченном исключении. Кэш клиента ограничен 300 элементами, изображения уменьшаются с сохранением пропорций до максимальной стороны 128. При cache miss файл читается и декодируется синхронно: это не безопасный async loader для UI. Handle подчиняется общему сроку жизни; не пытайтесь удержать его native-статикой для будущей композиции.</p>
    </section>
  `,
};
