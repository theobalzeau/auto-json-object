import AJOInstance from './AJOInstance';
import AJOObject from './AJOObject';

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

  public abstract applyDataRec(data: { [key: string]: any }, first: boolean): boolean;
  public abstract applyData(data: { [key: string]: any }): boolean;

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @param applyParent true if the json was applyed to the parent
   * @returns {boolean} true if their is any change in the object or in the child
   */
  /*public abstract applyData(data: { [key: string]: any }, applyParent: boolean): boolean;*/

  public abstract getAjoIdentifier(): any;
  public abstract getAjoType(): any;
  protected abstract passToChild(data: { [key: string]: any }): boolean;

  public getAJOElementList(recursively: boolean): AJOElement[] {
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
        // if the value is an AJOObject add to the list
        if (value instanceof AJOElement) {
          // get child recursively
          if (recursively) {
            list.push(...value.getAJOElementList(recursively));
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
  public isDeleteOrder(json : { [key: string]: any }, elem : AJOElement | null) : boolean {
    let res = false;
    if(json[AJOInstance.getDeleteField()] === true){
      res = true;
    }
    else if(elem!=null){
      if(AJOInstance.isDeepEqual()){
        res = json[AJOInstance.getDeleteField()] === this.getAjoIdentifier() &&
        json[AJOInstance.getTypeField()] === elem.getAjoType();
      }
      else {
        res = json[AJOInstance.getDeleteField()] === this.getAjoIdentifier();
      }
    }
    return res;
  }
}
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}