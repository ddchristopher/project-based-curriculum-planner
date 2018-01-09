import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { withFirebase, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import {connect} from "react-redux";
import CheckIcon from 'material-ui-icons/CheckCircle';
import MediaQuery from 'react-responsive';
import MobileStepper from 'material-ui/MobileStepper';
import Paper from 'material-ui/Paper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		background: theme.palette.background.paper,
	},
	mobile: {
		width: '100%',
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		marginBottom: theme.spacing.unit * 1,
	},
	header: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		textAlign: 'center',
		height: 25,
		marginBottom: theme.spacing.unit * 2,
		backgroundColor: theme.palette.background.paper,
	},
	stepTitle : {
		fontSize: '1em',
		marginLeft: 30,
		marginRight: 30,

	},

	mobileStepper: {
		height: 25,
		backgroundColor: theme.palette.background.paper,
	},
});

class LessonMap extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentStage.stageIndex !== this.props.currentStage.stageIndex) {
			this.setState({
				activeStep: 0
			})
		}
	}


	isLastStep() {
		return this.state.activeStep === this.totalSteps() - 1;
	}

	allStepsCompleted() {
		return this.completedSteps() === this.totalSteps();
	}

	handleNext = () => {
		this.setState({
			activeStep: this.state.activeStep + 1,
		}, () => this.props.changeQuestion(this.state.activeStep));
	};

	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		}, () => this.props.changeQuestion(this.state.activeStep));
	};


	handleChange = (event, value) => {
		this.setState({
			activeStep: value,
		}, () => this.props.changeStage(this.state.activeStep));
	};

	state = {
		activeStep: 0,
		completed: {},
		value: 0,
	};


	render() {
		const {
			classes,
			theme,
			changeQuestion,
			currentLesson,
			currentStage,
			currentQuestion,
			profile,
			firebase } = this.props
		const { activeStep } = this.state
		const currentLessonStage = profile.lessons[currentLesson][`stage${currentStage.stageIndex + 1}`]
		const currentLessonQuestion = currentLessonStage && profile.lessons[currentLesson][`stage${currentStage.stageIndex + 1}`][currentQuestion.questionIndex]

		return (
			<div className={classes.root}>
				<MediaQuery minDeviceWidth={900}>
					{(matches) => {
						if (matches) {
							return (
								<List>
									{currentStage.currentStage.map((item, index) => (
										<div key={index} className="question">
											<ListItem
												button
												onClick={() => changeQuestion(index)}
											>
												<ListItemText primary={item.question} />
											</ListItem>
											{currentLessonStage && currentLessonStage[index] && currentLessonStage[index].question === item.question &&
											<CheckIcon className="completed-check"/>
											}
											<Divider/>
										</div>

									))}
								</List>
							);
						} else {
							return(
								<div className={classes.mobile}>
									<Paper square elevation={0} className={classes.header}>
										<Typography className={classes.stepTitle}>
											{currentStage.currentStage[currentQuestion.questionIndex].question}
										</Typography>
										{currentLessonStage && currentLessonStage[activeStep] && currentLessonStage[activeStep].question === currentStage.currentStage[activeStep].question &&
										<CheckIcon className="completed-check"/>
										}
										<Divider/>

									</Paper>
									<MobileStepper
										type="text"
										steps={currentStage.currentStage.length}
										position="static"
										activeStep={currentQuestion.questionIndex}
										className={classes.mobileStepper}
										nextButton={
											<Button
												dense
												onClick={() => {
													this.handleNext()
												}}
												disabled={activeStep === currentStage.currentStage.length - 1}>
												Next
												{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
											</Button>
										}
										backButton={
											<Button
												dense
												onClick={() => {
													this.handleBack()
												}}
												disabled={activeStep === 0}>
												{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
												Back
											</Button>
										}
									/>
								</div>
							);
						}
					}}
				</MediaQuery>
			</div>
		);
	}
}


LessonMap.propTypes = {
	classes: PropTypes.object.isRequired,
};

LessonMap = withStyles(styles, { withTheme: true})(LessonMap);

export default compose(
	withFirebase, // add props.firebase (firebaseConnect() can also be used)
	connect(
		({ firebase: { profile } }) => ({
			profile
		})
	)
)(LessonMap)

