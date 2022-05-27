import AJOInstance from './AJOInstance';
import AJOElement from './AJOElement';
import AJOMode from './AJOMode';
import AJOProperties from './AJOProperties';

export default class AJOData extends AJOElement {
  private field: string;

  constructor(field: string, ajoParent: AJOElement | null = null) {
    super(ajoParent);
    this.field = field;
  }

  public getField(): string {
    return this.field;
  }

  public override applyData(obj: any, canApplyParent: boolean = false): boolean {
    let res = false;

    let data = obj;
    if (canApplyParent) {
      data = obj[this.field as keyof any];
    }
    res = super.applyAjoPolicy(data, canApplyParent) || res;
    super.makeUpdate(res);
    return res;
  }
}
