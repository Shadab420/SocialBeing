import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Mui stuff
import withStyles from '@material-ui/core/styles/withStyles';

//icons
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

//redux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';

//components
import UserIconButton from '../utils/UserIconButton';

const styles = theme => ({
    ...theme.otherStyles
})

class LikeButton extends Component {

    likedPost = () => {
        if((this.props.user.likes && this.props.user.likes.find(like => like.postId === this.props.postId))){
            return true;
        }
        return false;
    }

    likePost = () => {
        this.props.likePost(this.props.postId);
    }

    unlikePost = () => {
        this.props.unlikePost(this.props.postId);
    }

    render(){

        const { user } = this.props;

        return (
            !user.authenticated ? (
                <UserIconButton tip="Like post">
                    <Link to="/login">
                        <FavoriteBorderIcon color="primary" />
                    </Link>
                </UserIconButton>
            )
            :(
                this.likedPost() ? (
                    <UserIconButton tip="Undo like" onClick={this.unlikePost}>
                         <FavoriteIcon color="primary" />           
                    </UserIconButton>
                )
                :(
                    <UserIconButton tip="Like post" onClick={this.likePost}>
                         <FavoriteBorderIcon color="primary" />           
                    </UserIconButton>
                )
            )
            
        )
    }
}

LikeButton.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionToProps = { likePost, unlikePost };

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(LikeButton));