import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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

});

class WorkSpace extends React.Component {

	componentDidMount() {
		let questions = new Array(this.props.currentQuestion.currentQuestion.inputs.length)
		questions.fill('')
		const currentStage = this.props.currentStage.stageIndex
		const currentQuestion = this.props.currentQuestion.questionIndex
		const lesson = this.props.profile.lessons[this.props.currentLesson]
		const lessonStage = lesson[`stage${currentStage + 1}`]
		const lessonAnswers = lessonStage && lessonStage[currentQuestion] && lessonStage[currentQuestion].answers
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
		const lesson = this.props.profile.lessons[this.props.currentLesson]
		const currentLesson = this.props.currentLesson
		const nextLesson = nextProps.currentLesson
		const nextLessonStage = lesson[`stage${nextStage + 1}`]
		const nextLessonAnswers = nextLessonStage && nextLessonStage[nextQuestion] && nextLessonStage[nextQuestion].answers
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
	};


	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render () {
		const { classes, profile, firebase, currentStage, currentQuestion, currentLesson } = this.props
		const currentLessonStage = profile.lessons[currentLesson][`stage${currentStage.stageIndex + 1}`]
		const currentLessonQuestion = currentLessonStage && profile.lessons[currentLesson][`stage${currentStage.stageIndex + 1}`][currentQuestion.questionIndex]
		const lesson = profile.lessons[currentLesson]
		return (
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
								<TextField
									id="multiline-flexible"
									label={item.content}
									multiline
									rows="4"
									rowsMax="4"
									value={this.state[index]}
									onChange={this.handleChange(index)}
									className={classes.textField}
									margin="normal"
								/>
							</div>


						))}


					</form>


					<Button
						raised
						color="primary"
						className={classes.button}
						onClick={() => firebase.updateProfile({ lessons:
								{
									...profile.lessons,
									[currentLesson]: {
										...profile.lessons[currentLesson],
										[`stage${currentStage.stageIndex + 1}`]: {
											...profile.lessons[currentLesson][`stage${currentStage.stageIndex + 1}`],
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
									}
								}
						})}
					>
						Save
					</Button>
				</Paper>
			</div>
		)
	}
}

WorkSpace.propTypes = {
	classes: PropTypes.object.isRequired,
};

WorkSpace = withStyles(styles)(WorkSpace)

export default compose(
	withFirebase, // add props.firebase (firebaseConnect() can also be used)
	connect(
		({ firebase: { profile } }) => ({
			profile
		})
	)
)(WorkSpace)
