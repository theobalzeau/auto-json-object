import AJOObject from './AJOObject';
import AJOElement from './AJOElement';

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

  public getField() : string {
    return this.fieldList[0];
  }

  public override getAjoIdentifier() : any {
    let res : any = false;
    if(this.getAjoParent() instanceof AJOElement) {
      res = (this.getAjoParent() as AJOElement).getAjoIdentifier();
    }
    return res;
  }

  public override getAjoType() : any {
    let res : any = false;
    if(this.getAjoParent() instanceof AJOElement) {
      res = (this.getAjoParent() as AJOElement).getAjoType();
    }
    return res;
  }
}
