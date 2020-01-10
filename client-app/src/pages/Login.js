import React, { Component } from "react";
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

//lib
import axios from 'axios';

//Mui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.otherStyles
})


class Login extends Component{
    constructor(){
        super();
        
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const credentials = {
            email: this.state.email,
            password: this.state.password
        }
        
        this.props.loginUser(credentials, this.props.history);

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render(){

        const { classes, UI: {loading} } = this.props;
        const { errors } = this.state;

        return (
            <Grid container className={classes.form} >
                <Grid item sm />
                <Grid item sm>
                    <img src={AppIcon} alt="social being icon" className={classes.appIcon}/>
                    <Typography variant="h2" className={classes.pageTitle}>Login</Typography>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email"
                            fullWidth
                            error = {errors.email?true:false}
                            helperText={errors.email}
                            className={ classes.textField }
                            value={ this.state.email } onChange={ this.handleChange }/>

                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password"
                            error = {errors.password?true:false}
                            helperText={errors.password}
                            fullWidth
                            className={ classes.textField }
                            value={ this.state.password } onChange={ this.handleChange }/>
                        
                        { errors.generalError && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.generalError}
                            </Typography>
                        )}


                        <Button
                            type="submit"
                            className={ classes.submitBtn }
                            color="primary"
                            variant="contained"
                            fullWidth
                            
                        >
                            Login
                        </Button>

                        <small>Don't have an accout? Register <Link to="/register">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));