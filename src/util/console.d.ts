export function writeLog(eventSource: string, message: string | Element | Record<any, any> | any[]): string;

export function groupLog(eventSource: string, message: string | Element | Record<any, any> | any[], callback: (console: Console) => void): void;
