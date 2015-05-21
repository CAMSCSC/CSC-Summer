var challenges = [
	'Challenge 1',
	'Challenge 2',
	'Challenge 3',
	'Challenge 4',
	'Challenge 5',
	'Challenge 6',
];

var solutions = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
];

var info = {
	about: 'This is about.',
	date: 'This is date.',
	location: 'This is location.',
};

var commands = {
	clear: {
		help: 'Clears the terminal.',
		run: function(term) { term.clear() },
	},
	purge: {
		help: 'Resets this terminal.',
		run: function(term) { term.purge(); $('#terminal').remove(); create_terminal(); },
	},
	copyright: {
		help: 'Shows the copyright.',
		run: function(term) { term.echo('&copy; 2015 CAMS CSC\nMade using JQuery Terminal Emulator (under GNU LGPL3)\nAll other source code licensed under the MIT license.\n'); },
	},
	sample: {
		help: 'A collection of sample problems to try.',
		usage: 'The function accepts the required argument [entity] where [entity] is an integer from 1-6.\nUse [[b;;]sample &#91;entity&#93;] to get a sample challenge.\nExample: sample 1',
		run: function(term, args) {
			chal = parseInt(args[0]) - 1;
			if (chal >= 0 && challenges.length >= chal) {
				term.echo(challenges[chal] + '\n');
			} else {
				term.error('Invalid or missing argument. Use "help sample" to get usage help.');
			}
		},
	},
	solve: {
		help: 'Checks if a solution is correct.',
		usage: 'The function accepts the required argument [flag] where [flag] is a string.\nUse [[b;;]solve &#91;flag&#93;] to check if you have obtained the solution to a challenge.\nExample: solve {this_flag}',
		run: function(term, args) {
			var hash, index;
			if (args.length > 0 && args[0].length > 0) {
				var sha = new jsSHA(args[0], "TEXT");
				hash = sha.getHash("SHA-1", "HEX");
			} else {
				term.error('Invalid or missing argument. Use "help solve" to get usage help.');
				return;
			}
			
			index = solutions.indexOf(hash);
			if (index > -1) {
				term.echo('Correct solution to challenge ' + String(index + 1) + '!\n');
			} else {
				term.error('Incorrect solution!');
			}
		},
	},
	info: {
		help: 'Gives info about this summer session.',
		usage: 'The function accepts the required argument [aspect]. Use [[b;;]info &#91;aspect&#93;] to display information.\nAccepted arugments include: about, date, location, reqs.\nExample: info about',
		run: function(term, args) {
			if (args.length > 0 && info.hasOwnProperty(args[0])) {
				term.echo(info[args[0]] + '\n');
			} else {
				term.error('Invalid or missing argument. Use "help info" to get usage help.');
			}
		}
	},
	help: {
		help: 'Displays this help message.',
		usage: 'The function help accepts the optional argument [function].\nUse [[b;;]help &#91;function&#93;] to get specific help for a function.\nExample: help sample',	
		run: function(term, args) {
			if (args.length === 0) {
				term.echo('Below is a list of available commands. Type "help help" to see how to get detailed help for specific functions.');
				var sorted = [];
				for (var command in commands) {
					sorted.push(command);
				}
				sorted.sort();
				for (var i = 0; i < sorted.length; i++) {
					term.echo('[[b;;]' + sorted[i] + ':] ' + commands[sorted[i]].help);
				}
				term.echo('\n');
			} else {
				if (commands[args[0]].hasOwnProperty('usage')) {
					term.echo(commands[args[0]].usage + '\n');
				} else {
					term.echo('This function accepts no arguments.\n');
				}
			}
		},
	}
}

function fill_line(term) {
	term.echo(Array(twidth + 1).join("-"));
}

var twidth;

function create_terminal() {
	$('<div id="terminal" class="terminal"></div>').prependTo('.terminal-wrapper');

	$('#terminal').terminal(function(command, term) {
		twidth = term.cols();
		cmd = $.terminal.parseCommand(command);
		cmd.name = cmd.name.toLowerCase();
		
		try {
			if (commands.hasOwnProperty(cmd.name)) {
				commands[cmd.name].run(term, cmd.args);
			} else {
				throw 42;
			}
		} catch (e) {
			term.error('Invalid command "' + command + '". Type "help" to show the help screen.\n');
			console.log(e);
		}
		
		$('.terminal-wrapper').scrollTop($('.terminal-wrapper').prop("scrollHeight"));
	}, {
		greetings: 	'[[bg;#0f0;]Welcome to CSC Cyber Security Camp]\n' +
					'This is a summer camp for middle school students led by the CAMS Computer Science and Cyber Security Club.\n' +
					'Type "help" to see a list of available commands.\n' +
					'',
		name: 'CSC-Summer',
		exit: false,
		clear: false,
		onBlur: function() { return false; },
		onInit: function(term) { term.resize(); },
		keydown: function() { $('.terminal-wrapper').scrollTop($('.terminal-wrapper').prop("scrollHeight")); },
		prompt: '[[;#0f0;]user@CSC:~$] '});
}

$(document).ready(function() {
	create_terminal();
});