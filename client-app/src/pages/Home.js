import React, { Component, Fragment } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';

//Mui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

//components
import ProgressBar from '../components/utils/ProgressBar';
import Post from '../components/post/Post';
import SendPost from '../components/post/SendPost';
import Profile from './user/Profile';

//Redux
import { connect } from 'react-redux';
import { getAllPosts } from '../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.otherStyles,
    app: {
        backgroundColor: '#E75426'
    }
})


class Home extends Component{


    componentDidMount(){

        this.props.getAllPosts();     

        
    }

    // handleSubmit = (event) => {

    // }

    render(){
        const { posts, loading } = this.props.data;
        const { classes, user } = this.props;

        let showAllPostHTML = !loading ? 
                                posts.map(post => 
                                    <Post key={post.postId} post={post}/>
                                ) 
                                : <ProgressBar/>;

        let leftMarkup = user.authenticated? (
                            <Grid item sm={4} xs={12}>
                                
                                <Grid item sm={12} xs={12}>
                                    
                                    <Profile />
                                </Grid>
                            </Grid>
                        ): (<div></div>)
                        

        return (
            
            <Fragment className={classes.app.backgroundColor}>
                <Grid container spacing={5} >
                    
                    {leftMarkup}
                        
                    <Grid item sm={user.authenticated? 8 : 12} xs={12}>
                        {user.authenticated? (<SendPost />):null}
                        { showAllPostHTML }
                    </Grid>
                    
                </Grid>
            </Fragment>      
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    getAllPosts: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
})

const mapActionToProps = {
    getAllPosts
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Home));