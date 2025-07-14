import { profile, setUpProfile } from './arduino/profile';
import * as Blockly from 'blockly';
import { Arduino } from './arduino/util';

setUpProfile(); // Initialize the default profile

Arduino.addReservedWords(
	// http://arduino.cc/en/Reference/HomePage
	'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts'
);

/**
 * Order of operation ENUMs.
 *
 */

Arduino.ORDER_ATOMIC = 0; // 0 "" ...
Arduino.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Arduino.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Arduino.ORDER_ADDITIVE = 4; // + -
Arduino.ORDER_SHIFT = 5; // << >>
Arduino.ORDER_RELATIONAL = 6; // is is! >= > <= <
Arduino.ORDER_EQUALITY = 7; // == != === !==
Arduino.ORDER_BITWISE_AND = 8; // &
Arduino.ORDER_BITWISE_XOR = 9; // ^
Arduino.ORDER_BITWISE_OR = 10; // |
Arduino.ORDER_LOGICAL_AND = 11; // &&
Arduino.ORDER_LOGICAL_OR = 12; // ||
Arduino.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Arduino.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Arduino.ORDER_NONE = 99; // (...)

/*
 * Arduino Board profiles
 *
 */
//set default profile to arduino standard-compatible board

//alert(profile.default.digital[0]);

Arduino.init = function (workspace) {
	Arduino.definitions_ = Object.create(null);
	Arduino.setups_ = Object.create(null);

	if (!Arduino.nameDB_) {
		Arduino.nameDB_ = new Blockly.Names(Arduino.RESERVED_WORDS_);
	} else {
		Arduino.nameDB_.reset();
	}

	let defvars = [];
	let variables = workspace.getAllVariables();

	for (let i = 0; i < variables.length; i++) {
		variables[i].type = 'int'; // variables[i].name.startsWith("str:")? 'String': variables[i].name.startsWith("float:")? 'float': 'int';
		defvars[i] =
			(variables[i].type || 'int') +
			' ' +
			Arduino.nameDB_.getName(variables[i].id, Blockly.Variables.VAR_LETTER_OPTIONS) +
			(variables[i].type === 'String' ? ';\n' : ' = 0;\n');
	}

	Arduino.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Arduino.finish = function (code) {
	// Indent every line.
	code = '  ' + code.replace(/\n/g, '\n  ');
	code = code.replace(/\n\s+$/, '\n');
	code = 'void loop() \n{\n' + code + '\n}';

	// Convert the definitions dictionary into a list.
	let imports = [];
	let definitions = [];
	for (let name in Arduino.definitions_) {
		let def = Arduino.definitions_[name];
		if (def.match(/^#include/)) {
			imports.push(def);
		} else {
			definitions.push(def);
		}
	}

	// Convert the setups dictionary into a list.
	let setups = [];
	for (let name in Arduino.setups_) {
		setups.push(Arduino.setups_[name]);
	}

	let allDefs =
		imports.join('\n') +
		'\n\n' +
		definitions.join('\n') +
		'\nvoid setup() \n{\n  ' +
		setups.join('\n  ') +
		'\n}' +
		'\n\n';

	return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Arduino.scrubNakedValue = function (line) {
	return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Arduino.quote_ = function (string) {
	// TODO: This is a quick hack.  Replace with goog.string.quote
	string = string
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\\n')
		.replace(/\$/g, '\\$')
		.replace(/'/g, "\\'");
	return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Arduino.scrub_ = function (block, code) {
	if (code === null) {
		// Block has handled code generation itself.
		return '';
	}
	let commentCode = '';
	// Only collect comments for blocks that aren't inline.
	if (!block.outputConnection || !block.outputConnection.targetConnection) {
		// Collect comment for this block.
		let comment = block.getCommentText();
		if (comment) {
			commentCode += Arduino.prefixLines(comment, '// ') + '\n';
		}
		// Collect comments for all value arguments.
		// Don't collect comments for nested statements.
		for (let x = 0; x < block.inputList.length; x++) {
			if (block.inputList[x].type == Blockly.INPUT_VALUE) {
				let childBlock = block.inputList[x].connection.targetBlock();
				if (childBlock) {
					let comment = Arduino.allNestedComments(childBlock);
					if (comment) {
						commentCode += Arduino.prefixLines(comment, '// ');
					}
				}
			}
		}
	}
	let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
	let nextCode = Arduino.blockToCode(nextBlock);
	return commentCode + code + nextCode;
};

import './arduino/base';
import './arduino/control';
import './arduino/logic';
import './arduino/math';
import './arduino/procedures';
import './arduino/text';
import './arduino/variables';

export { Arduino };