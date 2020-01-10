import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Mui stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

//icons
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import CloseIcon from '@material-ui/icons/Close';

//lib
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//redux
import { connect } from 'react-redux';
import { likePost, unlikePost, getPost } from '../../redux/actions/dataActions';

//components
import UserIconButton from '../utils/UserIconButton';
import DeletePost from './DeletePost';
import LikeButton from '../utils/LikeButton';

const styles = (theme) => ({
    ...theme.otherStyles,

    spinner: {
        textAlign: 'center',
        marginTop: '50',
        marginBotton: '50'
    },

    seperator: {
        border: 'none',
        margin: 4
    },

    closeButton: {
        position: 'absolute',
        top: '10%',
        left: '90%',
    },

    expandButton: {
        position: 'absolute',
        left: '90%',
    },

    dialogContent: {
        padding: '10%',
        backgroundColor: '#fff191'
    }
})

class SinglePostDialog extends Component{

    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true });

        this.props.getPost(this.props.postId);
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    render(){

        const { classes, post:{ 
                            postId, 
                            body, 
                            createdAt, 
                            likeCount, 
                            commentCount,
                            userHandle, 
                            userImageUrl }, 
                        UI: {loading}} = this.props;
        
        const dialogMarkup = loading ? (
            
                <div className={classes.spinner}>
                    <CircularProgress size={200} thickness={2} />
                </div>
            
        ) : (
            <Grid container spacing={16} >
                <Grid item sm={5}>
                    <img src={userImageUrl} alt="profile" className={classes.profilePic} />
                </Grid>
                <Grid item sm={7}>
                    <Typography 
                        component={Link} 
                        color="primary" 
                        variant="h5" 
                        to={`/users/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>

                    <hr className={classes.seperator} />

                    <Typography 
                        variant="body2"
                        color="secondary" 
                    >
                       { dayjs(createdAt).format('h:mm a, MMMM DD YYYY') }
                    </Typography>

                    <hr className={classes.seperator} />

                    <Typography 
                        variant="body1"
                        color="secondary" 
                    >
                       { body }
                    </Typography>
                </Grid>
            </Grid>
        )


        return(
            <Fragment>
                <UserIconButton tip="Expand post" onClick={this.handleOpen} btnClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </UserIconButton>

                <Dialog
                    open = {this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth= "sm"
                >
                    <UserIconButton tip="Close" onClick={this.handleClose} btnClassName={classes.closeButton}>
                        <CloseIcon />
                    </UserIconButton>

                    <DialogContent className={classes.dialogContent}>
                            {dialogMarkup}
                    </DialogContent>
                    <DialogActions>
                        <LikeButton postId={postId} />
                        <span>{likeCount} Likes</span>
                        <UserIconButton tip="Show comments">
                            <CommentIcon color="primary"/>
                        </UserIconButton>
                        <span>{commentCount} Comments</span>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

SinglePostDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    user:  PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post:  PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    post: state.data.post,
    UI: state.UI
})

const mapActionToProps = { getPost, likePost, unlikePost };

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(SinglePostDialog));