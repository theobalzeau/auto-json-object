import AJOElement from '../ajo/AJOElement';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOInstance from '../ajo/AJOInstance';
import AJOSimple from '../ajo/AJOSimple';
import AJOList from '../ajo/AJOList';

class Role extends AJOObject {
  static override _TYPE: string = 'Role';

  name: AJOProperties;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(Role._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
  }

  public static build() {
    return new Role();
  }
}

class Action extends AJOObject {
  static override _TYPE: string = 'Action';

  type: AJOProperties;
  role: AJOSimple<Role>;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(Action._TYPE, ajoParent, ajoIdentifier);
    this.type = new AJOProperties('type', this);
    this.role = new AJOSimple('role', this);
  }

  public static build() {
    return new Action();
  }
}

class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  actionList: AJOList<Action>;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.actionList = new AJOList('action', Action._TYPE, this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOSimple
 */
AJOInstance.add(Action.build());
AJOInstance.add(Role.build());
AJOInstance.add(User.build());
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

/**
 * TEST n°1
 * AJOSimple orpheline
 */
let json1 = {
  _id: '1',
  name: 'theobalzeau',
  _type: 'User',
  action: [
    {
      _id: '2',
      type: 4,
      _type: 'Action',
      role: {
        _id: '3',
        _type: 'Role',
        name: 'Admin',
      },
    },
    {
      _id: '4',
      type: 4,
      _type: 'Action',
      role: {
        _id: '5',
        _type: 'Role',
        name: 'Membre',
      },
    },
    {
      _id: '6',
      type: 4,
      _type: 'Action',
      role: [
        {
          _id: '7',
          _type: 'Role',
          name: 'Visiteur',
        },
      ],
    },
  ],
};

test('AJOSimple (3) inflate in AJOObject', () => {
  let userAjo = new User();
  userAjo.applyData(json1);
  expect(userAjo.actionList.size()).toBe(3);
});
test('AJOSimple (4) inflate in AJOObject', () => {
  let userAjo = new User();
  userAjo.applyData(json1);
  expect(userAjo.actionList.get(2).role.get()?.name.get()).toBe('Visiteur');
});
