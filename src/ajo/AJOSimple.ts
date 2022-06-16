import AJOInstance from './AJOInstance';
import AJOField from './AJOField';
import AJOObject from './AJOObject';
import AJOElement from './AJOElement';

export default class AJOSimple<Type extends AJOObject> extends AJOField {
  private elem: Type | null;

  constructor(field: string[] | string, ajoParent: AJOElement | null = null) {
    super(field, ajoParent);
    this.elem = null;
  }

  public get(): Type | null {
    return this.elem;
  }

  private set(elem: Type | null) {
    this.elem = elem;
  }

  public getJsonElem(data: { [key: string]: any } | { [key: string]: any }[]): { [key: string]: any } | null {
    const currentElem = this.get();
    let elem = null;
    if (currentElem != null) {
      if (data instanceof Array) {
        let found = false;
        let i = 0;
        while (!found && i < data.length) {
          if (currentElem.equals(data[i])) {
            elem = data[i];
            found = true;
          }
          i += 1;
        }
      } else if (currentElem.equals(data)) {
        elem = data;
      }
    } else {
      if (data instanceof Array && data.length > 0) {
        elem = data[0];
      } else {
        elem = data;
      }
    }
    return elem;
  }

  public applyElem(data: any) {
    let res = false;
    const jsonElem = this.getJsonElem(data);
    if (jsonElem != null) {
      const elem = this.get();
      if (this.isDeleteOrder(jsonElem, elem)) {
        if (elem != null) {
          this.set(null);
        }
      } else if (elem == null) {
        res = true;
        const ajoElem = AJOInstance.convert(jsonElem, this);
        try {
          this.set(ajoElem as Type);
        } catch (e) {
          throw new Error('Your AJOSimple cannot take this type.');
        }
      } else {
        res = (elem as AJOElement).applyDataPartiel(jsonElem, false) || res;
      }
    }
    return res;
  }

  public override getAJOElementList(recursively: boolean): AJOElement[] {
    const list: AJOElement[] = [];
    const elem = this.get();
    if (elem != null) {
      list.push(elem);
      if (recursively) {
        const recList = elem.getAJOElementList(recursively);
        for (const recElem of recList) {
          list.push(recElem);
        }
      }
    }
    return list;
  }

  public override applyDataPartiel(data: { [key: string]: any }, first: boolean): boolean {
    // boolean that indicates if the object has changed
    let res = false;
    // go throw json source only if the data was applyed to the parent
    if (!this.hasParent()) {
      res = this.applyElem(data) || res;
    } else if (first) {
      // get the json array for all field
      for (const field of this.fieldList) {
        // current json document
        if (!(data instanceof Array)) {
          const array = data[field];
          res = this.applyElem(array) || res;
        } else {
          res = this.applyElem(data) || res;
        }
      }
    }
    return res;
  }
}
