import AJOElement from '../ajo/AJOElement';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOInstance from '../ajo/AJOInstance';
import AJOSimple from '../ajo/AJOSimple';
/**
 * Exemple of an AJOObject that will
 * be stored in a AJOSimple
 */
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
/**
 * Exemple of an AJOSimple inside AJOObject
 */
class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  role: AJOSimple<Role>;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.role = new AJOSimple<Role>('role', this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOSimple
 */
AJOInstance.add(Role.build());
AJOInstance.add(User.build());
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

/**
 * TEST n°1
 * AJOSimple orpheline
 */
let jsonOrpheline1 = {
  _id: '1',
  name: 'theobalzeau',
  _type: 'User',
  role: [
    {
      _id: '3',
      _type: 'Role',
      name: 'Admin',
    },
  ],
};
let jsonOrpheline2 = {
  _id: '2',
  name: 'SuperAdmin',
  _type: 'Role',
  parent: [
    {
      _id: '3',
      _type: 'Role',
      name: 'AdminUpdated',
    },
  ],
};
let jsonOrpheline3 = {
  _ajo_delete: true,
  _id: '1',
  _type: 'User',
  name: 'theobalzeau',
};
let jsonOrpheline4 = {
  _ajo_delete: '1',
  _id: '3',
  _type: 'Role',
  name: 'AdminUpdated',
};

test('AJOSimple (1) orpheline inflate / update / delete root', () => {
  let simple = new AJOSimple("", null);
  simple.applyData(jsonOrpheline1)
  simple.applyData(jsonOrpheline2);
  simple.applyData(jsonOrpheline3);
  expect(simple.get()).toBe(null);
});

test('AJOSimple (2) orpheline inflate / update / delete indide AJOObject', () => {
  let simple2 = new AJOSimple("", null);
  simple2.applyData(jsonOrpheline1)
  simple2.applyData(jsonOrpheline2);
  simple2.applyData(jsonOrpheline4);
  expect((simple2.get() as User).role.get()).toBe(null);
});

/**
 * TEST n°2
 * AJOSimple inside AJOObject + update
 */
let json1 = {
  _id: '1',
  name: 'theobalzeau',
  _type: 'User',
  role: [
    {
      _id: '3',
      _type: 'Role',
      name: 'Admin',
    },
  ],
};
let json2 = {
  _id: '2',
  name: 'SuperAdmin',
  _type: 'Role',
  parent: [
    {
      _id: '3',
      _type: 'Role',
      name: 'AdminUpdated',
    },
  ],
};
let json3 = {
  _ajo_delete: '1',
  _id: '3',
  _type: 'Role',
  name: 'AdminUpdated',
};
test('AJOSimple (3) inflate in AJOObject', () => {
  let userAjo = new User();
  userAjo.applyData(json1);
  expect((userAjo.role.get() as Role).name.get()).toBe('Admin');
});

test('AJOSimple (4) update in AJOObject', () => {
  let userAjo = new User();
  userAjo.applyData(json1);
  userAjo.applyData(json2);
  expect((userAjo.role.get() as Role).name.get()).toBe('AdminUpdated');
});

test('AJOSimple (5) delete in AJOObject', () => {
  let userAjo = new User();
  userAjo.applyData(json1);
  userAjo.applyData(json2);
  userAjo.applyData(json3);
  expect(userAjo.role.get()).toBe(null);
});
