import AJOInstance from './AJOInstance';
import AJOElement from './AJOElement';
import AJOList from './AJOList';
import AJOSimple from './AJOSimple';

/**
 * AJOObject extends AJOElement is the class represente a node
 * with identifier and type (label)
 */
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
    this.create = ajoIdentifier != undefined && ajoIdentifier != null;
  }
  /**
   * Set the ajoIdentifier of this AJOObject
   * @param ajoIdentifier the new ajoIdentifier
   */
  private setAjoIdentifier(ajoIdentifier: any) {
    this.ajoIdentifier = ajoIdentifier;
  }
  /**
   * Get the ajoIdentifier of this AJOObject
   * @returns {any} the ajoIdentifier of this AJOObject
   */
  public getAjoIdentifier(): any {
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
  public getAjoType(): string {
    return this.ajoType;
  }

  /**
   * Apply data to the object and its child conform to the mode of the AJOInstance
   * return true if their is any change in the hierarchy
   * @param data the json souce
   * @returns {boolean} true if their is any change in the object or in the child
   */
  public override applyData(data: any): boolean {
    // boolean that indicates if the object has changed
    let res = false;

    // check if the json correspond to the object
    const applyData = this.equals(data);
    if (applyData) {
      // get the identifier of the json source
      let ajoIdentifier = data[AJOInstance.getIdentifierField()];

      // check if the identifier exists
      if (ajoIdentifier != undefined) {
        // create the object with this identifier
        res = true;
        this.setCreate(true);
        this.setAjoIdentifier(ajoIdentifier);
      }
    }

    if (this.getAjoParent() instanceof AJOList) {
      let list = this.getAjoParent() as AJOList;
      list.applyData([data]);
    }

    /*if(this.getAjoParent() instanceof AJOSimple){
      let list = this.getAjoParent() as AJOSimple;
      list.applyData(data)
    }*/

    // Apply the data to the child
    res = super.applyAjoPolicy(data, applyData) || res;

    // Make the update
    super.makeUpdate(res);

    // return the result
    return res;
  }

  public override equals(data: { [key: string]: any }): boolean {
    let res = false;
    if (data instanceof AJOObject) {
      if (AJOInstance.isDeepEqual()) {
        res = this.getAjoIdentifier() === data.getAjoIdentifier() && this.getAjoType() === data.getAjoType();
      } else {
        res = this.getAjoIdentifier() === data.getAjoIdentifier();
      }
    } else if (typeof data === 'object') {
      if (!this.isCreate()) {
        res = true;
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
}
