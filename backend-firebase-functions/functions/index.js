const functions = require('firebase-functions');

const { register, login, getAuthenticatedUser, addUserDetails, getUserDetails, uploadImage, markNotificationAsRead } = require('./routes/users');
const { getAllPosts, getPost, addComment, likePost, unlikePost, createPost, deletePost } = require('./routes/posts');
const FBAuth = require('./middlewares/FireBaseAuth');
const { db } = require('./utils/admin');

//express js
const express = require('express');
const app = express();

//cors
var cors = require('cors');

//enables cors
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));


/*************/
/*AUTH Routes*/
/*************/

//register

app.post('/register', register);

//Login

app.post('/login', login);

//get the logged in user
app.get('/user', FBAuth, getAuthenticatedUser);


//add user details
app.post('/user', FBAuth, addUserDetails);


//get any users detail information.
app.get('/user/:handle', FBAuth, getUserDetails);


//image upload
app.post('/user/image', FBAuth, uploadImage);


//mark notifications as read.
app.post('/notifications', FBAuth, markNotificationAsRead);


/*************/
/*POST Routes*/
/*************/

//get all the available posts
app.get('/posts', getAllPosts);

//get a post by id
app.get('/post/:postId', getPost);

//like a post
app.get('/post/:postId/like', FBAuth, likePost);

//unlike a post
app.get('/post/:postId/unlike', FBAuth, unlikePost);

//comment on a post
app.post('/post/:postId/comment', FBAuth, addComment);

//create a new post
app.post('/post', FBAuth, createPost);

//delete a post
app.delete('/post/:postId', FBAuth, deletePost);

//update a post


exports.api = functions.region('asia-east2').https.onRequest(app);


//Notifications firebase trigger functions

//Notification when after post is liked.
exports.createNotificationOnLike = functions.region('asia-east2').firestore.document('likes/{id}')
        .onCreate((likeDoc) => {
            return db.doc(`/posts/${likeDoc.data().postId}`).get()
                .then(postDoc => {
                    if(postDoc.exists && postDoc.data().userHandle !== likeDoc.data().userHandle){
                        return db.doc(`/notifications/${likeDoc.id}`)
                                    .set({
                                        createdAt: likeDoc.data().createdAt,
                                        recipient: postDoc.data().userHandle,
                                        sender: likeDoc.data().userHandle,
                                        type: 'like',
                                        postId: likeDoc.data().postId,
                                        read: false
                                    });
                    }
                })
                
                .catch(err => {
                    console.error(err);
                })
        })



//Delete notification of like if the user unlike
exports.deleteNotificationOnUnlike = functions.region('asia-east2').firestore.document('likes/{id}')
        .onDelete(likeDoc => {
            return db.doc(`/notifications/${likeDoc.id}`).delete()
                .catch(err => {
                    console.log({ error: err.code });
                })
        })


//Nofication when a comment has been posted.
exports.createNotificationOnComment = functions.region('asia-east2').firestore.document('comments/{id}')
        .onCreate((commentDoc) => {
            return db.doc(`/posts/${commentDoc.data().postId}`).get()
                    .then(postDoc => {
                        if(postDoc.exists && postDoc.data().userHandle !== commentDoc.data().userHandle){
                            return db.doc(`/notifications/${commentDoc.id}`)
                                        .set({
                                            createdAt: commentDoc.data().createdAt,
                                            recipient: postDoc.data().userHandle,
                                            sender: commentDoc.data().userHandle,
                                            type: 'comment',
                                            postId: commentDoc.data().postId,
                                            read: false
                                        });
                        }
                    })
                
                    .catch(err => {
                        console.error(err);
                    })
        })


//trigger when an user updated his profile picture.
exports.onUserImageChange = functions.region('asia-east2').firestore.document('users/{id}')
        .onUpdate(change => {

            //if imageUrl change then only we update the images of user posts.
            if(change.before.data().imageUrl !== change.after.data().imageUrl){
                
                let batch = db.batch();

                return db.collection('posts').where('userHandle', '==', change.before.data().handle).get()
                        .then(userPosts => {
                            userPosts.forEach(doc => {
                                const post = db.doc(`posts/${doc.id}`);
                                batch.update(post, { userImageUrl: change.after.data().imageUrl });
                            })

                            return batch.commit();
                        })
            }
            
        })


//delete all notifications, likes and comments of a post if it has been deleted.
exports.onPostDeleted = functions.region('asia-east2').firestore.document('/posts/{postId}')
        .onDelete((postDoc,context) =>{
            const postId = context.params.postId;

            const batch = db.batch();

            return db.collection('comments').where('postId', '==', postId).get()
                    .then(data => {
                        data.forEach(doc => {
                            batch.delete(db.doc(`/comments/${doc.id}`));
                        })

                        return db.collection('likes').where('postId', '==', postId).get();
                                
                    })
                    .then(data => {
                        data.forEach(doc => {

                            batch.delete(db.doc(`likes/${doc.id}`));
                        })

                        return db.collection('notifications').where('postId', '==', postId).get();
                    })
                    .then(data => {
                        data.forEach(doc => {
                            batch.delete(db.doc(`notifications/${doc.id}`));
                        })

                        return batch.commit();
                    })
                    .catch(err => console.error(err));
        })