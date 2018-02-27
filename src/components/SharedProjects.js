import React, { Component } from 'react';
import {
	Link,
	Redirect,
} from 'react-router-dom'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import exportToPDF from '../utils/exportToPDF'
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete'
import DownloadIcon from 'material-ui-icons/FileDownload'
import EditIcon from 'material-ui-icons/Edit'
import Avatar from 'material-ui/Avatar';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from 'material-ui/Dialog';


class SharedProjects extends Component {

	state = {
		confirmDeleteItem: '',
		open: false,
	}

	handleClickOpen = (lesson) => {
		this.setState({ open: true });
		this.setState({lessonToShare: lesson})
	}

	handleClose = () => {
		this.setState({ open: false });
		setTimeout(() => {this.setState({confirmDeleteItem: ''})}, 200)
	}

	deleteLesson = () => {
		const { firebase, profile, index, lessonID, lessonTitle, uid, lesson } = this.props
		const lessonsSharedWithMe = { ...profile.lessonsSharedWithMe }
		lessonsSharedWithMe[lessonID] = undefined
		delete lessonsSharedWithMe[lessonID]
		firebase.updateProfile(
			{ lessonsSharedWithMe }
		)
		firebase.database().ref(`lessons/${lessonID}/sharedWith/${uid}`).remove()
		this.setState({
			confirmDeleteItem: ''
		})
	}

	render() {

		const { firebase, profile, index, lessonID, lessonTitle, uid, lesson } = this.props

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
								{isLoaded(lesson) && !isEmpty(lesson)
								&& lesson.sharedWith
								&& lesson.sharedWith[uid].canEdit ? (
									<Link to={{
										pathname: '/planner',
										state: {
											currentLessonID: lessonID,
											currentLessonTitle: lessonTitle,
											sharedEdit: true
										}
									}}>
										<IconButton className="dashboard-button" color='default'>
											<EditIcon/>
										</IconButton>
									</Link>
								) : (
									<div></div>
								)}

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
							}}
							aria-labelledby="share-dialog-title"
							aria-describedby="share-dialog-description"
						>
							<div className="sharing-dialog">
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
export default enhance(SharedProjects)

