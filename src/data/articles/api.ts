export default {
  slug: "api",
  title: "C API и перехват методов",
  category: "Разработка плагинов",
  content: `
      <section id="header">
        <h2>Заголовочный файл mandagram_plugin.h</h2>
        <p>Скачиваемые <a href="/include/mandagram_plugin.h" download>C-заголовок</a>, <a href="/include/mandagram_plugin.hpp" download>C++-обёртки</a> и <a href="/include/mandagram_plugin.zig" download>Zig SDK</a> повторяют клиентский <code>src/native/include/</code>. C-заголовок задаёт порядок полей и точные сигнатуры. Не переставляйте функции и не используйте упакованные структуры.</p><ul><li><strong>0–8:</strong> register_hook, log_info/error, get_storage_dir, get_cache_dir, resolve_asset, get_current_user_id, get_active_chat_id, execute_tdlib_query.</li><li><strong>9–16:</strong> create_composable_lambda, create_scoped_lambda, replace_composable и операции composer.</li><li><strong>17–20:</strong> register_update_hook, register_message_send_hook, register_message_receive_hook, register_chat_action.</li><li><strong>21–34:</strong> чтение/запись object/int/long/bool полей, строки UTF-8, attached fields и Compose State.</li><li><strong>35–45:</strong> Compose Modifier; <strong>46–52:</strong> Row, Column, Box, Spacer, Text, Image и получение bitmap аватара.</li></ul><p>Таблица не содержит номера ABI, размера, функции освобождения строк, публичного unregister или callback завершения. Нулевой необязательный указатель можно проверить, но это не проверка совместимости со старой, более короткой таблицей.</p>
        <p><a href="/sdk/manifest.json">Манифест</a> и <a href="/sdk/mandagram-plugin-sdk.zip" download>архив SDK</a> относятся к ревизии <code>259fc5a38b64a12c85121838278f78ee72541dfb</code>. Статус — <strong>source matched, не runtime certified</strong>. Полные сигнатуры, ownership и ошибки — в <a href="/kb/api-reference/">справочнике 53 функций</a>; небольшие сценарии — в <a href="/kb/plugin-recipes/">рецептах</a>.</p>
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
    HookBeforeFn before_cb, HookAfterFn after_cb);</pre></div></div>
        <p>Имя класса допускает точки или слеши. Точный JVM descriptor выбирает перегрузку; null регистрирует хук по имени. <strong>Если для вызова есть список с точным descriptor, он выбирается вместо списка по имени, а не объединяется с ним.</strong> Скомпилированные Kotlin/Compose/suspend-сигнатуры сверяйте с байткодом своей версии клиента.</p>
        <p>Возврат 0 означает регистрацию, а не доказательство существования метода или успешной трансформации. Abstract/native методы пропускаются; нужна доступная JVM instrumentation и изменяемый класс. Вложенный dispatch Before во время method-hook подавляется для защиты от рекурсии.</p>
        <ul><li><strong>Before:</strong> изменения args[i] записываются обратно. return_early != 0 или has_result != 0 пропускает оригинал; result должен быть handle подходящего JVM-типа.</li><li><strong>After:</strong> подходит для наблюдения. Изменения args не переписываются обратно мостом.</li><li><strong>Null:</strong> Before заменяет отсутствующий результат на Kotlin Unit; After применяет только ненулевые значения. Null не является универсальным возвратом JVM null или отменой метода.</li></ul>
        <blockquote><p><strong>Известное ограничение native After.</strong> После обычного возврата оригинала установка result и has_result в C HookParam <strong>не подменяет итоговый результат</strong>. PluginBridge записывает param.result, но не устанавливает JVM hasResultBeenSet; XposedEngine без этого флага возвращает исходное значение. Если оригинал уже пропущен в Before, итоговый путь иной — это не доказательство работоспособности обычного After. Обёртка C++ setResult не исправляет мост. Для подмены заранее известного результата используйте подходящий Before; не выдавайте это за замену вычисленного результата в After.</p></blockquote>
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
        <blockquote><p><strong>C++-обёртки скрывают усечение.</strong> mandagram_plugin.hpp использует буферы 1024 байта для путей, 8192 для JSON и 2048 для строк, затем возвращает std::string без отдельного признака усечения. Если нужна проверка полноты, вызывайте C API с собственным буфером и проверяйте длину. Усечение может разрезать UTF-8; не принимайте такой текст как корректный.</p></blockquote>
        <p>У ABI нет shutdown/deinit и публичного unregister. Не решайте блокировку запуском долгоживущего native worker: загрузчик не предоставляет протокол его остановки. Не удерживайте указатели API или callback после выгрузки.</p>
      </section>

      <section id="tdlib-query">
        <h2>Вызовы TDLib через JSON</h2>
        <p><code>execute_tdlib_query(json, out_buf, max_len)</code> — синхронный мост к текущему TDLib-клиенту. Он преобразует JSON с @type в классы TdApi и возвращает результат либо объект error. Быстрые пути и reflection-разбор зависят от классов текущей TDLib: это не обещание принять любой официальный JSON.</p>
        <div class="code-block"><div class="code-header"><span>Безопасный запрос чтения; нужна активная сессия</span></div><div class="code-content"><pre>{"@type":"getMe"}</pre></div></div>
        <p>Поля 64-битных ID представлены <strong>JSON-числами</strong>, а byte[] — <strong>массивами чисел</strong>, не base64. Парсер вашей стороны должен сохранять точность int64. Строковые ID и другие неверные типы могут молча превратиться в значения по умолчанию, а не дать error; сверяйте структуру и типы до вызова. Это адаптер TdApi, не побайтовая копия JSON API TDLib.</p>
        <p>Вызов блокирует поток через runBlocking. Ожидание send-ответа ограничено 7 секундами, но это не общий deadline любой операции. Возможны error 400, 503 (неактивный клиент), 408, 500 и ошибки TDLib. Положительная длина означает только скопированные байты: проверяйте полноту JSON и поле @type.</p>
        <blockquote><p><strong>408 не отменяет запрос.</strong> Уже переданная TDLib операция может завершиться после таймаута. Не повторяйте автоматически действие с побочными эффектами. Если буфер результата оказался коротким, повтор execute_tdlib_query тоже заново выполняет запрос — это не повторное чтение прежнего ответа.</p></blockquote>
        <p>Не вызывайте этот мост из Compose/UI-хуков или рекурсивно из before-send. get_current_user_id и get_active_chat_id возвращают 0 при отсутствии текущего значения. Прямой query не заменяет обычный путь отправки и не обещает проход всех высокоуровневых хуков.</p>
      </section>
    `
};
