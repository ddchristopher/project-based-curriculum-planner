import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import exportToPDF from '../utils/exportToPDF'
import DashboardIcon from 'material-ui-icons/Dashboard';
import DownloadIcon from 'material-ui-icons/FileDownload';
import MediaQuery from 'react-responsive';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

const styles = {
	root: {
		width: '100%',
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	list: {
		width: 250,
	},
	listFull: {
		width: 'auto',
	},
};


class NavBar extends React.Component {

	state = {
		anchorEl: null,
		left: false,
	};

	handleMenu = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	openDrawer = () => {
		this.setState({
			left: true,
		});
	};

	closeDrawer = () => {
		this.setState({
			left: false,
		});
	}

	render () {
		const { classes, firebase, profile, onDashboard, newLesson, currentLesson } = this.props;
		const { anchorEl } = this.state;
		const open = Boolean(anchorEl);
		return (
			<div>
				<div className={classes.root}>
					<AppBar
						className='top-bar'
						elevation={1}
						color='inherit'
						position="fixed">
						<Toolbar>

							<MediaQuery minWidth={900}>
								{(matches) => {
									if (matches) {
										return (
												<Typography type="title" color="default" className={classes.flex}>
													Project Based Curriculum Planner
											</Typography>
										);
									} else {
										return (
											<IconButton
												className={classes.menuButton}
												color="default"
												aria-label="Menu"
												onClick={() => {
													this.openDrawer()
												}}
											>
												<MenuIcon />
											</IconButton>
										);
									}
								}}
							</MediaQuery>


							<MediaQuery minWidth={900}>
								{(matches) => {
									if (matches) {
										return (
											<div>
												{!onDashboard && <Link to={{
													pathname: '/',
													state: { newLesson: true }
												}}>
													<Button
														color="default"
													>
														My Dashboard
														<DashboardIcon style={{marginLeft: '5px'}}/>

													</Button>
												</Link>}

												{!onDashboard && !newLesson &&
												<Button
													color="default"
													onClick={() => {
														exportToPDF(currentLesson)
													}}
												>
													Download Lesson
													<DownloadIcon style={{marginLeft: '5px'}}/>

												</Button>
												}
												<Button
													aria-owns={open ? 'create project' : null}
													aria-haspopup="true"
													onClick={this.handleMenu}
													color="default"
												>
													<Avatar aria-label="Owner">
														{profile && profile.displayName && profile.displayName.split(' ').map(word => word[0]).join('')}
													</Avatar>

												</Button>
												<Menu
													id="menu-appbar"
													anchorEl={anchorEl}
													anchorOrigin={{
														vertical: 'top',
														horizontal: 'right',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'right',
													}}
													open={open}
													onClose={this.handleClose}
												>
													<Link to={{
														pathname: '/planner',
													}}>
														<MenuItem onClick={() => firebase.logout({ provider: 'google', type: 'popup' })}>
															Logout
														</MenuItem>
													</Link>

												</Menu>
											</div>
										);
									} else {
										return (
											null
											)

									}
								}}
							</MediaQuery>


						</Toolbar>
					</AppBar>
				</div>


				<Drawer open={this.state.left} onClose={this.closeDrawer}>
					<List className={classes.list}>
						<ListItem>
							<Typography type="title" color="default" className={classes.flex}>
								Project Based Curriculum Planner
							</Typography>
						</ListItem>
						<Divider />

						{!onDashboard && <Link to={{
							pathname: '/',
							state: { newLesson: true }
						}}>
							<ListItem
								button
								color="default"
							>
								<ListItemIcon>
									<DashboardIcon />
								</ListItemIcon>
								<ListItemText primary="My Dashboard" />
							</ListItem>
						</Link>}

						{!onDashboard &&
						<ListItem
							button
							color="default"
							onClick={() => {
								exportToPDF(currentLesson)
							}}
						>
							<ListItemIcon>
								<DownloadIcon />
							</ListItemIcon>
							<ListItemText primary="Download Lesson" />
						</ListItem>
						}

						<Divider/>

						<Link to={{
							pathname: '/planner',
						}}>
							<ListItem onClick={() => firebase.logout({ provider: 'google', type: 'popup' })}>
								<ListItemText primary="Logout" />
							</ListItem>
						</Link>

					</List>
				</Drawer>
			</div>

		)
	}
}


NavBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

NavBar = withStyles(styles)(NavBar);

export default compose(
	firebaseConnect(),
	connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(NavBar)