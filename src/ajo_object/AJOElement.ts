import AJOInstance from './AJOInstance';
import AJOMode from './AJOMode';
import AJOUtils from './AJOUtils';

/**
 * AJOElement is the base class for all AJO classes.
 */
export default abstract class AJOElement {
  /**
   * All private field to prevent circular recursion
   */
  protected static PRIVATE_FIELD_LIST: string[] = ['ajoParent', 'create', 'update', 'field'];

  /**
   * Variable ajoParent contains the parent of this object, null if this object is the root
   * @type {AJOElement | null}
   */
  private ajoParent: AJOElement | null;
  /**
   * Function called when there is a change in this object or in these child objects
   * @type {(() => void) | null}
   */
  private update: (() => void) | null;

  /**
   * Constructor of AJOElement
   * @param ajoParent the parent of this object, null if the object is the root
   * @param update the update function
   */
  constructor(ajoParent: AJOElement | null = null, update: (() => void) | null = null) {
    this.ajoParent = ajoParent;
    this.update = update;
  }

  public hasParent(): boolean {
    return this.ajoParent != null;
  }

  public abstract equals(data: { [key: string]: any }): boolean;

  public applyData2(data: { [key: string]: any }, applyParent: boolean = true): boolean {
    let res = false;

    let allChild: AJOElement[] = this.getAjoElementList(true);
    let allJson: { [key: string]: any }[] = AJOUtils.getAllJsonObject(data);

    for (const json of allJson) {
      for (const child of allChild) {
        if (child.equals(json)) {
          res = child.applyData(json, applyParent) || res;
        }
      }
    }
    return false;
  }

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @param applyParent true if the json was applyed to the parent
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public abstract applyData(data: { [key: string]: any }, applyParent: boolean): boolean;

  /**
   * Get all AjoElement in the object
   * @returns {AJOElement[]}
   */
  public getAjoElementList(recursively: boolean = false): AJOElement[] {
    // the list return
    const list: AJOElement[] = [];
    if (recursively) {
      list.push(this);
    }
    // the currrent object
    const obj: AJOElement = this;
    // for all property of the object
    Object.getOwnPropertyNames(this).forEach((field) => {
      // if the property is not privateField
      if (!AJOElement.PRIVATE_FIELD_LIST.includes(field)) {
        // get the value of the property
        const value = obj[field as keyof AJOElement];
        // if the value is an AJOElement add to the list
        if (value instanceof AJOElement) {
          // get child recursively
          if (recursively) {
            list.push(...value.getAjoElementList(recursively));
          } else {
            list.push(value);
          }
        }
      }
    });
    return list;
  }

  /**
   * Make the changes in the object
   * If there change call the update function
   * @param change
   */
  public makeUpdate(change: boolean) {
    if (change) {
      if (this.update != null) {
        this.update();
      }
    }
  }

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @param applyParent true if the json was applyed to the parent
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public applyAjoPolicy(data: any, applyParent: boolean = false): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // If the data was applied to the parent
    // Or the AJOInstance mode is JSON_TO_ALL_OBJECT
    if (applyParent) {
      let i = 0;
      // get all child of this object
      const list = this.getAjoElementList();
      // number of child
      const len = list.length;
      for (i; i < len; i++) {
        // for each child
        const ajoElement: AJOElement = list[i];
        // apply the data to the child
        res = ajoElement.applyData(data, applyParent) || res;
      }
    }
    // If the AJOInstance mode is ALL_JSON_TO_ALL_OBJECT
    if (AJOInstance.getMode() === AJOMode.ALL_JSON_TO_ALL_OBJECT) {
      // get all sub document of the json source
      const allObject = AJOUtils.getAllJsonObject(data);

      let i = 0;
      // get all child of this object
      const list = this.getAjoElementList();
      // number of child
      const len = list.length;

      for (i; i < len; i++) {
        // for each child
        const ajoElement: AJOElement = list[i];
        // apply all subdocument to the child
        let j = 0;
        for (j = 0; j < allObject.length; j++) {
          const obj = allObject[j];
          res = ajoElement.applyData(obj, applyParent) || res;
        }
      }
    }

    // return the result
    return res;
  }

  /**
   * Get the parent of this object
   * @returns {AJOElement | null} the parent of this object
   */
  public getAjoParent(): AJOElement | null {
    return this.ajoParent;
  }

  /**
   * Set the parent of this object
   * @param ajoParent the new parent
   */
  public setAjoParent(ajoParent: AJOElement | null) {
    this.ajoParent = ajoParent;
  }

  /**
   * Get the update function
   * @returns {(() => void) | null} the update function
   */
  public getUpdate(): (() => void) | null {
    return this.update;
  }

  /**
   * Change the update function
   * @param update the new update function
   */
  public setUpdate(update: (() => void) | null) {
    this.update = update;
  }
}
