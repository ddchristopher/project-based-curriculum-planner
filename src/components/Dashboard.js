import React, { Component } from 'react';
import {
	Link,
	Redirect,
} from 'react-router-dom'
import NavBar from './NavBar'
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { withStyles } from 'material-ui/styles';
import exportToPDF from '../utils/exportToPDF'
import LoginScreen from './LoginScreen';
import Divider from 'material-ui/Divider';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import List, {
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
} from 'material-ui/List';
import DashboardIcon from 'material-ui-icons/Dashboard';
import Paper from 'material-ui/Paper';


class Dashboard extends Component {
	state = {
		currentStage: 3,
		confirmDeleteItem: ''
	}

	changeStage = (stage) => {
		this.setState({
			currentStage: stage
		})
	}

	render() {
		const { stage1, stage2, stage3, stage4, firebase, profile, classes } = this.props
		const stageList = !isLoaded(stage1, stage2, stage3, stage4)
			? 'Loading'
			: isEmpty(stage1, stage2, stage3, stage4)
				? ''
				: [stage1, stage2, stage3, stage4]
		const lessons = !isLoaded(profile) ?
			(['Loading...']) :
			isEmpty(profile) ? (['Loading...']):
				profile.lessons ?
				(Object.keys(profile.lessons).map((lesson) => {
					return profile.lessons[lesson].title
				})) : []


		return (
			<div>

				{isLoaded(profile) === false ? (
						<div className="login-screen">
							<CircularProgress className="loading" size={50} style={{width: '100px'}} />
						</div>
					)
					:
					isEmpty(profile) ? (
						<LoginScreen/>
				) : (
					<div>
						<NavBar onDashboard={true}/>
						<div className='dashboard'>
							<Typography type='display2' gutterBottom>
								My Dashboard
							</Typography>
							<div className="add-card">
								<Link to={{
									pathname: '/planner',
									state: { newLesson: true }
								}}>
									<Button style={{width: '300px', height: '50px'}}
										color="primary" raised aria-label="add"
									>
										Create a New Project
									</Button>
								</Link>
							</div>
							<div className="dashboard-content">

									<Paper className="project-list" elevation={4}>
										<Typography type='display1' className="project-header" gutterBottom>
											My Projects
										</Typography>
										<div className="my-projects">
											{lessons.map((lesson, index) => (
												<Paper elevation={1} key={index} className="project">
													<div className="project-title">
														<Typography type='display1'>
															{lesson}
														</Typography>
													</div>
													<Divider/>
													<div className="project-options">
														{this.state.confirmDeleteItem === index ? (
															<div>
																<Typography type='display1' gutterBottom>
																	Confirm Delete
																</Typography >
																<Button raised
																        onClick={() => {
																	        const lessons = { ...profile.lessons }
																	        lessons[lesson] = undefined
																	        delete lessons[lesson]
																	        firebase.updateProfile(
																		        { lessons }
																	        )
																	        this.setState({
																		        confirmDeleteItem: ''
																	        })
																        }}
																        style={{
																	color: 'white',
																	backgroundColor: 'red',
																	marginRight: '15px'
																}}>
																	Delete
																</Button>
																<Button raised
																        color="primary"
																        onClick={() => this.setState({
																	        confirmDeleteItem: ''
																        })}
																>
																	Cancel
																</Button>
															</div>
														) : (
															<div>
																<Link to={{
																	pathname: '/planner',
																	state: { currentLesson: lesson }
																}}>
																	<Button className="dashboard-button" raised color='default'>Edit</Button>
																</Link>
																<Button className="dashboard-button"
																        raised
																        color='default'
																        onClick={() => this.setState({
																	        confirmDeleteItem: index
																        })}
																>
																	Delete</Button>


																<Button className="dashboard-button" raised  color='default'>Share</Button>
																<Button
																	className="dashboard-button"
																	raised
																	color='primary'
																	onClick={() => {
																		console.log(profile.lessons[lesson])
																		exportToPDF(profile.lessons[lesson])
																	}}
																>Download</Button>
															</div>
														)}
													</div>
												</Paper>
											))}
										</div>



									</Paper>



									<Paper className="project-list" style={{marginTop: '25px'}} elevation={4}>
										<Typography type='display1' className="project-header" gutterBottom>
											Projects Shared With Me
										</Typography>
										<div className="my-projects">
											<List>
												<ListItem>
													<ListItemText />
													<ListItemSecondaryAction>
													</ListItemSecondaryAction>
												</ListItem>
											</List>
										</div>

									</Paper>

							</div>
						</div>
					</div>
						)}
						</div>



		);
	}
}


export default compose(
	firebaseConnect([
		'stage1',
		'stage2',
		'stage3',
		'stage4', // { path: '/todos' } // object notation
		'profile'
	]),
	connect(
		(state) => ({
			stage1: state.firebase.data.stage1,
			stage2: state.firebase.data.stage2,
			stage3: state.firebase.data.stage3,
			stage4: state.firebase.data.stage4,
			profile: state.firebase.profile
			// load profile
		})
	)
)(Dashboard)


//
// <NavBar/>
// <div className="progressTop">
// 	<TopProgressBar/>
// 	</div>
//
// <div className="lessonBoard">
// 	<div className="lessonMap">
// 		<LessonMap/>
// 	</div>
//
// 	<div className="workSpace">
// 		<WorkSpace/>
// 	</div>
//
// 	<div className="resources">
// 		<Resources/>
// 	</div>
//
// </div>