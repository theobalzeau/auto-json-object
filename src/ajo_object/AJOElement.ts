import AJOInstance from './AJOInstance';
import AJOMode from './AJOMode';
import AJOUtils from './AJOUtils';

export default abstract class AJOElement {
  private static privateFiledList: string[] = ['ajoParent', 'create', 'update', 'field'];

  private ajoParent: AJOElement | null;
  private create: boolean;
  private update: (() => void) | null;

  constructor(ajoParent: AJOElement | null = null, update: (() => void) | null = null) {
    this.ajoParent = ajoParent;
    this.update = update;
    this.create = false;
  }

  public abstract applyData(obj: any, applyParent: boolean): boolean;

  public getAjoElementList(): AJOElement[] {
    const list: AJOElement[] = [];
    const obj: AJOElement = this;
    Object.getOwnPropertyNames(this).forEach((field) => {
      if (!AJOElement.privateFiledList.includes(field)) {
        const value = obj[field as keyof AJOElement];
        if (value instanceof AJOElement) {
          list.push(value);
        }
      }
    });
    return list;
  }
  public makeUpdate(change: boolean) {
    if (change) {
      if (this.update != null) {
        this.update();
      }
    }
  }
  public applyAjoPolicy(data: any, canApplyParent: boolean = false): boolean {
    let res = false;
    if (canApplyParent || AJOInstance.getMode() === AJOMode.PASS_TO_CHILD) {
      let i = 0;
      const list = this.getAjoElementList();
      const len = list.length;
      for (i; i < len; i++) {
        const ajoElement: AJOElement = list[i];
        res = ajoElement.applyData(data, canApplyParent) || res;
      }
    }
    if (AJOInstance.getMode() === AJOMode.PASS_ALL_TO_CHILD) {
      const allObject = AJOUtils.getAllObject(data);

      let i = 0;
      const list = this.getAjoElementList();
      const len = list.length;
      for (i; i < len; i++) {
        const ajoElement: AJOElement = list[i];
        let j = 0;
        for (j = 0; j < allObject.length; j++) {
          const obj = allObject[j];
          res = ajoElement.applyData(obj, canApplyParent) || res;
        }
      }
    }
    return false;
  }
  public isCreate(): boolean {
    return this.create;
  }
  public setCreate(create: boolean) {
    this.create = create;
  }
  public getAjoParent(): AJOElement | null {
    return this.ajoParent;
  }
  public setAjoParent(ajoParent: AJOElement | null) {
    this.ajoParent = ajoParent;
  }
}
