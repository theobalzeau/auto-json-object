import AJOData from '../ajo/AJOData';
import AJOElement from '../ajo/AJOElement';
import AJOInstance from '../ajo/AJOInstance';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';

/**
 * Exemple of an AJOData
 */
class Password extends AJOData {
  hash: AJOProperties;
  salt: AJOProperties;
  constructor(ajoParent: AJOElement | null = null) {
    super('password', ajoParent);
    this.hash = new AJOProperties('hash', this);
    this.salt = new AJOProperties('salt', this);
  }
}

class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  password: Password;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.password = new Password(this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOData
 */
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

/**
 * TEST n°1
 * AJOData orpheline
 */
test('AJOData (1) orpheline', () => {
  let passwordJson = {
    hash: 'hash',
    salt: 'salt',
  };
  let passwordAjo = new Password();
  passwordAjo.applyData(passwordJson);
  expect(passwordAjo.hash.get()).toBe('hash');
});

/**
 * TEST n°2
 * AJOData inside AJOObject + update
 */
test('AJOData (2) AJOData inside AJOObject', () => {
  let userJson = {
    _id: '1',
    name: 'theobalzeau',
    _type: 'User',
    password: {
      hash: 'hash',
      salt: 'salt',
    },
  };
  // first fit
  let userAjo = new User();
  userAjo.applyData(userJson);
  let userJson2 = {
    _id: '1',
    name: 'theobalzeau',
    _type: 'User',
    password: {
      hash: 'hash2',
      salt: 'salt',
    },
  };
  // check update
  userAjo.applyData(userJson2);
  expect(userAjo.password.hash.get()).toBe('hash2');
});
