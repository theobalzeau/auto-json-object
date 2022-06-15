import AJOElement from '../ajo/AJOElement';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOInstance from '../ajo/AJOInstance';
import AJOSimple from '../ajo/AJOSimple';
/**
 * Exemple of an AJOObject that will
 * be stored in a AJOList
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
 * Exemple of an AJOList inside AJOObject
 */
class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  role: AJOSimple;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.role = new AJOSimple('role', this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOList
 */
AJOInstance.add(Role.build());
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

/**
 * TEST n°1
 * AJOList orpheline
 */
/*test("AJOList (1) orpheline", () => {
    let list = new AJOList();
    let jsonArray1 = [
        {
            _id: "1",
            _type: "Comment",
            text: "text1"
        },
        {
            _id: "2",
            _type: "Comment",
            text: "text2"
        },
        {
            _id: "3",
            _type: "Comment",
            text: "text3"
        }
    ];
    list.applyData(jsonArray1);
    let jsonArray2 = [
        {
            _id: "2",
            _ajo_delete: true,
            _type: "Comment",
            text: "text2"
        },
        {
            _id: "3",
            _type: "Comment",
            text: "text3updated"
        }
    ];
    list.applyData(jsonArray2);
    expect((list.get(1) as Comment).text.get()).toBe("text3updated");
});*/

/**
 * TEST n°2
 * AJOList inside AJOObject + update
 */
let userJson = {
    _id: "1",
    name: "theobalzeau",
    _type: "User",
    role: [
        {
            _id: "3",
            _type: "Role",
            name: "Admin"
        }
    ]
}
let userAjo = new User();
// first fit
console.log("START APPLY")
userAjo.applyData(userJson);

let json2 = {
  _id: "2",
  name: "SuperAdmin",
  _type: "Role",
  parent: [
      {
          _id: "3",
          _type: "Role",
          name: "AdminUpdated"
      }
  ]
}
console.log("START APPLY")
userAjo.applyData(json2);
console.log((userAjo.role.get() as Role).name.get()=="AdminUpdated");

let json3 = {
  _ajo_delete: "1",
  _id: "3",
  _type: "Role",
  name: "AdminUpdated"
}
console.log("START APPLY")
userAjo.applyData(json3);
console.log(userAjo.role.get() == null);
