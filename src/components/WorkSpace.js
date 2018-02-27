import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Help from 'material-ui-icons/Help'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import {
	Link,
	Redirect,
} from 'react-router-dom'
import moment from 'moment';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import {overviewText, overviewTextExtended} from "../utils/overviewCopy";

const styles = theme => ({
	root: theme.mixins.gutters({
		paddingTop: 16,
		paddingBottom: 16,
	}),
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: '100%',
	},
	textFieldDate: {
		marginRight: theme.spacing.unit,
		width: '45%',
	},

});

class WorkSpace extends React.Component {

	componentDidMount() {
		let questions = new Array(this.props.currentQuestion.currentQuestion.inputs.length)
		questions.fill('')
		const currentStage = this.props.currentStage.stageIndex
		const currentQuestion = this.props.currentQuestion.questionIndex
		const lesson = this.props.currentLesson
		const lessonStage = lesson && lesson[`stage${currentStage + 1}`]
		const lessonAnswers = lessonStage && lessonStage[currentQuestion] && lessonStage[currentQuestion].answers
		if (lesson.newProject[currentStage]) {
			this.handleOpen()
		}
		if (lessonStage && lessonStage.timingStart) {
			this.setState({stageTimingStart: lessonStage.timingStart})
		}
		if (lessonStage && lessonStage.timingEnd) {
			this.setState({stageTimingEnd: lessonStage.timingEnd})
		}
		if (lessonAnswers) {
			questions = questions.map((question, index) => {
				return lessonAnswers[index].answer
			})
		} else {
			questions.fill('')
		}
		this.setState(questions)
	}

	componentWillReceiveProps(nextProps) {
		const nextStage = nextProps.currentStage.stageIndex
		const nextQuestion = nextProps.currentQuestion.questionIndex
		const currentStage = this.props.currentStage.stageIndex
		const currentQuestion = this.props.currentQuestion.questionIndex
		const lesson = this.props.currentLesson
		const currentLesson = this.props.currentLesson.title

		if (nextProps.currentLesson === null) {
			this.setState({backToDash: true})
			return
		}

		const nextLesson = nextProps.currentLesson.title
		const nextLessonStage = lesson[`stage${nextStage + 1}`]
		const nextLessonAnswers = nextLessonStage && nextLessonStage[nextQuestion] && nextLessonStage[nextQuestion].answers
		if (nextStage !== currentStage && nextProps.currentLesson.newProject[nextStage] === true) {
			this.handleOpen()
			}

		if (nextStage !== currentStage && nextLessonStage && nextLessonStage.timingStart) {
			this.setState({stageTimingStart: nextLessonStage.timingStart})
		}
		if (nextStage !== currentStage && nextLessonStage && !nextLessonStage.timingStart) {
			this.setState({stageTimingStart: ''})
		}
		if (nextStage !== currentStage && !nextLessonStage) {
			this.setState({stageTimingStart: ''})
		}

		if (nextStage !== currentStage && nextLessonStage && nextLessonStage.timingEnd) {
			this.setState({stageTimingEnd: nextLessonStage.timingEnd})
		}
		if (nextStage !== currentStage && nextLessonStage && !nextLessonStage.timingEnd) {
			this.setState({stageTimingEnd: ''})
		}
		if (nextStage !== currentStage && !nextLessonStage) {
			this.setState({stageTimingEnd: ''})
		}

		if (
			nextStage !== currentStage
			||
			nextQuestion !== currentQuestion
			||
			nextLesson !== currentLesson
		)
		{
			let questions = new Array(nextProps.currentQuestion.currentQuestion.inputs.length)
			questions.fill('')
			if (nextLessonAnswers) {
				questions = questions.map((question, index) => {
					return nextLessonAnswers[index].answer
				})
			} else {
				questions.fill('')
			}
			this.setState(questions)

		}
	}

