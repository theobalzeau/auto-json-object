import AJOElement from './AJOElement';
import AJOField from './AJOField';
import AJOObject from './AJOObject';

/**
 * AJOData represent a sub json of an AJOObject
 */
export default class AJOData extends AJOField {
  /**
   * Constructor of AJOData
   * @param field string field or string array field where the value of this AJOData is stored
   * @param ajoParent the parent of this object, null if this object is the root
   */
  constructor(field: string[] | string, ajoParent: AJOElement | null = null) {
    super(field, ajoParent);
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
      res = this.passToChild(data) || res;
    } else if (applyParent) {
      // get the json subdocument for all field
      for (let i = 0; i < this.fieldList.length; i++) {
        if (data[this.fieldList[i]] !== undefined) {
          // apply subdocument to childs
          //res = super.applyAjoPolicy(data[this.field[i]], applyParent) || res;
          res = this.passToChild(data[this.fieldList[i]]) || res;
        }
      }
    }

    // Make the update
    super.makeUpdate(res);

    // return the result
    return res;
  }
  public override applyDataRec(data: { [key: string]: any }, first: boolean): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // go throw json source only if the data was applyed to the parent
    if (first) {
      // get the json subdocument for all field
      for (let i = 0; i < this.fieldList.length; i++) {
        if (data[this.fieldList[i]] !== undefined) {
          // apply subdocument to childs
          //res = super.applyAjoPolicy(data[this.field[i]], applyParent) || res;
          res = this.passToChild(data[this.fieldList[i]]) || res;
        }
      }
    }

    // Make the update
    super.makeUpdate(res);

    // return the result
    return res;
  }
  private passToChild(data: { [key: string]: any }): boolean {
    let ajoElementList = this.getAJOElementList(false);
    let res = false;
    for (let i = 0; i < ajoElementList.length; i++) {
      res = (ajoElementList[i] as AJOElement).applyDataRec(data, false) || res;
    }
    return res;
  }
}
