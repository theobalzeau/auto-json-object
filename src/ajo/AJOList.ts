import AJOElement from './AJOElement';
import AJOField from './AJOField';
import AJOInstance from './AJOInstance';
import AJOObject from './AJOObject';

export default class AJOList extends AJOField {
  /**
   * Variable list contains all AJOObject of this AJOList
   * @type {AJOObject[]}
   */
  private list: AJOObject[];

  /**
   * Variable sortFunc contains the function to sort the list on each update
   * @type {( (a: AJOObject, b: AJOObject) => number ) | null}
   */
  private sortFunc: ((a: AJOObject, b: AJOObject) => number) | null;

  /**
   * Constructor of AJOList
   * @param fieldList list of field where the element of this AJOList is stored
   * @param ajoParent the parent of this object, null if this object is the root
   * @param sortFunc optionnal parameter, the function to sort the list on each update
   */
  constructor(
    field: string[] | string | null = null,
    ajoParent: AJOElement | null = null,
    sortFunc: ((a: AJOObject, b: AJOObject) => number) | null = null,
  ) {
    super(field, ajoParent);
    this.sortFunc = sortFunc;
    this.list = [];
  }

  /**
   * Function used to sort the AJOList
   */
  public sort() {
    if (this.sortFunc != undefined) {
      this.list.sort(this.sortFunc);
    }
  }

  /**
   * Function used to add an AJOObject to the list
   * @param obj the object to add
   */
  public push(obj: AJOObject) {
    this.list.push(obj);
    this.sort();
  }

  /**
   * Function used to remove an AJOObject from the list
   * @param i the index of the object to remove
   */
  public remove(i: number) {
    this.list.splice(i, 1);
    this.sort();
  }

  /**
   * Function used to get element of the list by index
   * @param i the index
   */
  public get(i: number): AJOObject {
    return this.list[i];
  }

  /**
   * Function used to get the length of the list
   */
  public size(): number {
    return this.list.length;
  }
  private applyArray(array: any): boolean {
    let res = false;
    if (!(array instanceof Array)) {
      array = [array];
    }
    // go throw the json array
    for (const elem of array) {
      //
      let ajoElem: AJOObject | null = null;

      // boolean that indicate if the object exist in the list
      let found: boolean = false;
      let i: number = 0;
      while (!found && i < this.list.length) {
        const ajoElement: AJOObject = this.list[i];

        // check if the object correspond to the json
        if (ajoElement.equals(elem)) {
          // object found
          ajoElem = ajoElement;
          found = true;
        } else {
          // we go to the next object
          i++;
        }
      }
      // if the object doesn't exist
      if (ajoElem == null) {
        // check if the object its not a delete order
        if (elem[AJOInstance.getDeleteField()] === undefined) {
          // Convert the json to an AJOObject
          ajoElem = AJOInstance.convert(elem);
          // if element has been convert
          if (ajoElem != null) {
            ajoElem.setAjoParent(this);
            res = true;
            this.push(ajoElem);
          }
        }
      } else {
        // element exists
        if (elem[AJOInstance.getDeleteField()] === true ||
        elem[AJOInstance.getDeleteField()] === this.getAjoIdentifier()) {
          // delete the element
          res = true;
          this.remove(i);
        } else {
          // update the element
          res = ajoElem.applyDataRec(elem, false) || res;
        }
      }
    }
    return res;
  }
  public applyDataRec(data: { [key: string]: any; }, first: boolean): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // go throw json source only if the data was applyed to the parent
    if (!this.hasParent()) {
      res = this.applyArray(data) || res;
    } else if (first) {
      // get the json array for all field
      for (const field of this.fieldList) {
        // current json document
        if (!(data instanceof Array)) {
          const array = data[field];
          res = this.applyArray(array) || res;
        } else {
          res = this.applyArray(data) || res;
        }
      }
    }
    return res;
  }
  public applyData(data: { [key: string]: any }) {
    return false;
  }

  protected override passToChild(data: { [key: string]: any }): boolean {
    return false;
  }

  public override getAJOElementList(recursively: boolean): AJOElement[] {
    let list: AJOElement[] = [...this.list];
    if (recursively) {
      for (let i = 0; i < this.list.length; i++) {
        let childList = this.list[i].getAJOElementList(recursively);
        for (let j = 0; j < childList.length; j++) {
          list.push(childList[j]);
        }
      }
    }
    return list;
  }
}