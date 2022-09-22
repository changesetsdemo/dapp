export class Events {
  public static LOCALE_LANG = 'LOCALE_LANG';

  public static CONNECT_WALLET_TYPE = 'CONNECT_WALLET_TYPE';

  public static TOKEN_PRICES = 'TOKEN_PRICES';

  public static setLocalStorage(event: string, data: string) {
    window.localStorage.setItem(event, data);
  }

  public static getLocalStorage(event: string): string {
    return window.localStorage.getItem(event) || '';
  }

  public static removeLocalStorage(event: string) {
    window.localStorage.removeItem(event);
  }
}
