import { SET_POST, SET_POSTS, CREATE_POST, SET_ERRORS, LOADING_POSTS, LOADING_UI, STOP_LOADING_UI, LIKE_POST, UNLIKE_POST, DELETE_POST, CLEAR_ERRORS } from '../types';
import axios from 'axios';

//get all posts
export const getAllPosts = () => dispatch => {
    dispatch({ type: LOADING_POSTS });

    axios.get('/posts')
             .then(res => {
                dispatch({
                    type: SET_POSTS,
                    payload: res.data
                })
                
             })
             .catch(err => {
                 dispatch({
                     type: SET_POSTS,
                     payload: []
                 })
             })
}

//get a single post
export const getPost = (postId) => dispatch => {
    dispatch({ type: LOADING_UI });

    axios.get(`https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/post/${postId}`)
        .then(res => {
            dispatch({ 
                type: SET_POST,
                payload: res.data
            });

            dispatch({ type: STOP_LOADING_UI });

        })
        .catch(err=> console.log(err));
}

//like post
export const likePost = (postId) => dispatch => {
    const jwtIdToken = localStorage.getItem("FirebaseIdToken");
    axios.defaults.headers.common["Authorization"] = jwtIdToken;
    
    axios.get(`https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/post/${postId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            })
        })
        .catch(err=> console.log(err));

}


//unlike post
export const unlikePost = (postId) => dispatch => {
    const jwtIdToken = localStorage.getItem("FirebaseIdToken");
    axios.defaults.headers.common["Authorization"] = jwtIdToken;

    axios.get(`https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/post/${postId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            })
        })
        .catch(err=> console.log(err));

}

export const sendNewPost = (newPost) => dispatch => {

    const userToken = localStorage.getItem("FirebaseIdToken");
    axios.defaults.headers.common['Authorization'] = userToken;

    axios.post('https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/post', newPost)
        .then(res => {
            dispatch({
                type: CREATE_POST,
                payload: res.data
            })
            dispatch(getAllPosts());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err
            })
        })
}

export const deletePost = (postId) => dispatch => {

    axios.delete(`https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/post/${postId}`)
        .then(()=>{
            dispatch({
                type: DELETE_POST,
                payload: postId
            });
        })
        .catch(err => console.log(err));
}

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
}