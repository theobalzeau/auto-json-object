import AJOList from '../ajo/AJOList';
import AJOData from '../ajo/AJOData';
import AJOElement from '../ajo/AJOElement';
import AJOInstance from '../ajo/AJOInstance';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOSimple from '../ajo/AJOSimple';
import AJOState from '../ajo/AJOState';

/**
 * Exemple of an AJOData
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

class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  role: AJOSimple<Role>;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.role = new AJOSimple('role', this);
  }

  public static build() {
    return new User();
  }
}

AJOInstance.add(Role.build());
AJOInstance.add(User.build());
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

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
  _id: '3',
  _type: 'Role',
  name: 'AdminUpdated',
};

test('AJOState (1) update at root', () => {
  let countUpdateUser = 0;

  let stateUser = new AJOState<User>(User.build());
  let updateUser = function (newState: AJOState<User>) {
    stateUser = newState;
    stateUser.setUpdate(updateUser);

    countUpdateUser++;
  };
  stateUser.setUpdate(updateUser);

  stateUser.get()?.applyData(json1);

  expect(countUpdateUser).toBeGreaterThan(0);
});

test('AJOState (1) update in hierarchy', () => {
  let countUpdateUser = 0;

  let stateUser = new AJOState<User>(User.build());
  let updateUser = function (newState: AJOState<User>) {
    stateUser = newState;
    stateUser.setUpdate(updateUser);

    countUpdateUser++;
  };
  stateUser.setUpdate(updateUser);

  stateUser.get()?.applyData(json1);

  countUpdateUser = 0;

  let countUpdateRole = 0;

  let stateRole = new AJOState<Role>(null);
  let updateRole = function (newState: AJOState<Role>) {
    stateRole = newState;
    stateRole.setUpdate(updateRole);

    countUpdateRole++;
  };
  stateRole.setUpdate(updateRole);

  stateRole.set(stateUser.get()?.role.get() ?? null);

  stateUser.get()?.applyData(json2);

  expect(countUpdateRole).toBeGreaterThan(0);
});