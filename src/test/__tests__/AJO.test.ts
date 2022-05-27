import { AJOInstance, AJOMode } from '../../index';
import Comment from '../object/Comment';
import User from '../object/User';

/* AJOIntance test */
test('AJOInstanceSize', () => {
  AJOInstance.add(User.build());
  AJOInstance.add(Comment.build());
  expect(AJOInstance.size()).toBe(2);
  expect(AJOInstance.getDeleteField()).toBe('_id_del');
  expect(AJOInstance.getTypeField()).toBe('_type');
  expect(AJOInstance.getIdentifierField()).toBe('_id');
});
test('AJOInstanceIdentifier', () => {
  AJOInstance.setIdentifierField('_id');
  expect(AJOInstance.getIdentifierField()).toBe('_id');
});
test('AJOInstanceDelete', () => {
  AJOInstance.setDeleteField('_id_del');
  expect(AJOInstance.getDeleteField()).toBe('_id_del');
});
test('AJOInstanceType', () => {
  AJOInstance.setTypeField('_type');
  expect(AJOInstance.getTypeField()).toBe('_type');
});

/* AJOOnject test */
let jsonComment1 = {
  _id: '1',
  _type: 'Comment',
  text: 'Comment n°1',
};
test('AJOIntanceConvertIdentifier', () => {
  let comment = AJOInstance.convert(jsonComment1) as Comment;
  expect(comment.getAjoIdentifier()).toBe('1');
});
test('AJOIntanceConvertProps', () => {
  let comment: Comment = AJOInstance.convert(jsonComment1) as Comment;
  expect(comment.text.get()).toBe('Comment n°1');
});

/* AJOObjectApplyData */
let jsonComment1Updated = {
  _id: '1',
  _type: 'Comment',
  text: 'Comment n°1 : Hello',
};
test('AJOObjectApplyDataFixToModol', () => {
  AJOInstance.setMode(AJOMode.FIX_TO_MODOL);
  let comment = AJOInstance.convert(jsonComment1) as Comment;
  comment.applyData(jsonComment1Updated);
  expect(comment.text.get()).toBe(jsonComment1Updated.text);
});
AJOInstance.setMode(AJOMode.PASS_TO_CHILD);
test('AJOObjectApplyDataPassToChild', () => {
  AJOInstance.setMode(AJOMode.FIX_TO_MODOL);
  let comment = AJOInstance.convert(jsonComment1) as Comment;
  comment.applyData(jsonComment1Updated);
  expect(comment.text.get()).toBe(jsonComment1Updated.text);
});
AJOInstance.setMode(AJOMode.PASS_ALL_TO_CHILD);
/*
let elem : User = AJO.convert(json) as User;
//console.log(elem);

let json2 = {
    "_id": "1",
    "_type": "User",
    "note": 10,
    "text": "Ceci est un User",
    "taille": 105,
    "password": {
        "hash": "123456789",
        "salt": "123456789"
    },
    "role": [{
        "_id": "3",
        "_type": "Role",
        "name": "admin",
    }],
    "role2": {
        "_id": "3",
        "_type": "Role",
        "name": "admin",
    },
    "comment": [{
        "_id": "1",
        "_type": "Comment",
        "text": "Je t'aime",
    }, {
        "_id": "2",
        "_type": "Comment",
        "text": "Je t'aime 2",
    }]
}
console.log("elem2");
elem.apply_data(json2);
console.log(elem)

let json3 = {
    "_id": "1",
    "_type": "User",
    "comment": [{
        "_id": "1",
        "_type": "Comment",
        "text": "Je t'aime",
    }, {
        "_id": "2",
        "_id_del": "2",
        "_type": "Comment",
        "text": "Je t 2",
    }]
}
console.log("elem3");
elem.apply_data(json3);
console.log(elem)

let json4 = {
    "_id": "1",
    "_type": "User",
    "role": [{
        "_id": "3",
        "_type": "Role",
        "name": "admin5",
    }],
    "role2": {
        "_id": "3",
        "_type": "Role",
        "name": "admin2",
    },
}
console.log("elem4");
elem.apply_data(json4);
/*
let json4 = {
    "_id": "2",
    "_id_del": "2",
    "_type": "Comment",
    "text": "Je",
}
console.log("elem4");
elem.apply_data(json4);
console.log(elem)

/*let json5 = {
    "_id": "2",
    "_type": "User",
    "comment": [{
        "_id": "1",
        "_type": "Comment",
        "text": "Je t'aime",
    }, {
        "_id": "2",
        "_id_del": "2",
        "_type": "Comment",
        "text": "Je2",
    }]
}
elem.apply_data(json5);
console.log(elem)*/
/*    expect("d").toBe('d');
});*/
