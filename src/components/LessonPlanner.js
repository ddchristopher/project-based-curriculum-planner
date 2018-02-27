import React, { Component } from 'react';
import LessonMap from './LessonMap'
import WorkSpace from './WorkSpace'
import Resources from './Resources'



class LessonPlanner extends Component {
	state = {
		currentQuestion: 0
	}

	changeQuestion = (question) => {
		this.setState({
			currentQuestion: question
		})
	}


	componentWillReceiveProps(nextProps) {
		if (
			nextProps.currentStage.stageIndex !== this.props.currentStage.stageIndex
		)
		{
			this.setState({
				currentQuestion: 0
			})
		}
	}

	render() {
		const { currentStage, currentLesson, sharedEdit, currentLessonID } = this.props
		const { currentQuestion } = this.state

		return (
			<div>
				<div className="lessonBoard">
					<div className="lessonMap">
						<LessonMap
							currentStage={currentStage}
							currentQuestion={{
								questionIndex: currentQuestion,
								currentQuestion: currentStage.currentStage[currentQuestion]
							}}
							currentLesson={currentLesson}
							changeQuestion={(question) => this.changeQuestion(question)}
							sharedEdit={sharedEdit}

						/>
					</div>

					<div className="workSpace">
						<WorkSpace
							currentStage={currentStage}
							currentQuestion={{
								questionIndex: currentQuestion,
								currentQuestion: currentStage.currentStage[currentQuestion]
							}}
							currentLesson={currentLesson}
							currentLessonID={currentLessonID}
							sharedEdit={sharedEdit}

						/>
					</div>

					<div className="resources">
						<Resources
							currentStage={currentStage}
							currentQuestion={{
								questionIndex: currentQuestion,
								currentQuestion: currentStage.currentStage[currentQuestion]
							}}
							sharedEdit={sharedEdit}
						/>
					</div>
				</div>
			</div>
		);
	}
}



export default LessonPlanner