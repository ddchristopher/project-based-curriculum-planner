import React, { Component } from 'react';
import {
	Link,
	Redirect,
} from 'react-router-dom'
import NavBar from './NavBar'
import { CircularProgress } from 'material-ui/Progress';
import TopProgressBar from './TopProgressBar'
import LessonPlanner from './LessonPlanner'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from 'material-ui/styles';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import moment from 'moment';


const styles = theme => ({
	root: theme.mixins.gutters({
		paddingTop: 16,
		paddingBottom: 16,
	}),
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: '100%',
	},

});

class Main extends Component {
	state = {
		currentStage: 0,
		lessonTitle: '',
		lessonSubject: '',
		open: false
	}

	componentDidMount() {
		window.scrollTo(0, 0)
	}

	changeStage = (stage) => {
		this.setState({
			currentStage: stage
		})
	}

	handleChange = name => event => {
		const value = event.target.value.length > 200 ?  event.target.value.slice(0,200) : event.target.value
		this.setState({
			[name]: value,
		});
	};

	handleClick = () => {
		this.setState({ open: true });
	};

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ open: false });
	};

	render() {
		const { stage1, stage2, stage3, stage4, firebase, profile, classes, lesson } = this.props
		const newLesson = this.props.location.state ?
			this.props.location.state.newLesson ?
				true : this.props.location.state.currentLesson && false
			:
			true
		const { currentStage} = this.state
		const stageList = !isLoaded(stage1, stage2, stage3, stage4)
			? 'Loading'
			: isEmpty(stage1, stage2, stage3, stage4)
				? []
				: [stage1, stage2, stage3, stage4]

		const lessonToCreate = firebase.database().ref('lessons').push()


		return (
			<div>
				<NavBar
					onDashboard={false}
					newLesson={newLesson}
					currentLesson={lesson}
				/>
				{isLoaded(profile) === false ? (
						<div className="login-screen">
							<CircularProgress className="loading"  size={50} style={{width: '100px'}} />
						</div>
					)
					:
					isEmpty(profile) ? (
						<Redirect to="/"/>
					) : (
						newLesson ?
							(
								<div className="dashboard">
									<Typography type='display2' style={{marginTop: '64px'}} gutterBottom>
										New Project
									</Typography>
									<form
										className="new-lesson"
										autoComplete='off'>

										<TextField
											id="multiline-flexible"
											label="Lesson Title"
											required
											multiline
											value={this.state.lessonTitle}
											onChange={this.handleChange('lessonTitle')}
											className={classes.textField}
											margin="normal"
										/>
										<TextField
											id="multiline-flexible"
											label="Lesson Subject"
											multiline
											value={this.state.lessonSubject}
											onChange={this.handleChange('lessonSubject')}
											className={classes.textField}
											margin="normal"
										/>
									</form>
									<Link
										to={{
											pathname: '/planner',
											state: {
												currentLesson: this.state.lessonTitle,
												currentLessonID: lessonToCreate.key
											}
										}}
										onClick={(e) => {
											if (this.state.lessonTitle.length <= 0 || (profile.lessons && profile.lessons[this.state.lessonTitle])) {
												e.preventDefault()
											}
										}}
									>
										<Button
											raised
											color="primary"
											className={classes.button}
											disabled={this.state.lessonTitle.length > 0 ? false: true}
											onClick={() => {
												if (profile.lessons && profile.lessons[this.state.lessonTitle]) {
													this.handleClick()
												} else {
													firebase.updateProfile({
														lessonIDs: {
															...profile.lessonIDs,
															[lessonToCreate.key]: this.state.lessonTitle.trim()
														}
													})
													lessonToCreate.set(
														{
															title: this.state.lessonTitle.trim(),
															subject: this.state.lessonSubject.trim(),
															owner: this.props.auth.uid,
															ownerName: profile.displayName,
															ownerAvatar: profile.avatarUrl,
															dateModified: moment().format('MMMM Do YYYY, h:mm:ss a'),
															newProject: [true,true,true,true]
														}
													)
												}

											}}
										>
											Submit
										</Button>
									</Link>

									<Snackbar
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center',
										}}
										open={this.state.open}
										autoHideDuration={4000}
										onClose={this.handleClose}
										SnackbarContentProps={{
											'aria-describedby': 'message-id',
										}}
										message={<span id="message-id">A lesson with this title already exists</span>}
										action={[
											<IconButton
												key="close"
												aria-label="Close"
												color="inherit"
												className={classes.close}
												onClick={this.handleClose}
											>
												<CloseIcon />
											</IconButton>,
										]}
									/>
								</div>
							)
							:
							(
								<div>
									<TopProgressBar
										stages={stageList}
										currentStage={currentStage}
										changeStage={(stage) => this.changeStage(stage)}
										currentLesson={this.props.lesson}
										sharedEdit={this.props.location.state.sharedEdit ? this.props.location.state.sharedEdit : false}
									/>
									<LessonPlanner
										stages={stageList}
										currentStage={{
											stageIndex: currentStage,
											currentStage: stageList[currentStage],
										}}
										currentLesson={this.props.lesson}
										currentLessonID={this.props.location.state.currentLessonID && this.props.location.state.currentLessonID}
										sharedEdit={this.props.location.state.sharedEdit ? this.props.location.state.sharedEdit : false}
									/>
								</div>
							)

					)}
			</div>

		);
	}
}

Main = withStyles(styles)(Main)

export default compose(
	firebaseConnect(props => [
		'stage1',
		'stage2',
		'stage3',
		'stage4',
		'profile',
		'auth',
		{
			path: `lessons/${props.location.state ? props.location.state.currentLessonID : ''}`,
			storeAs: props.location.state ? props.location.state.currentLessonID : 'lesson'
		}
	]),
	connect(
		(state, props) => ({
			stage1: state.firebase.data.stage1,
			stage2: state.firebase.data.stage2,
			stage3: state.firebase.data.stage3,
			stage4: state.firebase.data.stage4,
			profile: state.firebase.profile,
			lesson: state.firebase.data[props.location.state ? props.location.state.currentLessonID : 'lesson'],
			auth: state.firebase.auth
		})
	)
)(Main)


