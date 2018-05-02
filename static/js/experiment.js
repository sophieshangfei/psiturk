/*jshint esversion: 6*/

async function initializeExperiment() {
  console.log('updated');
  console.log('initializeExperiment');
  console.log('data');

	BONUS = 0;
	BONUS_RATE = 0.01;
	GUESS = undefined;
	NUMBER = 123;

  
  jsPsych.pluginAPI.preloadImages(['static/images/population.png',
                                   'static/images/yellow.png',
                                   'static/images/blue.png']);
	
	var instruction = {
		type: "instructions",
		pages: [
			// `
			// 	<h1>Welcome</h1>
			// 	Welcome to the experiment. Click next to begin.
			// `,
			`
				<h1>Instructions</h1>
				You are going to observe two groups of robots. One group comes from
				Kizik Land. The other group comes from Daxby Land. For this
				experiment, we try to draw a random sample from the robot population.
				In the robot world, Kizik Land is less populated, and as such, robots
				from Kizik Land occur less frequently in the pictures you will see.
			`
		],
		show_clickable_nav: true
	};


	var introduction = {
		type: 'single-stim',
		stimulus: "static/images/population.png",
		choices: ["y", "n"],
		prompt: '<p class="center-content">Each circle represents one robot. Observe that there are more robots from Daxby Land. <br> Press y when you are ready.</p>'
	};


	/* load JSON file */
	var stimuli = (function() {
		var json = null;
		$.ajax({
			'async': false,
			'global': false,
			'url': "static/condition_stimuli.json",
			'dataType': "json",
			'success': function (data) {
				json = data;
			}
		});
		return json;
	})();


	var secondary_task_q = ['Please type in the number'];
	var secondary_task = {
		type: "survey-text-force",
		preamble: function() {
			var digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
			NUMBER = jsPsych.randomization.sample(digits, 7, true).join("");
			psiturk.recordUnstructuredData('number', NUMBER);
			var number = "<p style= 'color: blue; font-size: 48px;'>" + NUMBER + "</p>";
			return number + "<p>Memorize the digits shown above. We will ask you to recall these digits at the end of the experiment. Please don't write them down.</p>";
		},
		questions: secondary_task_q,
		is_html: true,
		required: [true]
	};

	var check_secondary = {
		type: 'survey-text-force',
		preamble: '<h1>Memory Check</h1>',
		questions: ['Please enter the number you were asked to memorize earlier.'],
		on_finish: function(data) {
			GUESS = data.responses.Q0;
			psiturk.recordUnstructuredData('guess', GUESS);
		}
	};

	var check_secondary_feedback = {
		type: 'text',
		text: function() {
			var correct = GUESS == NUMBER;
			var acc = correct ?
				"<strong style='color: green'>Correct!</strong>" :
				"<strong style='color: red'>Incorrect!</strong>";
			return `
				${acc}<br>
				The number was ${NUMBER}. Please keep the number in memory because we
				will ask you to recall it one more time.
			`;

		}
	};



	var bonus_instruction = {
		type: "instructions",
		pages: [
			`<p>For the following tasks, you will be asked to make some predictions.</p>
			<p>You will receive a bonus of <strong> 1 cent </strong> for each correct prediction`
		],
		show_clickable_nav: true
	};

	var test = {
		type: "robot",
		timeline: stimuli,
		prompt: `<p class="center-content">
			Where is this robot from?<br>
			Press <b>D</b> for Daxby Land or <b>B</b> for Kizik Land.
			</p>`,
		choices: ['b', 'd'],
		randomize_order: true
	};
	console.log("test");
//
	var recall_q = ["Please write down the digits shown to you at the beginning of the experiment."];

	var recall = {
		type: 'survey-text',
		questions: recall_q
	};


	var questions = {
		type: 'slider',
		prompt: ["<p>Out of 100 robots from Daxby Land, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>", "<p>Out of 100 robots from Kizik Land, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>"],
	};

	var goodbye = {
		type: "instructions",
		pages: function() {
			return ['<p>Thanks so much for participating in this research.</p>' + `Your final bonus is $${BONUS.toFixed(2)}`];
		},
		show_clickable_nav: true
	};


  /////////////////////////
  // Experiment timeline //
  /////////////////////////

	var condition = 1;
	// if (condition == 1){
// 			timeline.push(instruction, introduction, secondary_task, bonus_instruction, test, recall, questions, goodbye);
// 	} else {
// 		timeline.push(instruction, introduction, bonus_instruction, test, questions, goodbye);
// 	}
	timeline = [
		check_secondary,
		check_secondary_feedback,
		instruction,
		introduction,
		secondary_task,
		bonus_instruction,
		test,
		recall,
		questions,
		goodbye
	];

  return startExperiment({
    timeline,
  });
}


