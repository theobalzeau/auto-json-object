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


export default class Address extends AJOObject {

  public static _TYPE: string = 'Address';

  public name: AJOProperties;
  public postal_code: AJOProperties;
  public city: AJOProperties;
  public number_and_street: AJOProperties;

  constructor() {
      super(Address._TYPE);

      this.name = new AJOProperties('name');
      this.postal_code = new AJOProperties('postal_code');
      this.city = new AJOProperties('city');
      this.number_and_street = new AJOProperties('number_and_street');
  }

  public static build(): Address {
      return new Address();
  }
}

AJOInstance.add(Address.build());

test('AJOState (2) ajolist orpheline', () => {
  const state = new AJOState<AJOList<Address>>(new AJOList<Address>(undefined, Address._TYPE));
  state.applyData(
    [
      {
        "_id": "274b2fb8-cc69-4bfd-a15a-e0fce1b028b1", 
        "_id_str": "274b2fb8-cc69-4bfd-a15a-e0fce1b028b1", 
        "_type": "Address", 
        "city": "Apremont", 
        "name": null, 
        "number_and_street": "76 Route de Myans", 
        "postal_code": "73190"
      }, 
      {
        "_id": "73aad18e-32d5-4556-b8c2-2c41839fb439", 
        "_id_str": "73aad18e-32d5-4556-b8c2-2c41839fb439", 
        "_type": "Address", 
        "city": "Apremont", 
        "name": "Maison", 
        "number_and_street": "76 Route de Myans", 
        "postal_code": "73190"
      }, 
      {
        "_id": "cd19590d-bb4a-43a2-974f-ebded62bfa0d", 
        "_id_str": "cd19590d-bb4a-43a2-974f-ebded62bfa0d", 
        "_type": "Address", 
        "city": "Chamb\u00e9ry", 
        "name": "Th\u00e9\u00e2tre Charles-Dullin", 
        "number_and_street": "Place du Th\u00e9\u00e2tre", 
        "postal_code": 73000
      }
    ]
  )
  expect(state.get()!.get(0).getAjoIdentifier()).toBe('274b2fb8-cc69-4bfd-a15a-e0fce1b028b1');
});