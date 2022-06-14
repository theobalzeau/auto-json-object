import AJOInstance from './AJOInstance';
import AJOField from './AJOField';
import AJOObject from './AJOObject';
import AJOElement from './AJOElement';

export default class AJOSimple extends AJOField {
  private elem: AJOObject | null;

  constructor(field: string[] | string, ajoParent: AJOElement | null = null) {
    super(field, ajoParent);
    this.elem = null;
  }

  public get(): AJOObject | null {
    return this.elem;
  }

  private set(elem: AJOObject | null) {
    this.elem = elem;
  }

  public getJsonElem(data: { [key: string]: any } | { [key: string]: any }[]) : any {
    let currentElem = this.get();
    let elem = null;
    if(currentElem!=null) {
      if(data instanceof Array&&data.length>0) {
        elem = data[0];
      }
      else if(currentElem.get {
        elem = data;
      }
    }
    else {
      if(data instanceof Array&&data.length>0) {
        elem = data[0];
      }
      else {
        elem = data;
      }
    }
  }

  public applyData(data: { [key: string]: any } | { [key: string]: any }[]) {
    let res = false;
    let jsonElem = this.getJsonElem(data)
    let elem = null;
    if(data instanceof Array&&data.length>0) {
      elem = data[0];
    }
    else {
      elem = data;
    }

    if (elem != null) {
      let ajoElem = AJOInstance.convert(elem);
    }
    return false;
  }

  protected override passToChild(data: { [key: string]: any }): boolean {
    return false;
  }

  public override getAJOElementList(recursively: boolean): AJOElement[] {
    const list:AJOElement[] = [];
    let elem = this.get();
    if (elem != null) {
      list.push(elem);
      if (recursively) {
        let recList = elem.getAJOElementList(recursively);
        for (const recElem of recList) {
          list.push(recElem);
        }
      }
    }
    return list;
  }

  public equals(data: { [key: string]: any }): boolean {
    return false;
  }

  public override applyDataRec(data: { [key: string]: any; }, first: boolean): boolean {
  // boolean that indicates if the object has changed
    let res = false;

    // go throw json source only if the data was applyed to the parent
    if (!this.hasParent()) {
      res = this.applyData(data) || res;
    } else if (first) {
      // get the json array for all field
      for (const field of this.fieldList) {
        // current json document
        if (!(data instanceof Array)) {
          const array = data[field];
          res = this.applyData(array) || res;
        } else {
          res = this.applyData(data) || res;
        }
      }
    }
    return res;
  }
}
