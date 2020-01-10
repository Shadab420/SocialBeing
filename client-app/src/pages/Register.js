import React, { Component } from "react";
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';

//lib
import axios from 'axios';

//Mui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
    ...theme.otherStyles
})


class Register extends Component{
    constructor(){
        super();
        
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle:'',
            loading: false,
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

    
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        
        this.props.registerUser(newUserData,this.props.history);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render(){

        const { classes, loading} = this.props;
        const { errors } = this.state;

        return (
            <Grid container className={classes.form} >
                <Grid item sm />
                <Grid item sm>
                    <img src={AppIcon} alt="social being icon" className={classes.appIcon}/>
                    <Typography variant="h2" className={classes.pageTitle}>Register</Typography>

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
                        
                        <TextField 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            label="Confirm Password"
                            error = {errors.password?true:false}
                            helperText={errors.password}
                            fullWidth
                            className={ classes.textField }
                            value={ this.state.confirmPassword } onChange={ this.handleChange }/>
                        
                        <TextField 
                            id="handle" 
                            name="handle" 
                            type="text" 
                            label="User Handle"
                            error = {errors.handle?true:false}
                            helperText={errors.handle}
                            fullWidth
                            className={ classes.textField }
                            value={ this.state.handle } onChange={ this.handleChange }/>
                        
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
                            Register
                        </Button>

                        <small>Already have an accout? Login <Link to="/login">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm />
            </Grid>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionToProps = {
    registerUser
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Register));