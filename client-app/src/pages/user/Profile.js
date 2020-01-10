import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

//Mui
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import ProgressBar from '../../components/utils/ProgressBar';
import MuiLink from '@material-ui/core/Link';

//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

//redux
import { connect } from 'react-redux';
import { logoutUser, uploadProfilePic } from '../../redux/actions/userActions';

//component
import EditDetails from '../../components/user/EditDetails';
import UserIconButton from '../../components/utils/UserIconButton';



const styles = (theme) => ({
    ...theme.otherStyles,

    profilePic: {
        height: '150px',
        width: '150px',
        borderRadius: '50% 50%',
        margin: '0 0 0 25%',
    }

})


class Profile extends Component{


    handleProfilePicSelection = () => {
        const fileInput = document.getElementById('uploadProPic');
        fileInput.click();
    }

    handlePropicUpload = (event) => {
        event.preventDefault();
        
        const newProfilePic = event.target.files[0];

        const formData = new FormData();
        formData.append('image', newProfilePic, newProfilePic.name);

        this.props.uploadProfilePic(formData);

    }

    handleLogout = () => {
        this.props.logoutUser();
    }

    render(){

        const { classes, user, loading }  = this.props

        let profileMarkup = !loading? (
                                user.authenticated? (
                                    <Box
                                        boxShadow={5}
                                        bgcolor="#FFEB3B"
                                        fullwidth="true"
                                        m={1}
                                        p={1}
                                        style={{ height: 'auto' }}
                                    >
                                        <img src={ user.credentials.imageUrl } className={classes.profilePic} alt="user image" />
                                        <input 
                                            type="file" 
                                            id="uploadProPic" 
                                            hidden = "hidden"
                                            onChange={this.handlePropicUpload} />

                                        <Tooltip title="Change profile picture" placement="top-start">
                                            <IconButton onClick={this.handleProfilePicSelection}>
                                                <EditIcon color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <hr/>
                                        
                                        <MuiLink component={Link} to={`/users/${user.credentials.handle}`} color="primary" variand="h5">
                                            @{user.credentials.handle}
                                        </MuiLink>
                                        <hr/>

                                        {user.credentials.bio && (
                                            <Fragment>
                                                <Typography variant="body2">{user.credentials.bio}</Typography> 
                                                <hr/> 
                                            </Fragment>
                                        )}
                                        

                                        { user.credentials.location && (
                                            <Fragment>
                                                <LocationOn color="primary" /> <span>{ user.credentials.location }</span>
                                                <hr />
                                            </Fragment>
                                        )}

                                        { user.credentials.website && (
                                            <Fragment>
                                                <LinkIcon color="primary" /> 
                                                <a href={user.credentials.website} target="_blank" rel="noopener noreferrer">
                                                    {' '} {user.credentials.website}
                                                </a>
                                                <hr />
                                            </Fragment>
                                        )}

                                        <CalendarToday color="primary"/>
                                        <span>
                                            Joined: { dayjs(user.credentials.createdAt).format('MMMM YYYY')}
                                            <hr/>
                                        </span>
                                        

                                        <EditDetails />


                                        <UserIconButton tip="Logout" onClick={this.handleLogout}>
                                                <KeyboardReturn color="primary"/>
                                        </UserIconButton>
                                    </Box>
                                )
                                : (
                                    // <Box
                                    //     boxShadow={3}
                                    //     bgcolor="#eee"
                                    //     fullwidth="true"
                                    //     m={1}
                                    //     p={1}
                                    //     style={{ height: 'auto' }}
                                    // >
                                    //     <Typography variant="body2" align="center">Login to see your profile!</Typography>
                                    //     <div>
                                    //         <Button className={classes.submitBtn} variant="contained" color="primary" component={Link} to="/login">Login</Button>
                                    //         <Button className={classes.submitBtn} variant="contained" color="secondary" component={Link} to="/register">Register</Button>
                                    //     </div>
                                    // </Box>
                                    <div></div>
                                )
                            ) 
                            
                            : <ProgressBar />;
        
        return profileMarkup
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadProfilePic: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionToProps = {
    logoutUser,
    uploadProfilePic
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Profile));