export default interface AJOInterface {
    applyDataRec(data: { [key: string]: any }, first: boolean): boolean;
    applyData(data: { [key: string]: any }): boolean;
}