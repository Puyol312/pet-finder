import { Data, User, Geolocation } from "./types/types-state";

class State {
  private static instance: State;
  private data: Data | null;
  private listeners: (() => any)[];

  private constructor() { 
    // Intentar cargar desde localStorage
    const savedData = localStorage.getItem("data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      this.data = parsed.data;
    } else {
      this.data = null
    }
    this.listeners = [];
  }
  public static getInstance(): State {
    if (!this.instance)
      this.instance = new State(); 
    return this.instance;
  }
  public setUser(user: User) {
    const prevState = this.getState() ?? { user: null, geolocation: null };
    this.data = {
      ...prevState,
      user,
    };
    this.saveToLocalStorage();
  }
  public setGeolocation(geolocation: Geolocation) {
    const prevState = this.getState() ?? { user: null, geolocation: null };
    this.data = {
      ...prevState,
      geolocation,
    };
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem(
      "data",
      JSON.stringify({
        data: this.data,
      })
    );
  }

  private notify() { 
    for (const listener of this.listeners) {
      listener();
    }
  }
  public getState(): Data | null { 
    return this.data;
  }
  public subscribe(callback: () => any) { 
    this.listeners.push(callback);
  }
  public unsubscribe(callback: () => any) {
    this.listeners = this.listeners.filter(fn => fn !== callback);
  }
}
export { State }