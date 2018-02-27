import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MediaQuery from 'react-responsive';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
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
		marginTop: '80px',
		paddingLeft: theme.spacing.unit * 3,
		paddingBottom: theme.spacing.unit * 2,
		backgroundColor: '#f5f5f5'

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
	return ['Independent Production & Assessment', 'Building the field', 'Academic Discourse and Skills', 'Joint Construction', ];
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


	handleChange = (event, value) => {
		this.setState({
			activeStep: value,
		}, () => this.props.changeStage(this.state.activeStep));
	};




	render() {
		const { classes, currentLesson, currentLessonTitle, sharedEdit, currentLessonID } = this.props;
		const steps = getSteps();
		const icons = getIcons();
		const { activeStep } = this.state;

		return (
			<div className={classes.root}>
				<MediaQuery minWidth={900}>
					{(matches) => {
						if (matches) {


							return (
								<div style={{marginTop: 70}}>
									<div className={classes.title}>
										<Typography  type='display1'>
											{currentLesson ? currentLesson.title : null}
										</Typography>
									</div>
									<AppBar
										position="static"
										color="inherit"
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
								<div style={{marginTop: 64}}>
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
			</div>
		);
	}
}

TopProgressBar.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true})(TopProgressBar);