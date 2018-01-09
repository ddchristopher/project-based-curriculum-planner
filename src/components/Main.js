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

	render() {
		const { stage1, stage2, stage3, stage4, firebase, profile, classes } = this.props
		const newLesson = this.props.location.state ?
			this.props.location.state.newLesson ? true
				: this.props.location.state.currentLesson && false
			:
			true
		const { currentStage} = this.state
		const stageList = !isLoaded(stage1, stage2, stage3, stage4)
			? 'Loading'
			: isEmpty(stage1, stage2, stage3, stage4)
				? []
				: [stage1, stage2, stage3, stage4]
		return (
			<div>
				<NavBar
					onDashboard={false}
					currentLesson={this.props.location.state && this.props.location.state.currentLesson && this.props.location.state.currentLesson}
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
									<Typography type='display2' gutterBottom>
										New Lesson
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
									<Link to={{
										pathname: this.state.lessonTitle.length > 0 ? '/planner' : '/dashboard',
										state: { currentLesson: this.state.lessonTitle }
									}}>
										<Button
											raised
											color="primary"
											className={classes.button}
											disabled={this.state.lessonTitle.length > 0 ? false: true}
											onClick={() => firebase.updateProfile(
												{ lessons:
													{
														...profile.lessons,
														[this.state.lessonTitle]: {
															title: this.state.lessonTitle.trim(),
															subject: this.state.lessonSubject.trim(),
															}
													}
												}
											)}
										>
											Submit
										</Button>
									</Link>
								</div>
							)
							:
							(
								<div>
										<TopProgressBar
											stages={stageList}
											currentStage={currentStage}
											changeStage={(stage) => this.changeStage(stage)}
											currentLesson={this.props.location.state.currentLesson && this.props.location.state.currentLesson}
										/>
									<LessonPlanner
										stages={stageList}
										currentStage={{
											stageIndex: currentStage,
											currentStage: stageList[currentStage],
										}}
										currentLesson={this.props.location.state.currentLesson && this.props.location.state.currentLesson}
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
	firebaseConnect([
		'stage1',
		'stage2',
		'stage3',
		'stage4', // { path: '/todos' } // object notation
		'profile',
		'auth'
	]),
	connect(
		(state) => ({
			stage1: state.firebase.data.stage1,
			stage2: state.firebase.data.stage2,
			stage3: state.firebase.data.stage3,
			stage4: state.firebase.data.stage4,
			profile: state.firebase.profile,
			auth: state.firebase.auth
			// load profile
		})
	)
)(Main)


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