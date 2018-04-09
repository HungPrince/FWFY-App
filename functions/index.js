var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPush = functions.database.ref('/post/{postId}').onWrite(event => {
    var post = event.before.val()
    let postStateChanged = false;
    let postCreated = false;
    let postData;
    if (!event.before.val()) {
        postCreated = true;
    }
    else {
        postStateChanged = true;
    }
    let msg = `A post state was changed ${post.title}`;
    if (postCreated) {
        msg = `The following new post was added`;
    }

    return loadUsers().then(users => {
        let tokens = [];
        for (let user of users) {
            tokens.push(user.pushToken);
        }
        console.log(tokens);
        let payload = {
            notification: {
                title: 'Firebase Notification',
                body: msg,
                sound: 'default',
                badge: '1'
            }
        };
        return admin.messaging().sendToDevice("31df83bd-8d14-83f3-8657-590372660828", payload);
    });
});

function loadUsers() {
    let dbRef = admin.database().ref('/users');
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            let users = [];
            for (var property in data) {
                users.push(data[property]);
            }
            resolve(users);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}
