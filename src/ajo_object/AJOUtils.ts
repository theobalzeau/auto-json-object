export default class AJOUtils {
  public static getAllObject(obj: { [key: string]: any }): { [key: string]: any } {
    let list: { [key: string]: any }[] = [];
    list.push(obj);
    Object.getOwnPropertyNames(obj).forEach((field: string) => {
      if (obj[field] instanceof Array) {
        Array.from(obj[field] as any).forEach((elem: any) => {
          if (typeof elem === 'object') {
            list = list.concat(AJOUtils.getAllObject(elem));
          }
        });
      } else if (typeof obj[field] === 'object') {
        list = list.concat(AJOUtils.getAllObject(obj[field]));
      }
    });
    return list;
  }
}
