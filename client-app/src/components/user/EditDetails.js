import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

//mui staff
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

//Icons
import EditIcon from '@material-ui/icons/Edit';

//redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

//conponents
import UserIconButton from "../utils/UserIconButton";

const styles = (theme) => ({
    ...theme.otherStyles
})


class EditDetails extends Component{
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    }

    //lifecycle methods
    componentDidMount(){
        const { user } = this.props;
        this.mapDetailsToState(user.credentials);
    }


    //helper functions

    mapDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        })
    }

    //handler functions

    handleOpen = () => {
        this.setState({
            open: true,
        })

        this.mapDetailsToState(this.props.user.credentials);
    }

    handleClose = () => {
        this.setState({
            open: false,
        })
    }

    handleChange = (event) => {
        event.preventDefault();
        
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        }

        this.props.editUserDetails(userDetails);
        this.handleClose();
        
    }

    render(){

        const { classes } = this.props;

        return (
            <Fragment>

                <UserIconButton tip="Edit details" onClick={this.handleOpen}>
                    <EditIcon color="primary" />
                </UserIconButton>

                <Dialog 
                    open = {this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth= "sm"
                >
                    <DialogTitle>Edit your details</DialogTitle>

                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth/>

                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth/>

                            <TextField
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Your Location"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth/>
                        </form>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired,

}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionToProps = {
    editUserDetails
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(EditDetails));