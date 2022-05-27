import AJOInstance from './AJOInstance';
import AJOElement from './AJOElement';
import AJOMode from './AJOMode';
import AJOObject from './AJOObject';
import AJOUtils from './AJOUtils';

export default class AJOList extends AJOElement {
  private list: AJOObject[];
  private fieldList: string[];

  constructor(fieldList: string[] | string, ajoParent: AJOElement | null = null) {
    super(ajoParent);
    if (typeof fieldList === 'string') {
      this.fieldList = [fieldList];
    } else {
      this.fieldList = fieldList;
    }
    this.list = [];
  }

  public push(obj: AJOObject) {
    this.list.push(obj);
  }

  public remove(i: number) {
    this.list.splice(i, 1);
  }

  public override applyData(obj: any, canApplyParent: boolean): boolean {
    let res = false;
    const data = obj;
    if (canApplyParent) {
      for (const field of this.fieldList) {
        const array = obj[field];
        if (array instanceof Array) {
          for (const elem of array) {
            let ajoElem: AJOObject | null = null;
            let found: boolean = false;
            let i: number = 0;
            while (!found && i < this.list.length) {
              const ajoElement: AJOObject = this.list[i];
              if (ajoElement.getAjoIdentifier() === elem[AJOInstance.getIdentifierField()]) {
                ajoElem = ajoElement;
                found = true;
              } else {
                i++;
              }
            }

            if (ajoElem == null) {
              if (elem[AJOInstance.getIdentifierField()] !== elem[AJOInstance.getDeleteField()]) {
                ajoElem = AJOInstance.convert(elem);
                if (ajoElem != null) {
                  res = true;
                  this.push(ajoElem);
                }
              }
            } else {
              if (elem[AJOInstance.getIdentifierField()] === elem[AJOInstance.getDeleteField()]) {
                res = true;
                this.remove(i);
              } else {
                res = ajoElem.applyData(elem) || res;
              }
            }
          }
        }
      }
    }
    res = super.applyAjoPolicy(data) || res;
    super.makeUpdate(res);
    return res;
  }

  public override getAjoElementList(): AJOElement[] {
    return this.list;
  }
}
