import { info, warn, error } from 'tauri-plugin-log-api';

export function recordLog(
  level: 'info' | 'warn' | 'error',
  event: string,
  content: any,
) {
  let logInfo = `${event} ; `;
  if (content instanceof Error) {
    logInfo += content.message;
  } else {
    logInfo += JSON.stringify(content);
  }

  switch (level) {
    case 'info':
      info(logInfo);
      break;
    case 'warn':
      warn(logInfo);
      break;
    case 'error':
      error(logInfo);
      break;
    default:
      console.log(logInfo);
  }
}

export function initErrorHandler() {
  // js error
  window.onerror = (event, _source, _line, _col, err) => {
    if (!_source && _line === 0 && _col === 0 && !err) {
      return true;
    }
    recordLog('error', 'onerror', event ?? err);
    return true;
  };
  // event js error
  window.addEventListener(
    'error',
    event => {
      recordLog('error', 'onerror', event.error);
    },
    true,
  );
  // promise error
  window.addEventListener('unhandledrejection', event => {
    event.promise.catch(err => {
      recordLog('error', 'unhandledrejection', err);
    });
    event.preventDefault();
  });
}
