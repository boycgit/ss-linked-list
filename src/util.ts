const OBFUSCATED_ERROR = 'obfuse error occur';

export function invariant(check: false, message: string | boolean): never;
export function invariant(check: true, message: string | boolean): void;
export function invariant(check: any, message: string | boolean): void;
export function invariant(check: boolean, message: string | boolean) {
  if (!check) throw new Error('[linked-list] ' + (message || OBFUSCATED_ERROR));
}

export const INDEX_NOT_FOUND = -1;
