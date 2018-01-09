import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle'
import Menu, { MenuItem } from 'material-ui/Menu';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import exportToPDF from '../utils/exportToPDF'
import DashboardIcon from 'material-ui-icons/Dashboard';
import DownloadIcon from 'material-ui-icons/FileDownload';
import MediaQuery from 'react-responsive';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

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
		anchorLessons: null,
		anchorEl: null,
		left: false,
	};

	handleMenu = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleLessonsMenu = (event) => {
		this.setState({ anchorLessons: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	handleCloseLessons = () => {
		this.setState({ anchorLessons: null });
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
		const { classes, firebase, auth, profile, onDashboard, currentLesson } = this.props;
		const lessons = !isLoaded(profile) ?
			(['Loading...']) :
			isEmpty(profile) ? (['Loading...']):
				profile.lessons ?
					(Object.keys(profile.lessons).map((lesson) => {
						return profile.lessons[lesson].title
					})) : []


		const { anchorEl, anchorLessons } = this.state;
		const open = Boolean(anchorEl);
		const openLessons = Boolean(anchorLessons)
		return (
			<div>
				<div className={classes.root}>
					<AppBar position="static">
						<Toolbar>

							<MediaQuery minDeviceWidth={900}>
								{(matches) => {
									if (matches) {
										return (
												<Typography type="title" color="inherit" className={classes.flex}>
													Project Based Curriculum Planner
											</Typography>
										);
									} else {
										return (
											<IconButton
												className={classes.menuButton}
												color="contrast"
												aria-label="Menu"
												onClick={() => {
													console.log('hello')
													this.openDrawer()
												}}
											>
												<MenuIcon />
											</IconButton>
										);
									}
								}}
							</MediaQuery>


							<MediaQuery minDeviceWidth={900}>
								{(matches) => {
									if (matches) {
										return (
											<div>
												{!onDashboard && <Link to={{
													pathname: '/',
													state: { newLesson: true }
												}}>
													<Button
														color="contrast"
													>
														My Dashboard
														<DashboardIcon style={{marginLeft: '5px'}}/>

													</Button>
												</Link>}

												{!onDashboard &&
												<Button
													color="contrast"
													onClick={() => {
														exportToPDF(profile.lessons[currentLesson])
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
													color="contrast"
												>
													Hello {profile.displayName}
													<AccountCircle style={{marginLeft: '5px'}}/>

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
											<Button
												color="contrast"
												disableRipple>Hello {profile.displayName}</Button>
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
							<Typography type="title" color="inherit" className={classes.flex}>
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
								color="contrast"
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
							color="contrast"
							onClick={() => {
								exportToPDF(profile.lessons[currentLesson])
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
	firebaseConnect(), // withFirebase can also be used
	connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(NavBar)


// <Button
// aria-owns={openLessons ? 'my-projects' : null}
// aria-haspopup="true"
// onClick={this.handleLessonsMenu}
// color="contrast"
// 	>
// 	My Projects
// </Button>
// <Menu
// 	id="my-projects"
// 	anchorEl={anchorLessons}
// 	anchorOrigin={{
// 		vertical: 'top',
// 		horizontal: 'right',
// 	}}
// 	transformOrigin={{
// 		vertical: 'top',
// 		horizontal: 'right',
// 	}}
// 	open={openLessons}
// 	onClose={this.handleCloseLessons}
// >
// 	{lessons.map((lesson, index) => (
// 		<Link
// 			key={index}
// 			to={{
// 				pathname: '/planner',
// 				state: { currentLesson: lesson }
// 			}}>
// 			<MenuItem
//
// 				onClick={this.handleClose}>
// 				{lesson}
// 			</MenuItem>
// 		</Link>
// 	))}
// </Menu>