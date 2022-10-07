import AJOInstance from './AJOInstance';
import AJOObject from './AJOObject';
import AJOState from './AJOState';

/**
 * AJOElement is the base class for all AJO classes.
 */
export default abstract class AJOElement {
  /**
   * All private field to prevent circular recursion
   */
  protected static PRIVATE_FIELD_LIST: string[] = ['ajoParent', 'create', 'update', 'field', "next"];

  /**
   * Variable ajoParent contains the parent of this object, null if this object is the root
   * @type {AJOElement | null}
   */
  private ajoParent: AJOElement | null;

  /**
   * Variable ajoParent contains the parent of this object, null if this object is the root
   * @type {AJOState | null}
   */
  private ajoState: AJOState<AJOElement> | null;

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
  constructor(
    ajoParent: AJOElement | null = null,
    update: (() => void) | null = null,
    ajoState: AJOState<AJOElement> | null = null,
  ) {
    this.ajoParent = ajoParent;
    this.update = update;
    this.ajoState = ajoState;
  }

  public hasParent(): boolean {
    return this.ajoParent != null;
  }

  public abstract applyDataPartiel(data: { [key: string]: any }, first: boolean): boolean;
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

  public getAJOElementList(recursively: boolean): AJOElement[] {
    // the list return
    const list: AJOElement[] = [];
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
      this.stateUpdate();
    }
  }

  /**
   * Make the changes in the object
   * If there change call the update function
   * @param change
   */
  public stateUpdate() {
    if (this.ajoState != null) {
      this.ajoState.makeUpdate();
    } else if (this.hasParent()) {
      this.getAjoParent()?.stateUpdate();
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
   * Get the parent of this object
   * @returns {AJOState | null} the parent of this object
   */
  public getAjoState(): AJOState<AJOElement> | null {
    return this.ajoState;
  }

  /**
   * Get the parent of this object
   * @returns {AJOState | null} the parent of this object
   */
  public setAjoState(ajoState: AJOState<AJOElement> | null): void {
    this.ajoState = ajoState;
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

  protected isDeleteOrder(json: { [key: string]: any }, elem: AJOElement | null): boolean {
    let res = false;
    if (json[AJOInstance.getDeleteField()] === true || json[AJOInstance.getDeleteField()] === "True" || json[AJOInstance.getDeleteField()] === "true") {
      res = true;
    } else if (elem != null) {
      if (AJOInstance.isDeepEqual()) {
        res =
          json[AJOInstance.getDeleteField()] === this.getAjoIdentifier() &&
          json[AJOInstance.getTypeField()] === elem.getAjoType();
      } else {
        res = json[AJOInstance.getDeleteField()] === this.getAjoIdentifier();
      }
    }
    return res;
  }
}
