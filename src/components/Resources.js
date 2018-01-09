import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom'
import Typography from 'material-ui/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import TOCIcon from 'material-ui-icons/Toc';
import VideoIcon from 'material-ui-icons/VideoLibrary';
import DescriptionIcon from 'material-ui-icons/Description';
import Tabs, { Tab } from 'material-ui/Tabs';
import MediaQuery from 'react-responsive';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = theme => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
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

class Resources extends React.Component {
	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes, currentQuestion } = this.props;
		const { value } = this.state;

		return (
			<div className={classes.root}>
					<div className="resources-mobile">
						<AppBar position="static" color="default">
							<MuiThemeProvider theme={tabsStyle}>
								<Tabs
									value={value}
									onChange={this.handleChange}
									indicatorColor="primary"
									textColor="primary"
								>
									<Tab icon={<TOCIcon/>} />
									<Tab icon={<VideoIcon/>} />
									<Tab icon={<DescriptionIcon/>}/>
								</Tabs>
							</MuiThemeProvider>
						</AppBar>
						{value === 0 && <TabContainer>
							{currentQuestion.currentQuestion.resources.overview}
						</TabContainer>}
						{value === 1 && <TabContainer>
							{currentQuestion.currentQuestion.resources.video}
						</TabContainer>}
						{value === 2 && <TabContainer>
							<div>
								{currentQuestion.currentQuestion.resources.examples.map((item, index) => (
									<p>
										<a key={index}>{item.document}</a>
									</p>
								))}
								{currentQuestion.currentQuestion.resources.external.map((item, index) => (
									<p>
										<a key={index}>{item.link}</a>
									</p>
								))}
							</div>
						</TabContainer>}
					</div>
			</div>
		);
	}
}

Resources.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resources);


