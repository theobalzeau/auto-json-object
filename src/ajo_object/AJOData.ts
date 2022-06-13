import AJOElement from './AJOElement';

/**
 * AJOData represent a sub json of an AJOObject
 */
export default class AJOData extends AJOElement {
  /**
   * Variable field contains all the field in the json source
   * where the value of this AJOData is stored
   * @type {string[]}
   */
  private field: string[];

  /**
   * Constructor of AJOData
   * @param field string field or string array field where the value of this AJOData is stored
   * @param ajoParent the parent of this object, null if this object is the root
   */
  constructor(field: string[] | string, ajoParent: AJOElement | null = null) {
    super(ajoParent);
    if (typeof field === 'string') {
      this.field = [field];
    } else {
      this.field = field;
    }
  }

  /**
   * Get the field of this object
   * @returns {string} the field of this object
   */
  public getField(): string | string[] {
    let res = null;
    if (this.field.length == 1) {
      res = this.field[0];
    } else {
      res = this.field;
    }
    return res;
  }

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @param applyParent true if the json was applyed to the parent
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public override applyData(data: { [key: string]: any }, applyParent: boolean = true): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // go throw json source only if the data was applyed to the parent
    if (!this.hasParent()) {
      // Apply the data to the child
      res = super.applyAjoPolicy(data, applyParent) || res;
    } else if (applyParent) {
      // get the json subdocument for all field
      for (let i = 0; i < this.field.length; i++) {
        if (data[this.field[i]] !== undefined) {
          // apply subdocument to childs
          res = super.applyAjoPolicy(data[this.field[i]], applyParent) || res;
        }
      }
    }

    // Make the update
    super.makeUpdate(res);

    // return the result
    return res;
  }

  public override equals(data: { [key: string]: any }): boolean {
    return false;
  }
}
