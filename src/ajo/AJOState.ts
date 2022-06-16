import AJOObject from "./AJOObject";

export default class AJOState<Type extends AJOObject> {

    private elem : Type | null;
    private update : ((a: any) => null) | null;
    
    constructor(elem : Type | null) {
        this.elem = elem;
        this.update = null;
    }

    public set(elem : Type | null) {
        this.elem = elem;
    }
    
    public get() {
        return this.elem;
    }

    public recreate() : AJOState<Type> {
        return new AJOState(this.get());
    }
}