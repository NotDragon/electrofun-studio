import { profile } from "./profile";
import * as Blockly from 'blockly';
import { Arduino, Order } from './util';

export let arduinoText: any = {
	// Text value.
	text: function () {},
};

const quote = (string: string) => {
	// TODO: This is a quick hack.  Replace with goog.string.quote
	string = string
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\\n')
		.replace(/\$/g, '\\$')
		.replace(/'/g, "\\'");
	return '\"' + string + '\"';
};

Arduino.forBlock['text'] = (block) => {
	// Text value.
	var code = quote(block.getFieldValue('TEXT'));
	return [code, Order.ATOMIC];
};

Arduino.forBlock['text_multiline'] = (block) => {
	// Text value.
	var code = quote(block.getFieldValue('TEXT'));
	return [code, Order.ATOMIC];
};
