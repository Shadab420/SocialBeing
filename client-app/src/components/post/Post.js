import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//Mui stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

//icons
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

//lib
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//components
import UserIconButton from '../utils/UserIconButton';
import LikeButton from '../utils/LikeButton';
import DeletePost from './DeletePost';
import SinglePostDialog from './SinglePostDialog'; 

//redux
import { connect } from 'react-redux';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
        position: 'relative'
    },

    image: {
        minWidth: 200,
        maxHeight: 300
    },

    content:{
        padding: 25,
        objectFit: 'cover'
    }
}

class Post extends Component{

    render(){
        dayjs.extend(relativeTime); //dayjs 
        const { classes, user, post: { postId, userImageUrl, userHandle, createdAt, body, likeCount, commentCount } } = this.props;

                
            const deleteButton = user.authenticated && user.credentials.handle === userHandle ? (
                                    <DeletePost postId={postId} userHandle={userHandle} />

                                ):null;
        
        return(
            <Card className={classes.card}>
                <CardMedia className={classes.image} image={userImageUrl} title="Profile Image"/>
                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/user/${userHandle}`}
                        color="primary"
                    >
                        {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">{ dayjs(createdAt).fromNow() }</Typography>
                    <Typography variant="body1">{body}</Typography> 

                    <LikeButton postId={postId}/>

                    <span>{likeCount} Likes</span>
                    <UserIconButton tip="Show comments">
                        <CommentIcon color="primary"/>
                    </UserIconButton>
                    <span>{commentCount} Comments</span>

                    { deleteButton }
                    <SinglePostDialog postId={postId} />
                </CardContent>
            </Card>
        )
    }
}

Post.propTypes = {
    classes: PropTypes.object.isRequired,
    user:  PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    
}

const mapStateToProps = (state) => ({
    user: state.user
})



export default connect(mapStateToProps)(withStyles(styles)(Post));