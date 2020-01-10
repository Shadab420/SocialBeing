const { db } = require('../utils/admin');


//get all posts
exports.getAllPosts = (req,res) => {
    //db.collection("posts").get()
    db.collection("posts")
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let posts=[];
            //loop through the data and store them in posts array.
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    ...doc.data()
                });
            })
            return res.json(posts);
        })
        .catch(err => console.error(err))
}


//get a post by id
exports.getPost = (req,res) => {
    let postData = {};

    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then(doc => {
            if(doc.exists){
                postData = doc.data();
                postData.postId = doc.id;

                

                db.collection("comments")
                    .where('postId', '==', postData.postId)
                    .orderBy('createdAt', 'desc')
                    .get()
                    .then(comments => {

                        postData.comments = [];

                        comments.forEach(comment => {
                            postData.comments.push(comment.data());
                        })

                        return res.json(postData);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err.code });
                    });

                
            }
            else{
                return res.status(404).json({ error: "Post not found or deleted by author!"});
            }
        })
        .catch(err => {
            res.status(400).json({ error: err.code });
        });
}



//add comment on a post
exports.addComment = (req,res) => {

    if(req.body.commentbody.trim() === ''){
       return res.status(400).json({comment: "Comment can not be blank!"});
    }

    let newComment = {
        userHandle: req.user.handle,
        postId: req.params.postId,
        body: req.body.commentbody,
        userImageUrl: req.user.imageUrl,
        createdAt: new Date().toISOString()
    }

    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if(doc.exists){
                db.collection("comments").add(newComment)
                    .then(() => {
                        return doc.ref.update({commentCount: doc.data().commentCount + 1});
                    })
                    .then(() => {
                        return res.status(201).json({message: "Comment Added!", newComment});
                    })
                    .catch(err => {
                        return res.status(500).json({error: err.code});
                    })
            }
            else {
                return res.status(404).json({ error: "Post doesn't exist or deleted by author!"});
            }
        })
        .catch(err => {
            return res.status(500).json({error: err.code});
        })
}


//add a like to a post
exports.likePost = (req,res) => {

    let newLike = {
        userHandle: req.user.handle,
        postId: req.params.postId,
        userImageUrl: req.user.imageUrl,
        createdAt: new Date().toISOString()
    }

    //for checking if user already liked the post
    const likeDocument = db.collection('likes')
                            .where('userHandle', '==', newLike.userHandle)
                            .where('postId', '==', newLike.postId)
                            .limit(1);
    
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    //check if the post exists
    postDocument.get()
        .then(postDoc => {
            if(postDoc.exists){
                postData = postDoc.data();
                postData.postId = postDoc.id;
                return likeDocument.get();
            }
            else {
                return res.status(404).json({ error: "Post doesn't exist or deleted by author!"});
            }
        })
        .then(likeDoc => {
            //empty if user didn't liked.
            if(likeDoc.empty){
                db.collection('likes')
                    .add(newLike)
                    .then(()=>{
                        postData.likeCount++;
                        return postDocument.update({likeCount: postData.likeCount});
                    })
                    .then(() => {
                        return res.json(postData);
                    })
                    .catch(err => {
                        return res.status(500).json({error: err.code});
                    });
            }
            else{
                return res.status(400).json({ message: 'Already liked!'});
            } 
        })
        .catch(err => {
            return res.status(500).json({error: err.code});
        })
}


//unlike a post
exports.unlikePost = (req,res) => {

    //for checking if user already liked the post
    const likeDocument = db.collection('likes')
                            .where('userHandle', '==', req.user.handle)
                            .where('postId', '==', req.params.postId)
                            .limit(1);
    
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    //check if the post exists
    postDocument.get()
        .then(postDoc => {
            if(postDoc.exists){
                postData = postDoc.data();
                postData.postId = postDoc.id;
                return likeDocument.get();
            }
            else {
                return res.status(404).json({ error: "Post doesn't exist or deleted by author!"});
            }
        })
        .then(likeDoc => {
            //empty if user didn't liked.
            if(likeDoc.empty){
                return res.status(400).json({ message: 'Post not liked!'});
            }
            else{
               
                db.doc(`/likes/${likeDoc.docs[0].id}`).delete()
                    .then(()=>{
                        postData.likeCount--;
                        return postDocument.update({likeCount: postData.likeCount});
                    })
                    .then(() => {
                        return res.json(postData);
                    })
                    .catch(err => {
                        return res.status(500).json({error: err.code});
                    });
            } 
        })
        .catch(err => {
            return res.status(500).json({error: err.code});
        })
}

/***********/
/** CRUD **/
/***********/

//create a new post
exports.createPost = (req,res) => {

    if(req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body must not be empty!'})
    }

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImageUrl: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString()
    };

    db.collection("posts")
    .add(newPost)
    .then(doc =>{

        const postData = newPost;
        postData.postId = doc.id;
        return res.json({message: "Post created successfully!",  postData});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong!"});
    });
        
}


//delete a post
exports.deletePost = (req,res) => {
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    postDocument.get()
        .then((postDoc)=>{
            if(postDoc.exists){
                if(postDoc.data().userHandle === req.user.handle){
                    postDocument.delete()
                        .then(() => {
                            return res.status(201).json({ message: 'Post Deleted!'});
                        })
                }
                else{
                    return res.status(403).json({ message: 'You are not allowed to delete this post!'});
                }
            }
            else{
                return res.status(404).json({ message: 'Post does not exist!'});
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.code});
        })
}