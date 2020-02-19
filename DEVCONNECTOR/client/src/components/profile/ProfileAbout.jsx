import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name }
    }
}) => (
        <div className='profile-about bg-light p-2'>
            {bio && (
                <Fragment>
                    {/* https://www.w3schools.com/jsref/jsref_trim_string.asp
                    Trim removes white space from before and after the string
                    so " Hello World " Will look like after trimming is: "Hello World"
                    Notice the white space before and after the string has been removed
                    Then split will trun the string into an array, and here we are saying that turn 
                    or break based on white space. Because most name will write down their name like
                    "Brad Traversy" with Brad being the first name. Then take the first element which will be
                    the first name */}
                    <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
                    <p>{bio}</p>
                    <div className='line' />
                </Fragment>
            )}
            <h2 className='text-primary'>Skill Set</h2>
            <div className='skills'>
                {skills.map((skill, index) => (
                    <div key={index} className='p-1'>
                        <i className='fas fa-check' /> {skill}
                    </div>
                ))}
            </div>
        </div>
    );

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileAbout;