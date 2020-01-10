import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//components
import Navbar from './components/utils/Navbar';
import User from './pages/user/Profile';
import AuthRoute from './components/user/AuthRoute';

//pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/user/Profile';

//lib
import axios from 'axios';
import jwtDecode from 'jwt-decode';

//theme styles
import styles from './theme/Theme';

//redux
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
import { Provider } from 'react-redux';
import store from './redux/store';



const myTheme = createMuiTheme(styles);

//get the token when application starts
const userToken = localStorage.getItem('FirebaseIdToken');

if(userToken){
   //decode the token
   const decodedUserToken = jwtDecode(userToken);

  //if token is expired redirect to login page.
   if(decodedUserToken.exp * 1000 < Date.now()){
     store.dispatch(logoutUser());
     //window.location.href = '/login';
   }
   else{
     store.dispatch({type: SET_AUTHENTICATED});
     axios.defaults.headers.common["Authorization"] = userToken;
     store.dispatch(getUserData());
   }

 }
 else{
   store.dispatch(logoutUser());
   //window.location.href = '/login';
 }

class App extends Component {
  render(){
    const { classes } = this.props;
    
    return (
      <MuiThemeProvider theme={myTheme}>
        <Provider store={store}>
              <div className="App">
      
                <Router>
                    <Navbar/>

                    <div className="container">
                      <Switch>
                        <Route exact path="/" component={Home} />
                        <AuthRoute exact path="/login" component={Login} /> */}
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/user/{handle}" component={User} />
                        
                      </Switch>
                    </div>
                </Router>
                
              </div>
          </Provider>
      </MuiThemeProvider>
    );
  }
}



export default withStyles(styles)(App);
