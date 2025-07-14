import { profile } from "./profile";
import * as Blockly from 'blockly';
import { Arduino } from './util';

export let arduinoText: any = {
	// Text value.
	text: function () {},
};

Arduino.forBlock['text'] = function () {
	// Text value.
	var code = Arduino.quote_(Arduino.getFieldValue('TEXT'));
	return [code, Arduino.ORDER_ATOMIC];
};
