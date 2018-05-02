/*jshint esversion: 6*/

async function initializeExperiment() {
  console.log('updated');
  console.log('initializeExperiment');
  console.log('data');

	BONUS = 0;
	BONUS_RATE = 0.01;
	GUESSES = []
	NUMBER = 123;

  
  psiturk.preloadImages(['static/images/population.png',
                         'static/images/yellow.png',
                         'static/images/blue.png']);

  var next = '<br><br>Press <b>n</b> to continue.';
	
	var instruction = {
		type: "instructions",
		pages: [
			`
				<h1>Instructions</h1>

				In this experiment, you will see pictures of robots and make
				predictions about them.

				There are two groups of robots. One group comes from Kizik Land. The
				other group comes from Daxby Land. On each trial in the experiment,
				you will see a picture of a robot and predict which land it comes from.
			`,
			`
				<h1>Instructions</h1>

				As illustrated in the image below, Daxby Land is more populated than
				Kizik Land. Each dot represents one robot. Each robot you see in the
				experiment will be randomly drawn from the whole population, so you
				should expect to see twice as many robots from Daxby Land as robots
				from Kizik Land.

				<img src='static/images/population.png' id='jspsych-single-stim-stimulus'>
			`,
			`
				<h1>Instructions</h1>

				To make the experiment more fun, you will be paid a bonus based on how
				accurate your predictions are. <b>You will earn 1 cent for each
				correct prediction</b>. There is no penalty for an incorrect
				prediction.
			`
		],
		show_clickable_nav: true
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

	stimuli = _.shuffle(stimuli)

	var stimuli_1 = stimuli.slice (0, 8)
	var stimuli_2 = stimuli.slice (9, 17)
	

	var memory_task = {
		type: "survey-text-force",
		preamble: function() {
			psiturk.finishInstructions();
			var digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
			NUMBER = jsPsych.randomization.sample(digits, 7, true).join("");
			psiturk.recordUnstructuredData('number', NUMBER);
			var number = "<p style= 'color: blue; font-size: 48px;'>" + NUMBER + "</p>";
			return `
				<h1>Remember this number!</h1>

				${number}

				Please memorize the digits shown above. We will ask you to recall
				these digits at the end of the experiment. 
				<p>
				In this experiment, we are
				interested in how memory affects your predictions. So please do not
				cheat by writing the number down. Your bonus does <b>not</b> depend on
				correctly recalling the number.

			`;
		},
		questions: ['Please enter the number here.'],
		is_html: true,
		required: [true]
	};

	var check_memory = {
		type: 'survey-text-force',
		preamble: '<h1>Memory Check</h1>',
		questions: ['Please enter the number you were asked to memorize earlier.'],
		on_finish: function(data) {
			GUESSES.push(data.responses.Q0);
		}
	};

	var check_memory_feedback = {
		type: "button-response",
		is_html: true,
		choices: ['Continue'],
		button_html: '<button class="btn btn-primary btn-lg">%choice%</button>',
		stimulus: function() {
			var correct = GUESSES[0] == NUMBER;
			var acc = correct ?
				"<strong style='color: green'>Correct!</strong>" :
				"<strong style='color: red'>Incorrect!</strong>";
			return `
				${acc}<br>
				The number was <b>${NUMBER}</b>.<br>
				Please keep the number in memory because we will ask you to recall it again.
			`;

		}
	};



	var test_1 = {
		type: "robot",
		timeline: stimuli_1,
		prompt: `<p class="center-content">
			Where is this robot from?<br>
			Press <b>D</b> for Daxby Land or <b>K</b> for Kizik Land.
			</p>`,
		choices: ['b', 'd'],
		randomize_order: true
	};
	
	var test_2 = {
		type: "robot",
		timeline: stimuli_2,
		prompt: `<p class="center-content">
			Where is this robot from?<br>
			Press <b>D</b> for Daxby Land or <b>K</b> for Kizik Land.
			</p>`,
		choices: ['b', 'd'],
		randomize_order: true
	};

	var question_k = {
		type: 'slider',
		prompt: ["<p>Out of 100 robots from <b>Kizik Land</b>, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>"]
	};
	
	var question_d = {
		type: 'slider',
		prompt: ["<p>Out of 100 robots from <b>Daxby Land</b>, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>"]
	};

	var goodbye = {
		type: "button-response",
		is_html: true,
		stimulus: function() {
			return ['<p>Thanks so much for participating in this research.</p>' + `Your final bonus is $${BONUS.toFixed(2)}`];
		},
		choices: ['Complete HIT'],
		button_html: '<button class="btn btn-primary btn-lg">%choice%</button>'
	};


  /////////////////////////
  // Experiment timeline //
  /////////////////////////

	var condition = 1;
	// if (condition == 1){
// 			timeline.push(instruction, introduction, memory_task, bonus_instruction, test, recall, questions, goodbye);
// 	} else {
// 		timeline.push(instruction, introduction, bonus_instruction, test, questions, goodbye);
// 	}
	timeline = [
		instruction,
		memory_task,
		test_1,
		check_memory,
		check_memory_feedback,
		test_2,
		check_memory,
		question_k,
		question_d,
		goodbye
	];

  return startExperiment({
    timeline,
  });
}


