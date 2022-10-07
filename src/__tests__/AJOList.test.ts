import AJOElement from '../ajo/AJOElement';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOList from '../ajo/AJOList';
import AJOInstance from '../ajo/AJOInstance';
import AJOSimple from '../ajo/AJOSimple';
/**
 * Exemple of an AJOObject that will
 * be stored in a AJOList
 */
class Comment extends AJOObject {
  static override _TYPE: string = 'Comment';

  text: AJOProperties;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(Comment._TYPE, ajoParent, ajoIdentifier);
    this.text = new AJOProperties('text', this);
  }

  public static build() {
    return new Comment();
  }
}
class Role extends AJOObject{
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
  commentList: AJOList<Comment>;
  role: AJOSimple<Role>;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.commentList = new AJOList<Comment>('comment', Comment._TYPE, this);
    this.role = new AJOSimple<Role>('has_role', this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOList
 */
AJOInstance.add(User.build());
AJOInstance.add(Comment.build());
AJOInstance.add(Role.build());
AJOInstance.setIdentifierField('_id');
AJOInstance.setTypeField('_type');
AJOInstance.setDeleteField('_ajo_delete');

/**
 * TEST n°1
 * AJOList orpheline
 */
test('AJOList (1) orpheline', () => {
  let list = new AJOList<User>(undefined, [User._TYPE]);
  let jsonArray3 = [
              {
                  "_id": 17,
                  "_id_str": "17",
                  "_type": "User",
                  "active": false,
                  "delete": false,
                  "email": "ge1@gmail.com",
                  "first": true,
                  "firstname": "Théo",
                  "has_role": [
                      {
                          "_id": 8,
                          "_id_str": "8",
                          "_type": "Role",
                          "name": "Utilisateur"
                      }
                  ],
                  "lastname": "BALZEAU",
                  "password": "$2a$12$y5c4RVzcSbiAZt76fdZ6ReilxdJ8l5oR6C3hIzvt1HYQ9B7erwKy2",
                  "root": false,
                  "set": false
              }
  ];
  list.applyData(jsonArray3);

  let jsonArray4 = [
    {
      _id: '1',
      _type: 'Comment',
      text: 'text1',
    }
];
  list.applyData(jsonArray4);
  expect(list.get(list.size()-1) instanceof Comment).toBe(false);
});

/**
 * TEST n°2
 * AJOList inside AJOObject + update
 */
test('AJOList (2) list in object', () => {
  let userJson = {
    _id: '1',
    name: 'theobalzeau',
    _type: 'User',
    comment: [
      {
        _id: '1',
        _type: 'Comment',
        text: 'text1',
      },
      {
        _id: '2',
        _type: 'Comment',
        text: 'text2',
      },
      {
        _id: '3',
        _type: 'Comment',
        text: 'text3',
      },
    ],
  };
  let userAjo = new User();
  // first fit
  userAjo.applyData(userJson);
  // delete 1 element
  let delJson1 = {
    _id: '1',
    _ajo_delete: '1',
    _type: 'Comment',
  };
  userAjo.applyData(delJson1);
  let delJson2 = {
    _id: '3',
    _type: 'Comment',
    text: 'text3updated',
  };
  userAjo.applyData(delJson2);
  expect((userAjo.commentList.get(1) as Comment).text.get()).toBe('text3updated');
});
