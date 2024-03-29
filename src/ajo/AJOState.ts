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
    newState.setUpdate(this.getUpdate());
    const update = this.getUpdate();
    if (update != null) {
      update(newState);
    }
    return newState;
  }

  public makeUpdate(): AJOState<Type> {
    const newState = new AJOState(this.get());
    newState.setUpdate(this.getUpdate());
    const update = this.getUpdate();
    if (update != null) {
      update(newState);
    }
    return newState;
  }

  public applyData(data: { [key: string]: any }, update:boolean = false): boolean {
    let res = update;

    res = this.get()!.applyData(data) || res;

    if(res){
      this.makeUpdate();
    }

    return res;
  }
}
