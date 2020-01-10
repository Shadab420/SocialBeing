//validations
const isEmpty = (value) => {
    if(value.trim() === '') return true;
    return false;
}

const isValidEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(email.match(emailRegEx)) return true;
    return false;
}

 //validate registration data
exports.validateRegisterData = (newUser) => {

    let errors = {};

    if(isEmpty(newUser.email)){
        errors.email = 'Email must not be empty!'
    }
    else if(!isValidEmail(newUser.email)){
        errors.email = 'Please provide a valid email!'
    }

    if(isEmpty(newUser.password)){
        errors.password = "Password must not be empty!";
    }

    if(newUser.password !== newUser.confirmPassword){
        errors.confirmPassword = "Passwords didn\'t match!";
    }
    if(isEmpty(newUser.handle)){
        errors.handle = 'Handle must not be empty!'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

//validate login data

exports.validateLoginData = (credentials) => {

    let errors = {};

    if(isEmpty(credentials.email)){
        errors.email = 'Email must not be empty!'
    }
    else if(!isValidEmail(credentials.email)){
        errors.email = 'Please provide a valid email!'
    }

    if(isEmpty(credentials.password)){
        errors.password = "Password must not be empty!";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}


//validate user details
exports.validateUserDetails = (data) => {

    let userDetails = {};

    if(data.bio.trim() !== '') userDetails.bio = data.bio;
    if(data.website.trim() !== ''){
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        }
        else userDetails.website = data.website.trim();
    }

    if(data.location.trim() !== '') userDetails.location = data.location.trim();

    return userDetails;

}