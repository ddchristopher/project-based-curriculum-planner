import React from 'react'
import PropTypes from 'prop-types'
import {
	Redirect,
} from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui/Progress';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import GoogleButton from 'react-google-button'
import image2 from '../img/our student 3.jpg'
import Typography from 'material-ui/Typography';
import MediaQuery from 'react-responsive';


const LoginPage = ({ firebase, auth }) => (
	<div>
		<div>
			{
				isLoaded(auth) === false
					? <div className="login-screen">
						<CircularProgress className="loading" size={50} style={{width: '100px'}} />
					</div>
					: isEmpty(auth)
					? <div>
						<div className="login-screen">
							<MediaQuery minDeviceWidth={700}>
								{(matches) => {
									if (matches) {
										return (
											<div>
												<Typography type='display3' gutterBottom>
													Project Based Curriculum Planner
												</Typography>
											</div>

										);
									} else {
										return (
											<div>
												<Typography type='display1' gutterBottom>
													Project Based Curriculum Planner
												</Typography>
											</div>
										);
									}
								}}
							</MediaQuery>



							<img src={image2} className="top-image" alt=""/>
							<GoogleButton
								className='login-button'
								type="dark" // can also be written as disabled={true} for clarity
								onClick={() => firebase.login({ provider: 'google', type: 'popup' })}
							/>
						</div>

					</div>
					:
					<div>
						<Redirect to="/dashboard"/>
					</div>

			}
		</div>
	</div>
)

LoginPage.propTypes = {
	firebase: PropTypes.shape({
		login: PropTypes.func.isRequired
	}),
	auth: PropTypes.object
}

export default compose(
	firebaseConnect(),
	connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(LoginPage)