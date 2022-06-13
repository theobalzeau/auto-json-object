export default class AJOUtils {
  public static getAllJsonObject(obj: { [key: string]: any }): { [key: string]: any }[] {
    let list: { [key: string]: any }[] = [];
    list.push(obj);
    Object.getOwnPropertyNames(obj).forEach((field: string) => {
      if (obj[field] instanceof Array) {
        Array.from(obj[field] as any).forEach((elem: any) => {
          if (typeof elem === 'object') {
            list = list.concat(AJOUtils.getAllJsonObject(elem));
          }
        });
      } else if (typeof obj[field] === 'object') {
        list = list.concat(AJOUtils.getAllJsonObject(obj[field]));
      }
    });
    return list;
  }
}
