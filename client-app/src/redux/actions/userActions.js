import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER } from '../types';
import axios from 'axios';

export const loginUser = (credentials, history) => dispatch => {
    dispatch({
        type: LOADING_UI
    })

    axios.post('/login', credentials)
    .then(res => {

        setAuthorizationHeader(res.data.jwtToken);
        

        //get user data and send to reducer
        dispatch(getUserData());

        //clear the errors if any
        dispatch({
            type: CLEAR_ERRORS
        })

        //finally redirect to home.
        history.push('/');
    })
    .catch(err =>{
        dispatch({
            type: SET_ERRORS,
            payload: err
        })
    });
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem("FirebaseIdToken");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({
        type: SET_UNAUTHENTICATED
    })
}


export const registerUser = (newUserData, history) => dispatch => {
    dispatch({
        type: LOADING_UI
    })

    axios.post('/register', newUserData)
    .then(res => {

        
        setAuthorizationHeader(res.data.jwtToken);

        //get user data and send to reducer
        dispatch(getUserData());

        //clear the errors if any
        dispatch({
            type: CLEAR_ERRORS
        })

        //finally redirect to home.
        history.push('/');
    })
    .catch(err =>{
        dispatch({
            type: SET_ERRORS,
            payload: err
        })
    });
}


const setAuthorizationHeader = (token) => {
    //save the jwt token in the local storage
    const firebaseIdToken =  `Bearer ${token}`;
    localStorage.setItem('FirebaseIdToken', firebaseIdToken);

    //set token to axios autorization header.
    axios.defaults.headers.common['Authorization'] = firebaseIdToken;
}

export const getUserData = () => dispatch =>{
    dispatch({ type: LOADING_USER })
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => console.error(err));
}

export const uploadProfilePic = (formData) => dispatch => {
    dispatch({
        type: LOADING_USER
    })

    const jwtIdToken = localStorage.getItem("FirebaseIdToken");
    axios.defaults.headers.common['Authorization'] = jwtIdToken;
    

    axios.post('https://asia-east2-socialbeing-4b849.cloudfunctions.net/api/user/image')
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.error(err))

}

export const editUserDetails = (userDetails) => dispatch => {
    dispatch({ type: LOADING_USER })

    axios.post('/user', userDetails)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err=>console.log(err));
        
}