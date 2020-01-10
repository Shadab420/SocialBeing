import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

//redux
import { connect } from 'react-redux';
import store from '../../redux/store';
import { getUserData } from '../../redux/actions/userActions';


const AuthRoute = ({ component: Component, ...rest}) => (

    
     

    <Route
        { ...rest}
        render= { (props) => props.authenticated === true? <Redirect to="/"/> : <Component {...props} />}
    />
    
);

AuthRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});


export default connect(mapStateToProps, { getUserData })(AuthRoute);