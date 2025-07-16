import { setUpProfile } from './arduino/profile';
import * as Blockly from 'blockly';
import { Arduino, definitions, reset, setups } from './arduino/util';

setUpProfile(); // Initialize the default profile

const reservedKeywords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';

Arduino.addReservedWords(
	// http://arduino.cc/en/Reference/HomePage
	reservedKeywords
);

Arduino.init = (workspace) => {
	reset();
	if (!Arduino.nameDB_) {
		Arduino.nameDB_ = new Blockly.Names(reservedKeywords);
	} else {
		Arduino.nameDB_.reset();
	}
	Arduino.nameDB_.setVariableMap(workspace.getVariableMap());

	let defvars = new Set<string>();
	let variables = workspace.getVariableMap().getAllVariables();
	for (let i = 0; i < variables.length; i++) {
		variables[i].setType('int'); // variables[i].name.startsWith("str:")? 'String': variables[i].name.startsWith("float:")? 'float': 'int';
		defvars.add(
			(variables[i].getType() || 'int') +
			' ' +
			Arduino.nameDB_.getName(variables[i].getName(), Blockly.Variables.CATEGORY_NAME) +
			(variables[i].getType() === 'String' ? ';\n' : ' = 0;\n'));
	}

	let vars: string[] = [];
	defvars.forEach(e => vars.push(e));

	definitions['variables'] = vars.join('\n');
};


Arduino.finish = (code) => {
	// Indent every line.
	code = '  ' + code.replace(/\n/g, '\n  ');
	code = code.replace(/\n\s+$/, '\n');
	if(!code.includes('void loop()'))
		code = 'void loop() {\n' + code + '\n}';

	// Convert the definitions dictionary into a list.
	let imports = [];
	let extracted_definitions = [];
	for (let name in definitions) {
		let def = definitions[name];
		if (def.match(/^#include/)) {
			imports.push(def);
		} else {
			extracted_definitions.push(def);
		}
	}

	// Convert the setups dictionary into a list.
	let extracted_setups = [];
	for (let name in setups) {
		extracted_setups.push(setups[name]);
	}

	let allDefs = '';
	if(!code.includes('void setup()'))
		allDefs = `${imports.join('\n')}\n\n${extracted_definitions.join('\n')}\nvoid setup() {\n ${extracted_setups.join('\n  ')} \n}\n\n`;

	return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

Arduino.scrubNakedValue = (line) => {
	return line + ';\n';
};


Arduino.scrub_ = (block, code) => {
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