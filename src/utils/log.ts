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
