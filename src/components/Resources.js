import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

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
					<Paper style={{ padding: 8 * 3 }}>
						<Typography type="title">
							{currentQuestion.currentQuestion.resources.overview}
						</Typography>
						<p>
							{currentQuestion.currentQuestion.resources.video}
						</p>
						{currentQuestion.currentQuestion.resources.examples.map((item, index) => (
							<p key={index}>
								<a>{item.document}</a>
							</p>
						))}
						{currentQuestion.currentQuestion.resources.external.map((item, index) => (
							<p key={index}>
								<a>{item.link}</a>
							</p>
						))}
					</Paper>
				</div>
			</div>
		);
	}
}

Resources.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resources);




