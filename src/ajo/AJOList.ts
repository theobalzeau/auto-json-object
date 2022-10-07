import AJOElement from './AJOElement';
import AJOField from './AJOField';
import AJOInstance from './AJOInstance';
import AJOObject from './AJOObject';

export default class AJOList<Type extends AJOObject> extends AJOField {
  /**
   * Variable list contains all AJOObject of this AJOList
   * @type {Type[]}
   */
  private list: Type[];


  /**
   * Variable list contains all AJOObject of this AJOList
   * @type {string[]}
   */
  private typeList: string[];

  /**
   * Variable sortFunc contains the function to sort the list on each update
   * @type {( (a: Type, b: Type) => number ) | null}
   */
  private sortFunc: ((a: Type, b: Type) => number) | null;

  /**
   * Constructor of AJOList
   * @param fieldList list of field where the element of this AJOList is stored
   * @param ajoParent the parent of this object, null if this object is the root
   * @param sortFunc optionnal parameter, the function to sort the list on each update
   */
  constructor(
    field: string[] | string | null = null,
    type: string[] | string | null = null,
    ajoParent: AJOElement | null = null,
    sortFunc: ((a: Type, b: Type) => number) | null = null,
  ) {
    super(field, ajoParent);
    if (type instanceof Array) {
      this.typeList = type;
    }
    else if (typeof type === 'string') {
      this.typeList = [type];
    }
    else {
      this.typeList = [];
    }
    this.sortFunc = sortFunc;
    this.list = [];
  }

  /**
   * Function used to sort the AJOList
   */
  public sort() {
    if (this.sortFunc != null) {
      this.list.sort(this.sortFunc);
    }
  }

  /**
   * Function used to add an Type to the list
   * @param obj the object to add
   */
  public push(obj: Type) {
    this.list.push(obj);
    this.sort();
    
  }

  /**
   * Function used to remove an Type from the list
   * @param i the index of the object to remove
   */
  public remove(i: number) {
    this.list.splice(i, 1);
    this.sort();
  }

  public reset() {
    this.list = [];
  }

  /**
   * Function used to get element of the list by index
   * @param i the index
   */
  public get(i: number): Type {
    return this.list[i];
  }

   public getList(): Type[] {
    return this.list;
  }public setList(list: Type[]) {
    this.list = list;
  }

  public map(calback: (value: Type, index: number, array: Type[]) => any) : any[] {
    return this.list.map(calback);
  }

  /**
   * Function used to get the length of the list
   */
  public size(): number {
    return this.list.length;
  }
  private applyArray(array: any): boolean {
    let res = false;

    if(array!==undefined){
      if (!(array instanceof Array)) {
        array = [array];
      }
      // go throw the json array
      for (const elem of array) {
        if(elem!==undefined){
          //
          let ajoElem: Type | null = null;
    
          // boolean that indicate if the object exist in the list
          let found: boolean = false;
          let i: number = 0;
          while (!found && i < this.list.length) {
            const ajoElement: Type = this.list[i];
    
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
            if (!this.isDeleteOrder(elem, null)) {
              // Convert the json to an Type
              try { 
                ajoElem = AJOInstance.convert(elem, this) as Type;
                // if element has been convert
                if (ajoElem != null&&(this.typeList.indexOf(ajoElem.getAjoType())!==-1||this.typeList.length===0)) {
                  this.push(ajoElem);
                  res = true;
                }
              } catch(e){
                throw e;
                throw new Error('Your AJOList cannot take this type.');
              }
            }
          } 
          else {
            // element exists
            if (this.isDeleteOrder(elem, ajoElem)) {
              // delete the element
              res = true;
              this.remove(i);
            } else {
              // update the element
              res = ajoElem.applyDataPartiel(elem, false) || res;
            }
          }
        }
      }
    }
    this.sort();
    return res;
  }
  public override applyDataPartiel(data: { [key: string]: any }, first: boolean): boolean {
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

    // Make the update
    super.makeUpdate(res);

    return res;
  }

  public override getAJOElementList(recursively: boolean): AJOElement[] {
    const list: AJOElement[] = [...this.list];
    if (recursively) {
      for (const elem of this.list) {
        const childList = elem.getAJOElementList(recursively);
        for (const child of childList) {
          list.push(child);
        }
      }
    }
    return list;
  }
}
