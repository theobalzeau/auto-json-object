import AJOElement from './AJOElement';

export default class AJOState<Type extends AJOElement> {
  private elem: Type | null;
  private update: ((a: any) => any) | null;

  constructor(elem: Type | null) {
    this.elem = elem;
    if (elem != null) {
      elem.setAjoState(this);
    }
    this.update = null;
  }

  public getUpdate(): ((a: any) => any) | null {
    return this.update;
  }

  public setUpdate(update: ((a: any) => any) | null) {
    this.update = update;
  }

  public set(elem: Type | null) {
    this.elem = elem;
    if (elem != null) {
      elem.setAjoState(this);
    }
    this.makeUpdate();
  }

  public get() {
    return this.elem;
  }

  public recreate(): AJOState<Type> {
    const newState = new AJOState(this.get());
    let update = this.getUpdate();
    if (update != null) {
      update(newState);
    }
    return newState;
  }

  public makeUpdate(): AJOState<Type> {
    const newState = new AJOState(this.get());
    let update = this.getUpdate();
    if (update != null) {
      update(newState);
    }
    return newState;
  }
}
