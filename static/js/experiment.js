async function initializeExperiment() {
  console.log('updated');
  console.log('initializeExperiment');
  console.log('data');

	BONUS = 0;
	BONUS_RATE = 0.01;
  
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
		prompt: '<p class="center-content">Each circle represents one robot. <br> Observe that there are more robots from Daxby Land. <br> Press y when you are ready.</p>'
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
			var digit_task = jsPsych.randomization.sample(digits, 7, true).join("");
			var number = "<p style= 'color: blue; font-size: 48px;'>" + digit_task + "</p>";
			return number + "<p>Memorize the digits shown above. We will ask you to recall these digits at the end of the experiment. Please don't write them down.</p>"
		},
		questions: secondary_task_q,
		is_html: true,
		required: [true]
	};

	var bonus_instruction = {
		type: "instructions",
		pages: [
			`<p>For the following tasks, you will be asked to make some predictions.</p>
			<p>You will receive a bonus of <strong> 1 cent </strong> for each correct prediction`
		],
		show_clickable_nav: true
	}

	var test = {
		type: "robot",
		timeline: stimuli,
		prompt: `<p class="center-content">
			Where is this robot from?<br>
			Press <b>D</b> for Daxby Land or <b>K</b> for Kizik Land.
			</p>`,
		choices: ['b', 'd'],
		randomize_order: true
	};

	var recall_q = ["Please write down the digits shown to you at the beginning of the experiment."];

	var recall = {
		type: 'survey-text',
		questions: recall_q
	};

	var d_question = ["<p>Out of 100 robots from Daxby Land, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>"]
	var k_question = ["<p>Out of 100 robots from Kizik Land, how many have a <strong style = 'color: orange; font-weight: bold;'>yellow</strong> body?</p>"]

	var question_d = {
		type: 'slider',
		prompt: d_question
	};
	
	var question_k = {
		type: 'slider',
		prompt: k_question
	};

	var goodbye = {
		type: "instructions",
		pages: function() {
			return ['<p>Thanks so much for participating in this research.</p>' + `Your final bonus is $${BONUS.toFixed(2)}`]
		},
		show_clickable_nav: true
	};


  /////////////////////////
  // Experiment timeline //
  /////////////////////////

	var condition = 1
	// if (condition == 1){
// 			timeline.push(instruction, introduction, secondary_task, bonus_instruction, test, recall, questions, goodbye);
// 	} else {
// 		timeline.push(instruction, introduction, bonus_instruction, test, questions, goodbye);
// 	}
	timeline = [
		instruction,
		introduction,
		secondary_task,
		bonus_instruction,
		test,
		recall,
		question_d,
		question_k,
		goodbye
	];

  return startExperiment({
    timeline,
  });
};


