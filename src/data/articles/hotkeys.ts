export default {
  slug: "hotkeys",
  title: "Горячие клавиши и шорткаты",
  category: "Начало работы",
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
};
