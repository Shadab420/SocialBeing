import { SET_POST, SET_POSTS, CREATE_POST, SET_ERRORS, LOADING_POSTS, LIKE_POST, UNLIKE_POST, DELETE_POST } from '../types';

const initialState = {
  posts: [],
  post: {},
  loading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case CREATE_POST:
            return{
                ...state,
            }

        case LOADING_POSTS:
            return {
                ...state,
                loading: true
            }
        
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }

        case SET_POST:
            return {
                ...state,
                post: action.payload,
                loading: false
            }
        
        case LIKE_POST:
        case UNLIKE_POST:

            let index = state.posts.findIndex((post) => post.postId === action.payload);
            state.posts[index] = action.payload;

            return {
                ...state,
            }
        
        case DELETE_POST:
            
            let ind = state.posts.findIndex(post => post.postId === action.payload);
            state.posts.splice(ind,1);
            
            return {
                ...state,
            }
        
        
        
        default:
            return state;
    }
}