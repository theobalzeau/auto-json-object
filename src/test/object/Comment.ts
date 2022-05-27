import { AJOObject, AJOProperties, AJOElement } from '../../index';

export default class Comment extends AJOObject {
  public static _TYPE: string = 'Comment';

  text: AJOProperties;

  constructor(ajo_parent: AJOElement | null = null) {
    super(Comment._TYPE, ajo_parent);

    this.text = new AJOProperties('text', this);
  }

  public static build(): Comment {
    return new Comment();
  }
}
