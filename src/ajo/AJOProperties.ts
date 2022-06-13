import AJOElement from './AJOElement';
import AJOField from './AJOField';
import AJOObject from './AJOObject';
/**
 * AJOProperties is the class that contains simple variable in AJOObject
 */
export default class AJOProperties extends AJOField {
  /**
   * Variable value contains the value of this AJOProperties
   * @type {any}
   */
  private value: any;

  /**
   * Variable overrideOnUndefined, if its at true, the value of this AJOProperties
   * will be overrided even if the value is undefined in the json source
   * @type {boolean}
   */
  private overrideOnUndefined: boolean;

  /**
   * Constructor of AJOProperties
   * @param field string field where the value of this AJOProperties is stored
   * @param ajoParent the parent of this object, null if this object is the root
   * @param overrideOnUndefined optionnal parameter, boolean for the overrideOnUndefined property, change data even if the value is undefined in the json source
   * @param value optionnal parameter, the value of this AJOProperties
   */
  public constructor(
    field: string[] | string | null = null,
    ajoParent: AJOElement | null = null,
    overrideOnUndefined: boolean = true,
    value?: any,
  ) {
    super(field, ajoParent);
    this.value = value;
    this.overrideOnUndefined = overrideOnUndefined;
  }

  /**
   * Get the value of this AJOProperties
   * @returns {string} the value of this AJOProperties
   */
  public get(): any {
    return this.value;
  }

  /**
   * Get the overrideOnUndefined of this AJOProperties
   * @returns {boolean} the overrideOnUndefined of this AJOProperties
   */
  public isOverrideOnUndefined(): boolean {
    return this.overrideOnUndefined;
  }

  /**
   * Set the overrideOnUndefined of this AJOProperties
   * @returns {boolean} the new overrideOnUndefined
   */
  public setOverrideOnUndefined(overrideOnUndefined: boolean) {
    this.overrideOnUndefined = overrideOnUndefined;
  }

  /**
   * Set the value of this AJOProperties
   * @param value the new value
   * @returns {boolean} if the value change
   */
  public set(value: any): boolean {
    // boolean that indicates if the value has changed
    let res: boolean = false;

    // if the value is different
    if (this.value !== value) {
      // set the new value
      this.value = value;
      res = true;
    }

    // return the result
    return res;
  }

  public override applyDataRec(data: { [key: string]: any }, first : boolean): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    let found = false;
    let value = undefined;
    let i = 0;
    while (!found && i < this.fieldList.length) {
      if (this.fieldList[i] in data) {
        if (this.fieldList[i] == undefined && this.isOverrideOnUndefined()) {
          found = true;
          value = data[this.fieldList[i]];
        }
        if (this.fieldList[i] != undefined) {
          found = true;
          value = data[this.fieldList[i]];
        }
      }
      i++;
    }
    if (found) {
      res = this.set(value);
    }

    // Make the update
    super.makeUpdate(res);

    // return the result
    return res;
  }

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @param applyParent true if the json was applyed to the parent
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public override applyData(data: { [key: string]: any }): boolean {
    return this.applyDataRec(data, false);
  }

  protected override passToChild(data: { [key: string]: any }): boolean {
    return false;
  }
}
