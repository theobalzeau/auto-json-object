import AJOElement from './AJOElement';

export default class AJOProperties extends AJOElement {
  private field: string;
  private orphelin: boolean;
  private value: any;
  private overrideOnUndefined: boolean;

  public constructor(
    field: string,
    ajoParent: AJOElement | null = null,
    orphelin: boolean = false,
    overrideOnUndefined: boolean = true,
    value?: any,
  ) {
    super(ajoParent);
    this.field = field;
    this.orphelin = orphelin;
    this.value = value;
    this.overrideOnUndefined = overrideOnUndefined;
  }

  public getField(): string {
    return this.field;
  }

  public get(): any {
    return this.value;
  }

  public isOverrideOnUndefined(): boolean {
    return this.overrideOnUndefined;
  }
  public setOverrideOnUndefined(overrideOnUndefined: boolean) {
    this.overrideOnUndefined = overrideOnUndefined;
  }
  public isOrphelin(): any {
    return this.orphelin;
  }

  public set(value: any): boolean {
    let res;
    if (this.value === value) {
      res = false;
    } else {
      this.value = value;
      res = true;
    }
    return res;
  }

  public override applyData(data: { [key: string]: any }, applyParent: boolean): boolean {
    let res = false;
    if (applyParent) {
      if (data !== undefined && data[this.getField()] !== this.get()) {
        if (data[this.getField()] === undefined) {
          if (this.isOverrideOnUndefined()) {
            this.set(undefined);
            res = true;
          }
        } else {
          this.set(data[this.getField()]);
          res = true;
        }
      }
    }
    res = super.applyAjoPolicy(data, applyParent) || res;
    super.makeUpdate(res);
    return res;
  }
}
