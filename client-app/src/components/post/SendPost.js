import React, { Component } from "react";
import PropTypes from 'prop-types';

//Mui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

//Redux
import { connect } from 'react-redux';
import { sendNewPost, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.otherStyles
})

class SendPost extends Component {

    constructor(){
        super();
        
        this.state = {
            body: '',
            userHandle: '',
            userImageUrl: {},
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

        const newPost = {
            body: this.state.body,
            userHandle: this.props.user.credentials.handle,
            userImageUrl: this.props.user.credentials.imageUrl
        }
        
        this.props.sendNewPost(newPost);
        this.props.clearErrors();
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render(){

        const { classes, UI:{loading} } = this.props;
        const { errors } = this.state;
        
        return (
            
            <Grid item sm={12} xs={12}>
                <form noValidate onSubmit={this.handleSubmit}>

                    <Box
                        boxShadow={5}
                        bgcolor="#FFEB3B"
                        fullwidth="true"
                        m={1}
                        p={1}
                        style={{ height: 'auto' }}
                    >
                        <TextField
                            id="body"
                            name="body"
                            label="Give a Shout!"
                            placeholder="Placeholder"
                            bgcolor="#FFEB3B"
                            multiline
                            fullWidth
                            variant="filled"
                            error={errors.body ? true : false}
                            value={ this.state.body } 
                            onChange={ this.handleChange }
                        />

                        <Button
                            type="submit"
                            className={classes.submitBtn}
                            color="primary"
                            variant="contained"
                        >
                            Post
                        </Button>
                    </Box>
                </form>
            </Grid>
                                
                            
        );
    }
}

SendPost.propTypes = {
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    sendNewPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

export default connect(mapStateToProps, { sendNewPost, clearErrors })(withStyles(styles)(SendPost));