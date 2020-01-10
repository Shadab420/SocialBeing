import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Mui stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

//icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';

//Redux
import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

//components
import UserIconButton from '../utils/UserIconButton';


const styles = theme => ({
    

    deleteBtn: {
        position: 'absolute',
        top: '10%',
        left: '90%',

    }
})

class DeletePost extends Component {

    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    deletePost = () => {
        this.props.deletePost(this.props.postId);
        this.setState({
            open: false
        })
    }


    render() {

        const { classes, postId} = this.props;

        return (
            <Fragment>
                <UserIconButton tip="Delete Post" onClick={this.handleOpen} btnClassName={classes.deleteBtn}>
                    <DeleteOutline color="primary"/>
                </UserIconButton>

                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">

                    <DialogTitle>Are you sure to delete the post?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deletePost} color="secondary">Delete</Button>
                    </DialogActions>

                </Dialog>
            </Fragment>
        )
    }
}

DeletePost.propTypes = {
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    deletePost: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { deletePost })(withStyles(styles)(DeletePost));
