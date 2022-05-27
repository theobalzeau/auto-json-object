import AJOMode from './AJOMode';
import AJOObject from './AJOObject';

export default class AJOInstance {
  static instance: AJOInstance;

  private listObject: AJOObject[];
  private identifierField: string;
  private typeField: string;
  private deleteField: string;
  private deepEqual: boolean;
  private mode: AJOMode;

  constructor() {
    this.listObject = [];
    this.identifierField = '_id';
    this.typeField = '_type';
    this.deleteField = '_id_del';
    this.deepEqual = true;
    this.mode = AJOMode.FIX_TO_MODOL;
  }

  public static size(): number {
    return AJOInstance.list().length;
  }

  public static get() {
    if (AJOInstance.instance == null) {
      AJOInstance.instance = new AJOInstance();
    }
    return AJOInstance.instance;
  }

  public static setIdentifierField(field: string) {
    AJOInstance.get().identifierField = field;
  }
  public static setTypeField(field: string) {
    AJOInstance.get().typeField = field;
  }
  public static setDeleteField(field: string) {
    AJOInstance.get().deleteField = field;
  }
  public static setDeepEqual(field: string) {
    AJOInstance.get().deleteField = field;
  }
  public static setMode(mode: AJOMode) {
    AJOInstance.get().mode = mode;
  }

  public static getIdentifierField(): string {
    return AJOInstance.get().identifierField;
  }
  public static getTypeField(): string {
    return AJOInstance.get().typeField;
  }
  public static getDeleteField(): string {
    return AJOInstance.get().deleteField;
  }
  public static getMode(): AJOMode {
    return AJOInstance.get().mode;
  }
  public static isDeepEqual(): boolean {
    return AJOInstance.get().deepEqual;
  }

  public static add(object: AJOObject) {
    if (!AJOInstance.have(object)) {
      AJOInstance.list().push(object);
    }
  }

  public static list() {
    return AJOInstance.get().listObject;
  }

  public static have(object: AJOObject): boolean {
    let found: boolean = false;
    let i: number = 0;
    const list: AJOObject[] = AJOInstance.list();

    while (!found && i < list.length) {
      found = list[i].getAjoType() === object.getAjoType();
      i++;
    }

    return found;
  }

  public static build(elem: any) {
    let res: AJOObject | null = null;
    let i: number = 0;
    const list: AJOObject[] = AJOInstance.list();

    while (res == null && i < list.length) {
      if (list[i].getAjoType() === elem[AJOInstance.getTypeField()]) {
        res = ((list[i] as AJOObject).constructor as any).build();
      }
      i++;
    }

    return res;
  }

  public static convert(json: any): AJOObject | null {
    let res = null;
    if (typeof json === 'object') {
      const elem = AJOInstance.build(json);
      if (elem != null) {
        elem.applyData(json);
        res = elem;
      }
    }
    return res;
  }
}
