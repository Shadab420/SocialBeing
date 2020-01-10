const firebase = require('firebase');

const { admin, db } = require('../utils/admin');
const firebaseConfig = require('../utils/firebase-config');

firebase.initializeApp(firebaseConfig);

//validation
const { validateRegisterData, validateLoginData, validateUserDetails } = require('../utils/validator');

//Register user

exports.register = (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    //jwt access token
    let userToken, userId;

     //validate data
    const {errors,valid} = validateRegisterData(newUser);

    const userImgName = "blank-propic.png";

    if(!valid){
        return res.status(400).json(errors);
    }

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handleTakenError: `${doc.id} already taken!`})
        }
        else{
            //create user
            firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(data => {
                //if user created generate jwt access token for authentication
                userId = data.user.uid;
                return data.user.getIdToken();
            })
            .then(jwtToken =>{
                //if jwt access token generated then set the token for this user.
                userToken = jwtToken;
                const userCredentials = {
                    userId,
                    handle: newUser.handle,
                    email: newUser.email,
                    password: newUser.password,
                    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${userImgName}?alt=media`,
                    createdAt: new Date().toISOString()
                }

                return db.doc(`/users/${newUser.handle}`).set(userCredentials);
                    

            })
            .then(()=>{
                return res.status(201).json({userToken});
            })
            .catch(err => {
                console.error(err);
                if(err.code === 'auth/email-already-in-use'){
                    return res.status(400).json({ emailExistError: 'Email already exists!'})
                }
                else{
                    return res.status(500).json({error: err.code});
                }
            })

        }
    })
}


//login user

exports.login = (req,res) => {

    const credentials = {
        email: req.body.email,
        password: req.body.password
    }

    //validate data

    const { errors, valid } = validateLoginData(credentials);

    if(!valid){
        return res.status(400).json(errors);
    } 

    firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(jwtToken => {
            return res.json({jwtToken});
        })
        .catch(err =>{
            console.error(err);
            if(err.code === 'auth/wrong-password') return res.status(403).json({generalError: 'Wrong Credentials!'});
            return res.status(500).json(err.code);
        })

}


//get the authenticated user
exports.getAuthenticatedUser = (req,res) => {
    let userData = {};

    db.doc(`/users/${req.user.handle}`)
        .get()
        .then(doc => {
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes')
                        .where('userHandle', '==', req.user.handle)
                        .get()
            }
        })
        .then(data => {
                            
            userData.likes = [];

            data.forEach(doc => {
                userData.likes.push(doc.data());
            });

            return db.collection('notifications')
                     .where('recipient', '==', req.user.handle)
                     .orderBy('createdAt', 'desc')
                     .get();
        })
        .then(data => {
            userData.notifications = [];

            data.forEach(doc => {
                userData.notifications.push({
                    notificationId: doc.id,
                    ...doc.data()
                });
            });

            return res.json(userData);
        })
        .catch(err => {
            return res.status(500).json( { error: err.code });
        })
    
    
}


//upload profile images

exports.uploadImage = (req,res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    //instance of busboy
    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname,file,filename, encoding, mimetype)=>{

        if(mimetype !== 'image/jpg' || mimetype !== 'image/png' || mimeType !== 'image/gif'){
            return res.status(400).json({ error: 'Please upload an image file!'});
        }

        //my.img.png
        const imageExtension = filename.split('.')[filename.split('.').length-1];
        //787498579.png
        imageFileName = `${Math.round(Math.random()*1000000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                contentType: imageToBeUploaded.mimetype
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc( `/users/${req.user.handle}`).update( { imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully!'});
        })
        .catch(err=>{
            return res.status(500).json({ error: err.code });
        });
    });

    busboy.end(req.rawBody);
}


//Add user details

exports.addUserDetails = (req,res) => {
    let userDetails = validateUserDetails(req.body);

    db.doc( `/users/${req.user.handle}`).update(userDetails)
        .then(()=>{
            return res.status(201).json({ message: "User information added successfully!" });
        })
        .catch(err => {
            return res.status(500).json( { error: err.code });
        })
}


//get any users detail information
exports.getUserDetails = (req,res) => {

    let userData = {};

    db.doc(`users/${req.params.handle}`)
      .get()
      .then(userDoc => {
            if(userDoc.exists){
                userData.user = userDoc.data();
                return db.collection('posts')
                         .where('userHandle', '==', req.params.handle)
                         .orderBy('createdAt', 'desc')
                         .get();
            }
            else{
                res.json(404).json({ error: 'User does not exist!' });
            }
      })
      .then((data) => {

        userData.posts = [];
        data.forEach(post => {
            userData.posts.push({
                postId: post.id,
                ...post.data()
            });
        });

        return res.json(userData);
      })
      .catch(err => {
          return res.status(500).json({ error: err.code });
      });
}


//mark if a notification has been read.
exports.markNotificationAsRead = (req,res) => {
    let batch = db.batch();

    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);

        batch.update(notification, { read: true });
    })

    batch.commit()
         .then(() => {
             return res.json({ message: 'Notifications marked read!' });
         })
         .catch(err => {
             return res.staus(500).json({ error: err.code });
         })
}