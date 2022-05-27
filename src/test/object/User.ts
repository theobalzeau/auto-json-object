import { AJOSimple, AJOList, AJOObject, AJOProperties, AJOElement } from '../../index';
import Password from './Password';
export default class User extends AJOObject {
  static _TYPE: string = 'User';

  text: AJOProperties;
  note: AJOProperties;
  star: AJOProperties;

  role: AJOSimple;
  role2: AJOSimple;

  password: Password;

  commentList: AJOList;

  constructor(ajo_parent: AJOElement | null = null) {
    super(User._TYPE, ajo_parent);

    this.text = new AJOProperties('text', this);
    this.note = new AJOProperties('note', this);
    this.star = new AJOProperties('star', this);

    this.role = new AJOSimple('role', this);
    this.role2 = new AJOSimple('role2', this);

    this.password = new Password('password', this);

    this.commentList = new AJOList('comment', this);
  }

  public static build() {
    return new User();
  }
}
