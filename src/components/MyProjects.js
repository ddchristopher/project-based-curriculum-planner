import React, { Component } from 'react';
import {
	Link,
} from 'react-router-dom'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ShareIcon from 'material-ui-icons/Share'
import DeleteIcon from 'material-ui-icons/Delete'
import DownloadIcon from 'material-ui-icons/FileDownload'
import EditIcon from 'material-ui-icons/Edit'
import exportToPDF from '../utils/exportToPDF'
import Dialog, {
	DialogActions,
	DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import {compose} from "redux";
import {connect} from "react-redux";
import Avatar from 'material-ui/Avatar';


class MyProjects extends Component {

	state = {
		confirmDeleteItem: '',
		open: false,
		lessonToShare: '',
		emailToShareWith: '',
		editable: false,
		noUser: false,
	}


	handleClickOpen = (lesson) => {
		this.setState({ open: true });
		this.setState({lessonToShare: lesson})
	}

	handleClose = () => {
		this.setState({ open: false });
		this.setState({lessonToShare: ''})
		this.setState({emailToShareWith: ''})
		setTimeout(() => {this.setState({confirmDeleteItem: ''})}, 200)
	}

	handleShare = event => {
		this.setState({
			emailToShareWith: event.target.value,
		});
	}

	handleEditable = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	handleEditableCancel = () => this.setState({ editable: false });


	deleteLesson = () => {
		const { firebase, profile, index, lessonID, lessonTitle, lesson } = this.props
		const lessonIDs = { ...profile.lessonIDs }
		lessonIDs[lessonID] = undefined
		delete lessonIDs[lessonID]
		firebase.updateProfile(
			{ lessonIDs }
		)
		this.setState({
			confirmDeleteItem: ''
		})
		let sharedUsers = firebase.database().ref(`lessons/${lessonID}/sharedWith`)
		sharedUsers.once('value')
			.then(snapshot => {
				return snapshot.val()
				&& Object.keys(snapshot.val()) ?
					Object.keys(snapshot.val()).map(userId => {
						return firebase.database()
							.ref(`users/${userId}/lessonsSharedWithMe/${lessonID}`)
					})
					:
					null
			})
			.then(users => {
				users && users.forEach(user => user.remove())
			})

		firebase.database().ref(`lessons/${lessonID}`).remove()
	}

	shareLesson = (lesson, name, email, emailToShareWith = '', editable) => {

		let userToShareWith =
			this.props.firebase.database()
				.ref('users')
				.orderByChild('email')
				.equalTo(emailToShareWith)

		userToShareWith.once('value')
			.then(snapshot => {
				return snapshot.val() && Object.keys(snapshot.val())[0] ? Object.keys(snapshot.val())[0] : null
			})
			.then(userId => {
				if (userId === null) { return }
				userToShareWith = this.props.firebase.database().ref(`users/${userId}/lessonsSharedWithMe`)
				userToShareWith.update({
					[this.props.lessonID] : lesson.title
				})
				this.props.firebase.database().ref(`lessons/${this.props.lessonID}/sharedWith`).update({
					[userId]: {
						email: emailToShareWith,
						canEdit: editable
					}
				})
			})

		}

	render() {

		const { firebase, profile, index, lessonID, lessonTitle, lesson } = this.props
		// const thisLesson = isLoaded(lessons) && !isEmpty(lessons) ?
		// 		lessons[lesson] ? lessons[lesson] : {}
		// 	: {}

		return (

			<Card elevation={0} className="project">
				<div className="project-card-top">
					<CardHeader
						avatar={
							<Avatar
								aria-label="Owner"
								alt="owner"
							>
								{isLoaded(lesson) && !isEmpty(lesson)
									? `${lesson.ownerName.split(' ').map(word => word[0]).join('')}` : "#"}
							</Avatar>
						}
						title={
							<div>
								<Typography type='title'>
									{lessonTitle}
								</Typography>
								<Typography type='body2'>
									{isLoaded(lesson) && !isEmpty(lesson)
										? (
											`Subject: ${lesson.subject}`
										): ('')}
								</Typography>
							</div>
						}
						subheader={isLoaded(lesson) && !isEmpty(lesson)
							? (
								`Last edit: ${lesson.dateModified}`
							): ('')}
					/>

					<CardActions>
							<div>
								<Link to={{
									pathname: '/planner',
									state: {
										currentLesson: isLoaded(lesson) ?
											isEmpty(lesson) ? '' : lesson.title : '',
										currentLessonID: lessonID
									}
								}}>
									<IconButton className="dashboard-button" color='default'>
										<EditIcon/>
									</IconButton>
								</Link>
								<IconButton className="dashboard-button"
								            color='default'
								            onClick={() => this.setState({
									            confirmDeleteItem: index
								            }, () => this.handleClickOpen(lesson))}
								>
									<DeleteIcon/>
								</IconButton>


								<IconButton
									className="dashboard-button"
									color='default'
									onClick={() => this.handleClickOpen(lesson)}
								>
									<ShareIcon/>
								</IconButton>


								<IconButton
									className="dashboard-button"
									onClick={() => {
										exportToPDF(lesson)
									}}
								>
									<DownloadIcon/>
								</IconButton>
							</div>
						<Dialog
							open={this.state.open}
							onClose={() => {
								this.handleClose()
								this.handleEditableCancel()
							}}
							aria-labelledby="share-dialog-title"
							aria-describedby="share-dialog-description"
						>
							<div className="sharing-dialog">
								{this.state.confirmDeleteItem === index ? (
									<div>
										<Typography type='display1' gutterBottom>
											Confirm Delete
										</Typography >
										<Button raised
										        onClick={() => {
											        this.deleteLesson()
											        this.handleClose()
										        }}
										        style={{
											        color: 'white',
											        backgroundColor: 'red',
											        marginRight: '15px'
										        }}>
											Delete
										</Button>
										<Button raised
										        color="primary"
										        onClick={() => {
											        this.handleClose()
										        }}
										>
											Cancel
										</Button>
									</div>
								) : (
									<div>
										<DialogTitle id="share-dialog-title">{"Share Project"}</DialogTitle>
										<DialogActions>
											<FormGroup>
												<TextField
													id="multiline-flexible"
													label={"Email Address"}
													value={this.state.emailToShareWith}
													onChange={this.handleShare}
													margin="normal"
												/>

												<FormControlLabel
													control={
														<Checkbox
															checked={this.state.editable}
															onChange={this.handleEditable('editable')}
															value="editable"
														/>
													}
													label="User may edit?"
												/>
												<Button onClick={() => {
													this.handleEditableCancel()
													this.handleClose()
												}} color="primary">
													Cancel
												</Button>
												<Button onClick={() => {
													this.shareLesson(
														this.state.lessonToShare,
														profile.displayName,
														profile.email,
														this.state.emailToShareWith,
														this.state.editable
													)
													this.handleEditableCancel()
													this.handleClose()
												}} color="primary" autoFocus>
													Share
												</Button>
											</FormGroup>

										</DialogActions>
									</div>
								)}
							</div>

						</Dialog>
					</CardActions>
				</div>

			</Card>



		);
	}
}


const enhance = compose(
	firebaseConnect(props => ([
		{
			path: `lessons/${props.lessonID}`,
			storeAs: props.lessonID
		},
	])),
	connect(
		(state, props) => ({
			lesson: state.firebase.data[props.lessonID]
		})
	)
)
export default enhance(MyProjects)