	state = {
		backToDash: false,
		showOverview: false,
		overviewExtended: false,
		stageTiming: '',
		stageTimingStart: '',
		stageTimingEnd: '',
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleOpen = () => {
		this.setState({ showOverview: true });
	}

	handleClose = () => {
		this.setState({ showOverview: false });
		this.dismissOverview();
	}

	handleOverviewMore = () => {
		this.setState({overviewExtended: true})
	}

	handleOverviewMoreClose = () => {
		setTimeout(() => {this.setState({overviewExtended: false})}, 200)
	}

	updateLesson = () => {
		const { firebase, currentStage, currentQuestion, currentLessonID } = this.props
		const lesson = this.props.currentLesson
		return firebase.database().ref(`lessons/${currentLessonID}`).update({
			...lesson,
			dateModified: moment().format('MMMM Do YYYY, h:mm:ss a'),
			[`stage${currentStage.stageIndex + 1}`]: {
				...lesson[`stage${currentStage.stageIndex + 1}`],
				timing: {
					duration: `${this.state.stageTimingStart} through ${this.state.stageTimingEnd}`
				},
				timingEnd: this.state.stageTimingEnd,
				timingStart: this.state.stageTimingStart,
				[currentQuestion.questionIndex]: {
					question: currentQuestion.currentQuestion.question,
					answers: currentQuestion.currentQuestion.inputs.map((item, index) => {
						return {
							content: item.content,
							answer: this.state[index]
						}
					})
				},
			}
		})
	}


	dismissOverview = () => {
		const { firebase, currentStage, currentQuestion, currentLessonID } = this.props
		const lesson = this.props.currentLesson
		return firebase.database().ref(`lessons/${currentLessonID}`).update({
			...lesson,
			newProject: {
				...lesson.newProject,
				[currentStage.stageIndex]: false
			}
		})
	}

	render () {
		const { classes, currentQuestion, lessons, currentLesson } = this.props

		return (
			<div>
				{this.state.backToDash ? (
					<Redirect to="/"/>
				) : (
					<div>
						<Paper className={classes.root} elevation={1}>
							<form
								className={classes.container}
								noValidate
								autoComplete='off'>

								{currentQuestion.currentQuestion.inputs.map((item, index) => (
									<div className="question"
									     key={index}
									>
										<Typography type="subheading">
											{item.content}
										</Typography>
										<TextField
											id="multiline-flexible"
											multiline
											value={this.state[index]}
											onChange={this.handleChange(index)}
											className={classes.textField}
											margin="normal"
										/>
									</div>
								))}
								<TextField
									id="dateStart"
									label="Stage Start Date"
									type="date"
									className={classes.textFieldDate}
									value={this.state.stageTimingStart}
									onChange={this.handleChange('stageTimingStart')}
									InputLabelProps={{
										shrink: true,
									}}
									margin="normal"
								/>
								<TextField
									id="dateEnd"
									label="Stage End Date"
									type="date"
									className={classes.textFieldDate}
									value={this.state.stageTimingEnd}
									onChange={this.handleChange('stageTimingEnd')}
									InputLabelProps={{
										shrink: true,
									}}
									margin="normal"
								/>
							</form>

							<div className='workspace-actions'>
								<Button
									raised
									color="primary"
									className={classes.button}
									onClick={() => {
										this.updateLesson()
									}}
								>
									Save
								</Button>
								<IconButton
									color="primary"
									className={classes.button}
									onClick={() => {
										this.handleOpen()
									}}
								>
									<Help/>
								</IconButton>
							</div>

						</Paper>


						<Dialog
							open={this.state.showOverview}
							onClose={() => {
								this.handleClose()
							}}
							aria-labelledby="overview-dialog-title"
							aria-describedby="overview-dialog-description"
						>
							<div className="overview-dialog">
								<DialogTitle id="overview-dialog-title">{`Stage ${this.props.currentStage.stageIndex + 1} Overview`}</DialogTitle>
								<DialogContent>
									<div id="overview-dialog-description">
										{this.state.overviewExtended ? (
											overviewTextExtended[this.props.currentStage.stageIndex]
										) : (
											overviewText[this.props.currentStage.stageIndex]
										)}
									</div>
								</DialogContent>
								<DialogActions>
									<Button
										raised
										color="primary"
										className={classes.button}
										onClick={() => {
											this.handleClose()
											this.handleOverviewMoreClose()
										}}
									>
										GET STARTED
									</Button>
									{!this.state.overviewExtended && <Button
										raised
										color="primary"
										className={classes.button}
										onClick={() => {
											this.handleOverviewMore()
										}}
									>
										LEARN MORE
									</Button>}

								</DialogActions>
							</div>
						</Dialog>
					</div>
				)}

			</div>
		)
	}
}

WorkSpace.propTypes = {
	classes: PropTypes.object.isRequired,
};

WorkSpace = withStyles(styles)(WorkSpace)

export default compose(
	firebaseConnect(props => [
		'stage1',
		'stage2',
		'stage3',
		'stage4',
		'profile',
		'auth',
	]),
	connect(
		(state) => ({
			stage1: state.firebase.data.stage1,
			stage2: state.firebase.data.stage2,
			stage3: state.firebase.data.stage3,
			stage4: state.firebase.data.stage4,
			profile: state.firebase.profile,
			auth: state.firebase.auth,
		})
	)
)(WorkSpace)


