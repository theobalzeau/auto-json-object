import AJOElement from './AJOElement';
import AJOObject from './AJOObject';

/**
 * AJOInstance is the class that give you the
 * ability to customize how process AJO package
 */
export default class AJOInstance {
  /**
   * Global instance, for all class
   * @type {AJOInstance}
   */
  private static instance: AJOInstance;

  /**
   * Variable that contains all AJOObject, that can
   * created from json source
   * @type {AJOObject[]}
   */
  private list: AJOObject[];

  /**
   * Variable identifierField contains the field
   * where the identifier is stored in json source
   * @type {string}
   */
  private identifierField: string;

  /**
   * Variable typeField contains the field
   * where the type is stored in json source
   * @type {string}
   */
  private typeField: string;

  /**
   * Variable deleteField contains the field
   * where the deleted information is stored in json source
   * @type {string}
   */
  private deleteField: string;

  /**
   * Variable deepEqual inform the AJOInstance if
   * on how to compare AJOObject only with identifier
   * or with identifier and type
   * @type {boolean}
   */
  private deepEqual: boolean;

  /**
   * Constructor of AJOInstance
   * Define all default value of AJOInstance
   */
  private constructor() {
    this.list = [];
    this.identifierField = '_id';
    this.typeField = '_type';
    this.deleteField = '_id_del';
    this.deepEqual = true;
  }

  /**
   * Get the number of AJOObject in AJOInstance
   * @returns {number}
   */
  public static size(): number {
    return AJOInstance.list().length;
  }

  /**
   * Get the global AJOInstance
   * @returns {AJOInstance}
   */
  public static get(): AJOInstance {
    // if null create AJOInstance
    if (AJOInstance.instance == null) {
      AJOInstance.instance = new AJOInstance();
    }
    return AJOInstance.instance;
  }

  /**
   * Change the identifierField of the global AJOInstance
   * @param identifierField the new identifierField
   */
  public static setIdentifierField(identifierField: string) {
    AJOInstance.get().identifierField = identifierField;
  }

  /**
   * Change the typeField of the global AJOInstance
   * @param typeField the new typeField
   */
  public static setTypeField(typeField: string) {
    AJOInstance.get().typeField = typeField;
  }

  /**
   * Change the deleteField of the global AJOInstance
   * @param deleteField the new deleteField
   */
  public static setDeleteField(deleteField: string) {
    AJOInstance.get().deleteField = deleteField;
  }

  /**
   * Change the deleteField of the global AJOInstance
   * @param deleteField the new deleteField
   */
  public static setDeepEqual(deleteField: string) {
    AJOInstance.get().deleteField = deleteField;
  }
  /**
   * Get the identifierField of global AJOInstance
   * @returns {string} the identifierField
   */
  public static getIdentifierField(): string {
    return AJOInstance.get().identifierField;
  }

  /**
   * Get the typeField of global AJOInstance
   * @returns {string} the typeField
   */
  public static getTypeField(): string {
    return AJOInstance.get().typeField;
  }

  /**
   * Get the deleteField of global AJOInstance
   * @returns {string} the deleteField
   */
  public static getDeleteField(): string {
    return AJOInstance.get().deleteField;
  }

  /**
   * Get the deepEqual of global AJOInstance
   * @returns {boolean} the deepEqual
   */
  public static isDeepEqual(): boolean {
    return AJOInstance.get().deepEqual;
  }

  /**
   * Add a AJOObject to the global AJOInstance
   * @returns {AJOObject} the AJOObject
   */
  public static add(object: AJOObject) {
    if (!AJOInstance.have(object)) {
      AJOInstance.list().push(object);
    }
  }

  /**
   * Get the list of global AJOInstance
   * @returns {AJOObject[]} the list
   */
  private static list(): AJOObject[] {
    return AJOInstance.get().list;
  }

  /**
   * Check if the AJOObject already exists in AJOInstance
   * @param object the object to check
   * @returns {boolean}
   */
  public static have(object: AJOObject): boolean {
    let found: boolean = false;

    // index of the element in list
    let i: number = 0;

    // list of all AJOObject
    const list: AJOObject[] = AJOInstance.list();

    while (!found && i < list.length) {
      // check if the object is the same
      found = list[i].getAjoType() === object.getAjoType();
      i++;
    }

    // return the result
    return found;
  }

  /**
   * Create a AJOObject from json source
   * @param elem the json source
   */
  public static build(elem: { [key: string]: any }): AJOObject | null {
    // the element that will be returned
    let res: AJOObject | null = null;

    // index of the element in list
    let i: number = 0;

    // list of all AJOObject
    const list: AJOObject[] = AJOInstance.list();

    while (res == null && i < list.length) {
      // check if the elem is the same as the element in the list
      if (list[i].getAjoType() === elem[AJOInstance.getTypeField()]) {
        // create a new AJOObject with the elem in the list
        res = ((list[i] as AJOObject).constructor as any).build();
      }
      i++;
    }

    // the AJOObject if found
    return res;
  }

  /**
   * Convert the json source to AJOObject instance with data
   * @param json the json source
   */
  public static convert(json: { [key: string]: any }, parent : AJOElement | null = null): AJOObject | null {
    // the variable that contains the result
    let res = null;

    // Create a AJOObject with the json source
    const elem = AJOInstance.build(json);

    // If elem was found and created
    if (elem != null) {
      // set the data of the AJOObject
      elem.applyData(json);
      elem.setAjoParent(parent);
      res = elem;
    }

    // return the result
    return res;
  }
}
