import { CURRENT_LESSON } from "./types";

export function changeQuestion(question, answer) {
	return {
		type: CURRENT_LESSON,
		question,
		answer
	}
}