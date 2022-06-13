import AJOInstance from './AJOInstance';
import AJOElement from './AJOElement';

export default class AJOSimple extends AJOElement {
  private fieldList: string[];
  private elem: AJOElement | null;

  constructor(fieldList: string[] | string, ajoParent: AJOElement | null = null) {
    super(ajoParent);
    if (typeof fieldList === 'string') {
      this.fieldList = [fieldList];
    } else {
      this.fieldList = fieldList;
    }
    this.elem = null;
  }

  public get(): any {
    return this.elem;
  }

  private set(elem: AJOElement | null) {
    this.elem = elem;
  }

  public override applyData(data: { [key: string]: any }, canApplyParent: boolean): boolean {
    let res = false;
    if (canApplyParent) {
      for (const field of this.fieldList) {
        data = data[field];
        let target: { [key: string]: any } | null = null;
        if (data instanceof Array) {
          if (data.length > 0) {
            if (typeof data[0] === 'object') {
              target = data[0];
            }
          }
        } else if (typeof data === 'object') {
          target = data;
        }
        if (target != null) {
          if (this.get() == null || !this.get().equals(target)) {
            const ajoElement: AJOElement | null = AJOInstance.convert(target);
            if (ajoElement != null) {
              this.set(AJOInstance.convert(target) as AJOElement);
              res = true;
            }
          } else {
            if (target[AJOInstance.getIdentifierField()] === target[AJOInstance.getDeleteField()]) {
              this.set(null);
              res = true;
            } else {
              res = this.get().apply_data(target, canApplyParent) || res;
            }
          }
        }
      }
    }

    res = super.applyAjoPolicy(data, canApplyParent) || res;
    super.makeUpdate(res);
    return res;
  }
  public override getAjoElementList(): AJOElement[] {
    const list = [];
    if (this.get() != null) {
      list.push(this.get());
    }
    return list;
  }

  public equals(data: { [key: string]: any }): boolean {
    return false;
  }
}
