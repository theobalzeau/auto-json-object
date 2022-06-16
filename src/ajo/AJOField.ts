import AJOObject from './AJOObject';
import AJOElement from './AJOElement';
import AJOUtils from './AJOUtils';

export default abstract class AJOField extends AJOElement {
  /**
   * Variable field contains all the field in the json source
   * where the value of this AJOList is stored
   * @type {string[]}
   */
  protected fieldList: string[];

  constructor(field: string[] | string | null = null, ajoParent: AJOElement | null = null) {
    super(ajoParent);
    if (field === null) {
      this.fieldList = [];
    } else if (typeof field === 'string') {
      this.fieldList = [field];
    } else {
      this.fieldList = field;
    }
  }

  /**
   * Get all AJOObject in the object
   * @returns {AJOObject[]}
   */
  public getAJOObjectList(recursively: boolean): AJOObject[] {
    let listAJOObject: AJOObject[] = [];
    let listAJOElement: AJOElement[] = this.getAJOElementList(recursively);
    for (const ajoElement of listAJOElement) {
      if (ajoElement instanceof AJOObject) {
        listAJOObject.push(ajoElement as AJOObject);
      }
    }
    return listAJOObject;
  }

  public applyDataToAllChild(data: { [key: string]: any }): boolean {
    let res = false;

    let allObject: AJOObject[] = this.getAJOObjectList(true);
    let allJson: { [key: string]: any }[] = AJOUtils.getAllJsonObject(data);

    for (const json of allJson) {
      for (const child of allObject) {
        if (child.equals(json)) {
          res = child.applyDataPartiel(json, true) || res;
        }
      }
    }
    return res;
  }

  public getField(): string {
    return this.fieldList[0];
  }

  public override getAjoIdentifier(): any {
    let res: any = false;
    if (this.getAjoParent() instanceof AJOElement) {
      res = (this.getAjoParent() as AJOElement).getAjoIdentifier();
    }
    return res;
  }

  public override getAjoType(): any {
    let res: any = false;
    if (this.getAjoParent() instanceof AJOElement) {
      res = (this.getAjoParent() as AJOElement).getAjoType();
    }
    return res;
  }

  public override applyData(data: { [key: string]: any }): boolean {
    let res = false;

    let allObject: AJOObject[] = this.getAJOObjectList(true);
    let allJson: { [key: string]: any }[] = AJOUtils.getAllJsonObject(data);

    for (const json of allJson) {
      for (const child of allObject) {
        if (child.equals(json)) {
          res = child.applyDataPartiel(json, true) || res;
        }
      }
    }
    res = this.applyDataPartiel(data, false) || res;
    return res;
  }
}
