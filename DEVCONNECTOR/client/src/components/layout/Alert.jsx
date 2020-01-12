import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/*
* This component is mainly used to show an alert
* Go to my google doc and see the screenshot to see what it displays
* https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/10055330#questions
* Watch from 12:15 to get a TLDR of how this component works with redux
*/
// const Alert = props => {

// destructuring so we don't need props.alerts, we could just do alerts
const Alert = ({ alerts }) => alerts !== null && alerts.length > 0
    && alerts.map(alert => (
        <div key= {alert.id} className = {`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));



Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}
/*
* https://www.udemy.com/course/mern-stack-front-to-back/learn/lecture/10055330#questions
* Watch from 7:10, highly recommended
* Basically we want to get the alerts array to this component(https://imgur.com/a/N5y5RHr)
* So here we are mapping that redux state (Alert array) to props
*/
const mapStateToProps = (state) => ({
    alerts: state.alert
})
/* we are connecting this component to the redux
* this is for redux
* Connect takes two arguments in the first (), the state and the action
* Here we only are using state and no action
*/
export default connect(mapStateToProps)(Alert)
