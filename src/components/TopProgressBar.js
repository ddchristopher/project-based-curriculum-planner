import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepButton } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MediaQuery from 'react-responsive';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import MobileStepper from 'material-ui/MobileStepper';
import Paper from 'material-ui/Paper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import BuildIcon from 'material-ui-icons/Build';
import ClassIcon from 'material-ui-icons/Class';
import GroupIcon from 'material-ui-icons/Group';
import SchoolIcon from 'material-ui-icons/School'

const styles = theme => ({
	root: {
		width: '100%',
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		marginBottom: theme.spacing.unit * 2,
	},
	progressBar : {
		backgroundColor: 'transparent',
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 25,
		paddingTop: theme.spacing.unit * 2,
		backgroundColor: theme.palette.background.default,
	},
	mobileStepper: {
		height: 25,
	},
	title : {
		margin: theme.spacing.unit * 3,
	},
	button: {
		marginRight: theme.spacing.unit,
	},
	completed: {
		display: 'inline-block',
	},
	instructions: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit,
	},
});

const tabsStyle = createMuiTheme({
	overrides: {
		MuiTabs: {
			flexContainer: {
				justifyContent: "space-evenly"
			},
		},
	},
});

const getSteps = () => {
	return ['Building the field', 'Academic Discourse and Skills', 'Joint Construction', 'Independent Production & Assessment'];
}

const getIcons = () => {
	return [<BuildIcon/>,<ClassIcon/>,<GroupIcon/>,<SchoolIcon/>]
}


function TabContainer(props) {
	return (
		<Typography component="div" style={{ fontSize: '1.2em', textAlign: 'center', paddingTop: 5 }}>
			{props.children}
		</Typography>
	);
}


class TopProgressBar extends React.Component {
	state = {
		activeStep: this.props.currentStage,
		completed: {},
		value: this.props.currentStage,
	};


	totalSteps = () => {
		return getSteps().length;
	};

	isLastStep() {
		return this.state.activeStep === this.totalSteps() - 1;
	}

	allStepsCompleted() {
		return this.completedSteps() === this.totalSteps();
	}

	handleNext = () => {
		this.setState({
			activeStep: this.state.activeStep + 1,
		});
	};

	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		});
	};


	handleStep = step => () => {
		this.setState({
			activeStep: step,
		}, () => this.props.changeStage(this.state.activeStep));
	};

	handleChange = (event, value) => {
		this.setState({
			activeStep: value,
		}, () => this.props.changeStage(this.state.activeStep));
	};




	render() {
		const { classes, theme, currentLesson } = this.props;
		const steps = getSteps();
		const icons = getIcons();
		const { activeStep, value } = this.state;

		return (
			<div className={classes.root}>
				<MediaQuery minDeviceWidth={900}>
					{(matches) => {
						if (matches) {


							return (
								<div>
									<Typography className={classes.title} type='display1'>
										{currentLesson}
									</Typography>
									<AppBar
										position="static"
										color="default"
									>
										<MuiThemeProvider theme={tabsStyle}>
											<Tabs
												value={activeStep}
												onChange={this.handleChange}
												indicatorColor="primary"
												textColor="primary"
											>
												{steps.map((step, index) => {
													return (
														<Tab
															key={index}
															label={step}/>
													)
												})}


											</Tabs>
										</MuiThemeProvider>
									</AppBar>
								</div>
							);

						} else {
							return (
								<div>
									<AppBar
										position="static"
										color="default"
									>
										{activeStep === 0 && <TabContainer>{steps[0]}</TabContainer>}
										{activeStep === 1 && <TabContainer>{steps[1]}</TabContainer>}
										{activeStep === 2 && <TabContainer>{steps[2]}</TabContainer>}
										{activeStep === 3 && <TabContainer>{steps[3]}</TabContainer>}
										<MuiThemeProvider theme={tabsStyle}>
											<Tabs
												value={activeStep}
												onChange={this.handleChange}
												indicatorColor="primary"
												textColor="primary"
											>
												{steps.map((step, index) => {
													return (
														<Tab
															key={index}
															icon={icons[index]}/>
													)
												})}


											</Tabs>
										</MuiThemeProvider>
									</AppBar>
								</div>

							);
						}
					}}
				</MediaQuery>

				{/*{steps.map((step, index) => {*/}
					{/*return (*/}
						{/*<Tab*/}
							{/*key={index}*/}
							{/*label={step} />*/}
					{/*)*/}
				{/*})}*/}

				{/*<Stepper className={classes.progressBar} nonLinear activeStep={activeStep}>*/}
					{/*{steps.map((label, index) => {*/}
						{/*return (*/}
							{/*<Step key={label}>*/}
								{/*<StepButton*/}
									{/*className={classes.stepText}*/}
									{/*onClick={this.handleStep(index)}*/}
									{/*completed={this.state.completed[index]}*/}
								{/*>*/}
									{/*{label}*/}
								{/*</StepButton>*/}
							{/*</Step>*/}
						{/*);*/}
					{/*})}*/}
				{/*</Stepper>*/}
			</div>
		);
	}
}

TopProgressBar.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true})(TopProgressBar);