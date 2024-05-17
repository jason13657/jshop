class AuthErrorEventBus {
  private static callback: (error: Error) => void;
  private static instance: AuthErrorEventBus;
  private constructor() {}

  public static getInstance(): AuthErrorEventBus {
    if (!AuthErrorEventBus.instance) {
      AuthErrorEventBus.instance = new AuthErrorEventBus();
    }

    return AuthErrorEventBus.instance;
  }
  listen(callback: (error: Error) => void) {
    AuthErrorEventBus.callback = callback;
  }
  notify(error: Error) {
    AuthErrorEventBus.callback(error);
  }
}
