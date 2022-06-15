import AJOElement from '../ajo/AJOElement';
import AJOObject from '../ajo/AJOObject';
import AJOProperties from '../ajo/AJOProperties';
import AJOList from '../ajo/AJOList';
import AJOInstance from '../ajo/AJOInstance';
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
/**
 * Exemple of an AJOList inside AJOObject
 */
class User extends AJOObject {
  static override _TYPE: string = 'User';

  name: AJOProperties;
  commentList: AJOList;

  constructor(ajoParent: AJOElement | null = null, ajoIdentifier?: any) {
    super(User._TYPE, ajoParent, ajoIdentifier);
    this.name = new AJOProperties('name', this);
    this.commentList = new AJOList('comment', this);
  }

  public static build() {
    return new User();
  }
}

/**
 * Test for AJOList
 */
AJOInstance.add(Comment.build());
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
//test("AJOList (2) list in object", () => {
    let userJson = {
        _id: "1",
        name: "theobalzeau",
        _type: "User",
        comment: [
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
        ]
    }
    let userAjo = new User();
    // first fit
    userAjo.applyData(userJson);
    // delete 1 element
    let delJson1 = {
        _id: "1",
        _ajo_delete: "1",
        _type: "Comment"
    }
    userAjo.applyData(delJson1);
    let delJson2 = {
        _id: "3",
        _type: "Comment",
        text: "text3updated"
    }
    userAjo.applyData(delJson2);
    console.log((userAjo.commentList.get(1) as Comment).text.get()=="text3updated");
