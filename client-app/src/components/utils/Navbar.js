import React, { Component } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//MUI Stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

//Icons
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';

//redux
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userActions';

//components
import UserIconButton from './UserIconButton';

class Navbar extends Component{

    handleLogout = () => {
        this.props.logoutUser();
    }

    render(){
        const { authenticated } = this.props;
        return (
            <AppBar position="fixed">
                <Toolbar className="nav-container">
                    <Link to="/">
                        <UserIconButton tip="Home">
                            <HomeIcon color="secondary"/>
                        </UserIconButton>
                    </Link>
                    { 
                        authenticated? (

                            <div>
                                <UserIconButton tip="Notifications">
                                    <Notifications color="secondary"/>
                                </UserIconButton>

                                <UserIconButton tip="Logout" onClick={this.handleLogout}>
                                    <LogoutIcon color="secondary"/>
                                </UserIconButton>

                            </div>

                            
                        )
                        : (
                            <div>
                                <Button color="inherit" component={Link} to="/login">Login</Button>
                                <Button color="inherit" component={Link} to="/register">Register</Button>
                            </div>
                        )
                    }
                    
                    
                    
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired, 
    authenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})


export default connect(mapStateToProps, { logoutUser })(Navbar);