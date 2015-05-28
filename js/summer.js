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
	about: "[[u;;]General Information]\n\nThe CSC Cyber Security Camp is a summer enrichment program run by the computer science team at the California Academy of Mathematics and Science (CAMS). The program aims to teach middle school students interested in the fields of Electrical Engineering, Cyber Security, or Computer Science about advanced and fascinating topics that are usually never covered in computer science classes. Topics in this session include: Programming, Forensics, Exploitation (Web & Binary), Cryptography, and Reconnaissance. After comprehensive lessons, we will allow the students to demonstrate their skills in challenges that we have set up. On the last day of the camp, students will compete in a full length Capture the Flag (CTF) hacking competition using the skills they've learned with prizes awarded to top placing teams.",
	qualifications: "[[u;;]Our Qualifications]\n\nThe CAMS Computer Science Club (CSC) is a relatively new club at the school. However, we have already had many impressive accomplishments by our members. In 2013, our team placed first in the 10th annual national High School Forensics competition at NYU Polytechnic Institute. In 2014, we returned as a national level qualifying team. This year, we ran CAMS CTF, an international computer science and hacking competition that attracted over 2000 students from around the world",
	date: "[[u;;]Date and Time]\n\nThis summer session will run from 7/1/2015 to 7/6/2015 daily from 9:00 A.M. to 3:00 P.M. Did we mention that lunch is provided? Yup.",
	location: "[[u;;]Location]\n\nAll of this exciting fun will take place at the California Academy of Mathematics and Science.\n\n1000 East Victoria Street\nCarson, CA 90747\nRoom 6010\n\nThe cool part is, we are located inside of the CSUDH campus! We'll be at the front to meet everyone the first day. If you get lost, call us at 626-322-6929 and we will guide you to our location. Google Maps will guide you as well.",
	reqs: "[[u;;]Prerequisites]\n\nYou do not need ANY prior knowledge in computer science to participate. We will teach you everything! A personal laptop is preferable but school computers will be available for use as well",
	contact: "[[u;;]Contact Us]\n\nMore questions? We'd love to answer them. Email us!",
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
		usage: 'The function accepts the optional argument [aspect]. Use [[b;;]info &#91;aspect&#93;] to display information.\nAccepted arugments include: about, qualifications, date, location, reqs, contact.\nExample: info about',
		run: function(term, args) {
			if (args.length === 0) {
				for (var section in info) {
					fill_line(term);
					term.echo('\n' + info[section] + '\n');
				}
				fill_line(term);
			} else if (args.length > 0 && info.hasOwnProperty(args[0])) {
				fill_line(term);
				term.echo('\n' + info[section] + '\n');
				fill_line(term);
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
		greetings: 	'[[bg;#0f0;]Welcome to (CSC)^2 Shell]\n' +
					'Type "help" to see a list of available commands or "info" to get information about this program.\n' +
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