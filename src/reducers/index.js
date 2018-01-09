import {CURRENT_LESSON } from "../actions/types";

const lesson = {
	title: [],
	owner: '',
	collaborators: '',
	stage1: [],
	stage2: [],
	stage3: [],
	stage4: [],
}

export function currentLesson (state = {...lesson}, action) {
	const { question, answer } = action
	switch (action.type) {
		case CURRENT_LESSON :
			return {
				...state,
				[question]: {
					answer: answer
				}
			}
		default :
			return state
	}
}
