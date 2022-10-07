import AJOElement from './AJOElement';
import AJOField from './AJOField';
import AJOInstance from './AJOInstance';
import AJOUtils from './AJOUtils';

export default abstract class AJOObject extends AJOElement {
  public static _TYPE: string = 'AJOObject';

  /**
   * Variable ajoIdentifier contains the identifier of the object
   * @type {any}
   */
  private ajoIdentifier: any;

  /**
   * Variable ajoType contains the type of the object
   * @type {string}
   */
  private ajoType: string;

  /**
   * Variable create indicates if the object is inflated or not
   * create goes true when the object receives its first data
   * @type {boolean}
   */
  private create: boolean;

  /**
   * Constructor of AJOObject
   * @param ajoType the string that identifies the type of the object defined at _TYPE in your AJOObject class
   * @param ajoParent the parent of this object, null if this object is the root
   * @param ajoIdentifier optionnal parameter, the identifier of the object
   */
  constructor(ajoType: string, ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(ajoParent);

    this.ajoIdentifier = ajoIdentifier;
    this.ajoType = ajoType;

    // if there is an identifier the object is already created
    this.create = ajoIdentifier !== undefined && ajoIdentifier != null;
  }
  /**
   * Set the ajoIdentifier of this AJOObject
   * @param ajoIdentifier the new ajoIdentifier
   */
  public setAjoIdentifier(ajoIdentifier: any) {
    this.ajoIdentifier = ajoIdentifier;
    this.setCreate(ajoIdentifier !== undefined && ajoIdentifier != null);
  }
  /**
   * Get the ajoIdentifier of this AJOObject
   * @returns {any} the ajoIdentifier of this AJOObject
   */
  public override getAjoIdentifier(): any {
    return this.ajoIdentifier;
  }

  /**
   * Set the ajoType of this AJOObject
   * @param ajoType the new ajoType
   */
  public setAjoType(ajoType: string) {
    this.ajoType = ajoType;
  }
  /**
   * Get the ajoType of this AJOObject
   * @returns {any} the ajoType of this AJOObject
   */
  public override getAjoType(): string {
    return this.ajoType;
  }

  /**
   * Get the create flag
   * @returns {boolean} the create flag
   */
  public isCreate(): boolean {
    return this.create;
  }

  /**
   * Set the create flag
   * @param create the new create flag
   */
  public setCreate(create: boolean) {
    this.create = create;
  }

  public equals(data: { [key: string]: any }): boolean {
    let res = false;
    if (data instanceof AJOObject) {
      if (AJOInstance.isDeepEqual()) {
        res = this.getAjoIdentifier() === data.getAjoIdentifier() && this.getAjoType() === data.getAjoType();
      } else {
        res = this.getAjoIdentifier() === data.getAjoIdentifier();
      }
    } else if (typeof data === 'object') {
      if (!this.isCreate()) {
        if (AJOInstance.isDeepEqual()) {
          res = this.getAjoType() === data[AJOInstance.getTypeField()];
        }
        else {
          res = true;
        }
      } else if (AJOInstance.isDeepEqual()) {
        res =
          this.getAjoIdentifier() === data[AJOInstance.getIdentifierField()] &&
          this.getAjoType() === data[AJOInstance.getTypeField()];
      } else {
        res = this.getAjoIdentifier() === data[AJOInstance.getIdentifierField()];
      }
    }
    return res;
  }

  public override applyDataPartiel(data: { [key: string]: any }, first: boolean): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // check if the json correspond to the object
    const applyData = this.equals(data);
    if (applyData) {
      // get the identifier of the json source
      const ajoIdentifier = data[AJOInstance.getIdentifierField()];

      // check if the identifier exists
      if (ajoIdentifier !== undefined) {
        // create the object with this identifier
        res = true;
        this.setCreate(true);
        this.setAjoIdentifier(ajoIdentifier);
      }
    }

    if (first && this.getAjoParent() instanceof AJOField) {
      const parent = this.getAjoParent() as AJOField;

      const json: any = {};
      json[parent.getField()] = data;
      parent.applyDataPartiel(json, true);
    }

    if (applyData) {
      this.passToChild(data);
    }

    // Make the update
    super.makeUpdate(res);

    return res;
  }

  private passToChild(data: { [key: string]: any }) {
    let res = false;
    const list = this.getAJOElementList(false);
    // number of child
    const len = list.length;
    for (let i = 0; i < len; i++) {
      // for each child
      const ajoElement: AJOElement = list[i];
      // apply the data to the child
      res = ajoElement.applyDataPartiel(data, true) || res;
    }
    return res;
  }

  /**
   * Get all AJOObject in the object
   * @returns {AJOObject[]}
   */
  public getAJOObjectList(recursively: boolean): AJOObject[] {
    const listAJOObject: AJOObject[] = [this];
    const listAJOElement: AJOElement[] = this.getAJOElementList(recursively);
    for (const ajoElement of listAJOElement) {
      if (ajoElement instanceof AJOObject) {
        listAJOObject.push(ajoElement as AJOObject);
      }
    }
    return listAJOObject;
  }

  /**
   * Apply data to the object and its child
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public override applyData(data: { [key: string]: any }): boolean {
    let res = false;

    const allObject: AJOObject[] = this.getAJOObjectList(true);
    const allJson: { [key: string]: any }[] = AJOUtils.getAllJsonObject(data);

    for (const json of allJson) {
      for (const child of allObject) {
        if (child.equals(json)) {
          res = child.applyDataPartiel(json, true) || res;
        }
      }
    }
    return res;
  }
}
