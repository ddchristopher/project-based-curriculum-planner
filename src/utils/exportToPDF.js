import * as jsPDF  from 'jspdf'


export default function exportToPDF (lesson) {
	const specialElementHandlers = {
		'#myId': function(element, renderer){
			return true;
		},
	};

	let doc = new jsPDF();
	//doc.text(20, 20, 'Hello world.');
	//doc.addPage('a4','p');
	const emptyLessonUnit = [{answers: [{answer: '', content: ''}], question: ''}]
	let stage1 = lesson.stage1 ? lesson.stage1 : emptyLessonUnit
	let stage2 = lesson.stage2 ? lesson.stage2 : emptyLessonUnit
	let stage3 = lesson.stage3 ? lesson.stage3 : emptyLessonUnit
	let stage4 = lesson.stage4 ? lesson.stage4 : emptyLessonUnit

	function formatStages(stage) {
		let questions = ''
		let answers = ''
		for (let question of stage) {
			question = question ? question : {answers: [{answer: '', content: ''}], question: ''}
			question.answers.forEach((answer) => {
				answers = answers.concat(`
				<h4>${answer.content}</h4>
				<p>${answer.answer}</p>
			`)
			})
			questions = questions.concat(`
				<h3>${question.question}</h3>
				${answers}
			`)
			answers = ''
		}

		return questions
	}

	stage1 = formatStages(stage1)
	stage2 = formatStages(stage2)
	stage3 = formatStages(stage3)
	stage4 = formatStages(stage4)


	const page1 =
		`
<div>
	<h1>${lesson.title}</h1>
	<h2>Stage 1: Building the field</h2>
	<div>${stage1}</div>	
		
</div>
`;

	const page2 =
		`
<div>
	<h1>${lesson.title}</h1>
	<h2>Stage 2: Introducing and Practicing Academic Discourse and Skills</h2>	
	<div>${stage2}</div>
</div>
`;

	const page3 =
		`
<div>
	<h1>${lesson.title}</h1>
	<h2>Stage 3: Joint Construction</h2>
	<div>${stage3}</div>	
		
</div>
`;

	const page4 =
		`
<div>
	<h1>${lesson.title}</h1>
	<h2>Stage 4: Independent Production & Assessment</h2>
	<div>${stage4}</div>	
		
</div>
`;

	doc.fromHTML(
		page1, 15, 15, {
			'elementHandlers': specialElementHandlers
		}
	);
	doc.addPage('a4','p');
	doc.fromHTML(
		page2, 15, 15, {
			'elementHandlers': specialElementHandlers
		}
	);
	doc.addPage('a4','p');
	doc.fromHTML(
		page3, 15, 15, {
			'elementHandlers': specialElementHandlers
		}
	);
	doc.addPage('a4','p');
	doc.fromHTML(
		page4, 15, 15, {
			'elementHandlers': specialElementHandlers
		}
	);

	doc.save('a4.pdf')



}
