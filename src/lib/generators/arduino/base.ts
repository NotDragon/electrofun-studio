import { profile } from './profile';
import { Arduino, Order, definitions, setups } from './util';

Arduino.forBlock['base_delay'] = function (block) {
	let delay_time =
		Arduino.valueToCode(block, 'DELAY_TIME', Order.ATOMIC) || '1000';
	let code = 'delay(' + delay_time + ');\n';
	return code;
};

Arduino.forBlock['base_map'] = function (block) {
	let value_num = Arduino.valueToCode(block, 'NUM', Order.NONE);
	let value_dmax = Arduino.valueToCode(block, 'DMAX', Order.ATOMIC);
	let code = 'map(' + value_num + ', 0, 1024, 0, ' + value_dmax + ')';
	return [code, Order.NONE];
};

Arduino.forBlock['inout_buildin_led'] = function (block) {
	let dropdown_stat = block.getFieldValue('STAT');
	setups['setup_output_13'] = 'pinMode(13, OUTPUT);';
	let code = 'digitalWrite(13, ' + dropdown_stat + ');\n';
	return code;
};

Arduino.forBlock['inout_digital_write'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	let dropdown_stat = block.getFieldValue('STAT');
	setups['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n';
	return code;
};

Arduino.forBlock['inout_digital_read'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	setups['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
	let code = 'digitalRead(' + dropdown_pin + ')';
	return [code, Order.ATOMIC];
};

Arduino.forBlock['inout_analog_write'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	//let dropdown_stat = Arduino.getFieldValue('STAT');
	let value_num = Arduino.valueToCode(block, 'NUM', Order.ATOMIC);
	//setups['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
	let code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
	return code;
};

Arduino.forBlock['inout_analog_read'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	//setups['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
	let code = 'analogRead(' + dropdown_pin + ')';
	return [code, Order.ATOMIC];
};

Arduino.forBlock['inout_tone'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	let value_num = Arduino.valueToCode(block, 'NUM', Order.ATOMIC);
	setups['setup_output' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'tone(' + dropdown_pin + ', ' + value_num + ');\n';
	return code;
};

Arduino.forBlock['inout_notone'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	setups['setup_output' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'noTone(' + dropdown_pin + ');\n';
	return code;
};

Arduino.forBlock['inout_highlow'] = function (block) {
	// Boolean values HIGH and LOW.
	let code = block.getFieldValue('BOOL') == 'HIGH' ? 'HIGH' : 'LOW';
	return [code, Order.ATOMIC];
};

/*
//servo
#include <Servo.h>

Servo servo_11;

void setup() {
  servo_11.attach(11);
}

void loop() {
servo_11.write(0);

servo_11.write(150); //0~180
}
*/
Arduino.forBlock['servo_move'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');
	let value_degree = Arduino.valueToCode(block, 'DEGREE', Order.ATOMIC);

	definitions['define_servo'] = '#include <Servo.h>\n';
	definitions['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';\n';
	setups['setup_servo_' + dropdown_pin] =
		'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

	let code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
	return code;
};

Arduino.forBlock['servo_read_degrees'] = function (block) {
	let dropdown_pin = block.getFieldValue('PIN');

	definitions['define_servo'] = '#include <Servo.h>\n';
	definitions['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';\n';
	setups['setup_servo_' + dropdown_pin] =
		'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

	let code = 'servo_' + dropdown_pin + '.read()';
	return code;
};

Arduino.forBlock['serial_print'] = function (block) {
	let content = Arduino.valueToCode(block, 'CONTENT', Order.ATOMIC) || '0';
	//content = content.replace('(','').replace(')','');

	setups['setup_serial_' + profile.default.serial] =
		'Serial.begin(' + profile.default.serial + ');\n';

	let code = 'Serial.println(' + content + ');\n';
	return code;
};
