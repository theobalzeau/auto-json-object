import AJOElement from './AJOElement';
import AJOState from './AJOState';

export default class AJOUpdater {
  private list: (AJOElement | AJOState<AJOElement>)[];

  constructor() {
    this.list = [];
  }

  public add(elem: AJOElement | AJOState<AJOElement>) : AJOUpdater {
    if(this.list.indexOf(elem)===-1){
      this.list.push(elem);
    }
    return this;
  }

  public makeUpdate() {
    for (const elem of this.list) {
      elem.makeUpdate(true);
    }
  }

  public applyData(data: { [key: string]: any }, update:boolean = false): boolean {
    let res = update;

    for (const elem of this.list) {
        res = elem.applyData(data) || res;
    }

    return res;
  }
}
