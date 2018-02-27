import React, { Component } from 'react';
import {
	Link,
} from 'react-router-dom'
import NavBar from './NavBar'
import Divider from 'material-ui/Divider';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import LoginScreen from './LoginScreen';
import Paper from 'material-ui/Paper';
import MyProjects from './MyProjects'
import SharedProjects from './SharedProjects'
import AppBar from 'material-ui/AppBar';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MediaQuery from 'react-responsive';
import AddIcon from 'material-ui-icons/Add';

const tabsStyle = createMuiTheme({
	overrides: {
		MuiTabs: {
			flexContainer: {
				justifyContent: "space-evenly"
			},
		},
	},
});

function TabContainer(props) {
	return (
		<div>
			{props.children}
		</div>
	);
}



class Dashboard extends Component {



	state = {
		currentStage: 3,
		confirmDeleteItem: '',
		open: false,
		lessonToShare: '',
		emailToShareWith: '',
		value: 0,
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	changeStage = (stage) => {
		this.setState({
			currentStage: stage
		})
	}

	getSharedLessons = (sharedLessons) => {
		this.setState({
			sharedLessons: sharedLessons
		})
	}



	render() {
		const { stage1, stage2, stage3, stage4, firebase, profile, classes, auth } = this.props
		const { value } = this.state
		const stageList = !isLoaded(stage1, stage2, stage3, stage4)
			? 'Loading'
			: isEmpty(stage1, stage2, stage3, stage4)
				? ''
				: [stage1, stage2, stage3, stage4]

		const sharedLessons = !isLoaded(profile) ?
			(['Loading...']) :
			isEmpty(profile) ? (['Loading...']):
				profile.lessonsSharedWithMe ?
					(Object.keys(profile.lessonsSharedWithMe).map((id) => {
						return id
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
						<NavBar
							onDashboard={true}/>
						<div className='dashboard'>
							<div className="add-card">
								<Link to={{
									pathname: '/planner',
									state: { newLesson: true }
								}}
								>
									<MediaQuery minWidth={1000}>
										{(matches) => {
											if (matches) {
												return (
													<Button style={{width: '250px', height: '64px'}}
													        color="primary"
													        raised
													        aria-label="add"
													>
														Create a New Project
													</Button>
												);
											} else {
												return (
													<Button
														fab
														color="primary" aria-label="add"
													>
														<AddIcon />
													</Button>
												);
											}
										}}
									</MediaQuery>
								</Link>
							</div>
							<div className="dashboard-content">
								<AppBar
									className='project-bar'
									color='inherit'
									elevation={1}
									position="static">
									<MuiThemeProvider theme={tabsStyle}>
										<Tabs
											value={value}
											onChange={this.handleChange}>
											<Tab label="My Projects" />
											<Tab label="Shared Projects" />
										</Tabs>
									</MuiThemeProvider>
								</AppBar>
									<Paper className="project-list" elevation={1}>

										{value === 0 &&
											<TabContainer>
													{profile.lessonIDs &&
													Object.keys(profile.lessonIDs).length > 0 ? (
														<div className="my-projects">
															{profile.lessonIDs && Object.keys(profile.lessonIDs).map((lesson, index) => (
																<MyProjects
																	key={index}
																	lessonID={lesson}
																	lessonTitle={profile.lessonIDs[lesson]}
																	index={index}
																	profile={profile}
																	uid={auth.uid}
																/>
															))}
														</div>
													) : (
														<Typography
															style={{margin: '25px'}}
															type='title'
														>
															You haven't created any projects yet...
														</Typography>
													)}
											</TabContainer>}
										{value === 1 &&
											<TabContainer>
												<div className="my-projects">
													{sharedLessons.map((lesson, index) => (
														<SharedProjects
															key={index}
															lessonID={lesson}
															lessonTitle={profile.lessonsSharedWithMe[lesson]}
															index={index}
															profile={profile}
															uid={auth.uid}
														/>
													))}
												</div>
											</TabContainer>}



									</Paper>


							</div>
						</div>
					</div>
						)}
						</div>



		);
	}
}

const enhance = compose(
	firebaseConnect(props => ([
		'stage1',
		'stage2',
		'stage3',
		'stage4',
		'profile',
		'auth',
	])),
	connect(
		(state, props) => ({
			stage1: state.firebase.data.stage1,
			stage2: state.firebase.data.stage2,
			stage3: state.firebase.data.stage3,
			stage4: state.firebase.data.stage4,
			profile: state.firebase.profile,
			auth: state.firebase.auth
		})
	)
)

export default enhance(Dashboard)
