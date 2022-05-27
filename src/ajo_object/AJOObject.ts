import AJOInstance from './AJOInstance';
import AJOData from './AJOData';
import AJOElement from './AJOElement';
import AJOList from './AJOList';
import AJOMode from './AJOMode';
import AJOProperties from './AJOProperties';
import AJOUtils from './AJOUtils';
export default abstract class AJOObject extends AJOElement {
  private ajoIdentifier: any;
  private ajoType: string;

  constructor(ajoType: string, ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(ajoParent);
    this.ajoIdentifier = ajoIdentifier;
    this.ajoType = ajoType;
  }

  private setAjoIdentifier(data: { [key: string]: any }) {
    this.ajoIdentifier = data[AJOInstance.getIdentifierField()];
  }
  public getAjoIdentifier(): any {
    return this.ajoIdentifier;
  }

  public getAjoType(): string {
    return this.ajoType;
  }

  public override applyData(data: any): boolean {
    let res = false;
    const canApplyData = this.equals(data);
    if (canApplyData) {
      res = true;
      this.setCreate(true);
      this.setAjoIdentifier(data);
    }
    res = super.applyAjoPolicy(data, canApplyData) || res;
    super.makeUpdate(res);
    return res;
  }

  public equals(obj: any): boolean {
    let res = false;
    if (obj instanceof AJOObject) {
      if (AJOInstance.isDeepEqual()) {
        res = this.getAjoIdentifier() === obj.getAjoIdentifier() && this.getAjoType() === obj.getAjoType();
      } else {
        res = this.getAjoIdentifier() === obj.getAjoIdentifier();
      }
    } else if (typeof obj === 'object') {
      if (!this.isCreate()) {
        res = true;
      } else if (AJOInstance.isDeepEqual()) {
        res =
          this.getAjoIdentifier() === obj[AJOInstance.getIdentifierField()] &&
          this.getAjoType() === obj[AJOInstance.getTypeField()];
      } else {
        res = this.getAjoIdentifier() === obj[AJOInstance.getIdentifierField()];
      }
    }
    return res;
  }
}
