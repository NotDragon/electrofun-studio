import { profile } from './profile';
import * as Blockly from 'blockly';
import { Arduino } from './util';

export let arduinoGrove: any = {
  grove_led: function() {},
  grove_button: function() {},
  grove_rotary_angle: function() {},
  grove_tilt_switch: function() {},
  grove_piezo_buzzer: function() {},
  grove_relay: function() {},
  grove_temporature_sensor: function() {},
  grove_serial_lcd_print: function() {},
  grove_serial_lcd_power: function() {},
  grove_serial_lcd_effect: function() {},
  grove_sound_sensor: function() {},
  grove_pir_motion_sensor: function() {},
  grove_line_finder: function() {},
  grove_ultrasonic_ranger: function() {},
  grove_motor_shield: function() {},
  grove_thumb_joystick: function() {},
  grove_rgb_led: function() {},
  grove_bluetooth_slave: function() {},
};

arduinoGrove.grove_led = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_stat = Arduino.getFieldValue('STAT');
	Arduino.setups_['setup_green_led_' + dropdown_pin] =
		'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n';
	return code;
};

arduinoGrove.grove_button = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	Arduino.setups_['setup_button_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
	let code = 'digitalRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_rotary_angle = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let code = 'analogRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_tilt_switch = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	Arduino.setups_['setup_tilt_switch_' + dropdown_pin] =
		'pinMode(' + dropdown_pin + ', INPUT);';
	let code = 'digitalRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

/*
int buttonPin = 1;
int buzzerPin = 2;

char notes[] = "cdefgabC "; // a space represents a rest
const int length = sizeof(notes); // the number of notes
int beats[length] = { 1,1,1,1,1,1,1,1,1};

int tempo = 300;

void playTone(int tone, int duration) {
  for (long i = 0; i < duration * 1000L; i += tone * 2) {
    digitalWrite(buzzerPin, HIGH);
    delayMicroseconds(tone);
    digitalWrite(buzzerPin, LOW);
    delayMicroseconds(tone);
  }
}

void playNote(char note, int duration) {
  char names[] = { 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'C'};
  int tones[] = { 1915, 1700, 1519, 1432, 1275, 1136, 1014, 956 };

  // play the tone corresponding to the note name
  for (int i = 0; i < length; i++) {
    if (names[i] == note) {
      playTone(tones[i], duration);
    }
  }
}

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(buttonPin,INPUT);
}

void loop() {
  if(digitalRead(buttonPin))
  {
  for (int i = 0; i < length; i++) {
    if (notes[i] == ' ') {
      delay(beats[i] * tempo); // rest
    } else {
      playNote(notes[i], beats[i] * tempo);
    }

    // pause between notes
    delay(tempo / 20);
  }
  }
}
*/
arduinoGrove.grove_piezo_buzzer = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_stat = Arduino.getFieldValue('STAT');
	Arduino.setups_['setup_piezo_buzzer_' + dropdown_pin] =
		'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n';
	return code;
};

arduinoGrove.grove_relay = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_stat = Arduino.getFieldValue('STAT');
	Arduino.setups_['setup_relay_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
	let code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n';
	return code;
};

arduinoGrove.grove_temporature_sensor = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	/*
  a=analogRead(0);
  resistance=(float)(1023-a)*10000/a;
  temperature=1/(log(resistance/10000)/B+1/298.15)-273.15;
  */
	let code =
		'round(' +
		'(1/(log((float)(1023-analogRead(' +
		dropdown_pin +
		'))*10000/analogRead(' +
		dropdown_pin +
		'))/10000)/3975+1/298.15)-273.15' +
		')';
	return [code, Arduino.ORDER_ATOMIC];
};

/*
#include <SerialLCD.h>
#include <SoftwareSerial.h> //Arduino is a must
SerialLCD slcd(11,12);//Arduino is a must, assign soft serial pins

void setup()
{
  slcd.begin();// set up :
}

void loop()
{
  slcd.backlight();// Turn on the backlight: //noBacklight
  slcd.setCursor(0,0); // set the cursor to (0,0):
  slcd.print("  Seeed Studio"); // Print a message to the LCD.
  slcd.setCursor(0,1); //line 2
  slcd.print("   Starter kit   ");
  delay(5000);
  //slcd.scrollDisplayLeft();//scrollDisplayRight/autoscroll/
  //slcd.clear();
  //Power/noPower
}
*/

const _get_next_pin = function (dropdown_pin: string){
	let NextPIN = dropdown_pin;
	if (parseInt(NextPIN)) {
		NextPIN = (parseInt(dropdown_pin) + 1).toString();
	} else {
		NextPIN = 'A' + (parseInt(NextPIN.slice(1, NextPIN.length)) + 1);
	}
	//check if NextPIN in bound
	let pinlen = profile.default.digital.length;
	let notExist = true;
	for (let i = 0; i < pinlen; i++) {
		if (profile.default.digital[i][1] == NextPIN) {
			notExist = false;
		}
	}
	if (notExist) {
		alert('Grove Sensor needs PIN#+1 port, current setting is out of bound.');
		return '0';
	} else {
		return NextPIN;
	}
};

arduinoGrove.grove_serial_lcd_print = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let text = Arduino.valueToCode(Arduino, 'TEXT', Arduino.ORDER_UNARY_POSTFIX) || "''";
	let text2 = Arduino.valueToCode(Arduino, 'TEXT2', Arduino.ORDER_UNARY_POSTFIX) || "''";
	let delay_time =
  Arduino.valueToCode(Arduino, 'DELAY_TIME', Arduino.ORDER_ATOMIC) || '1000';
	/*if(text.length>16||text2.length>16){
      alert("string is too long");
  }*/
	Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
	Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
	//generate PIN#+1 port
	let NextPIN = _get_next_pin(dropdown_pin);

	Arduino.definitions_['var_lcd_' + dropdown_pin] =
		'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';

	Arduino.setups_['setup_lcd_' + dropdown_pin] = 'slcd_' + dropdown_pin + '.begin();\n';
	let code = 'slcd_' + dropdown_pin + '.backlight();\n';
	code += 'slcd_' + dropdown_pin + '.setCursor(0,0);\n';
	code += 'slcd_' + dropdown_pin + '.print(' + text + ');\n'; //text.replace(new RegExp('\'',"gm"),'')
	code += 'slcd_' + dropdown_pin + '.setCursor(0,1);\n';
	code += 'slcd_' + dropdown_pin + '.print(' + text2 + ');\n';
	code += 'delay(' + delay_time + ');\n';
	return code;
};

arduinoGrove.grove_serial_lcd_power = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_stat = Arduino.getFieldValue('STAT');

	Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
	Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
	//generate PIN#+1 port
	let NextPIN = _get_next_pin(dropdown_pin);

	Arduino.definitions_['var_lcd' + dropdown_pin] =
		'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';
	let code = 'slcd_' + dropdown_pin;
	if (dropdown_stat === 'ON') {
		code += '.Power();\n';
	} else {
		code += '.noPower();\n';
	}
	return code;
};

arduinoGrove.grove_serial_lcd_effect = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_stat = Arduino.getFieldValue('STAT');

	Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n';
	Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
	//generate PIN#+1 port
	let NextPIN = _get_next_pin(dropdown_pin);

	Arduino.definitions_['var_lcd' + dropdown_pin] =
		'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n';
	let code = 'slcd_' + dropdown_pin;
	if (dropdown_stat === 'LEFT') {
		code += '.scrollDisplayLeft();\n';
	} else if (dropdown_stat === 'RIGHT') {
		code += '.scrollDisplayRight();\n';
	} else {
		code += '.autoscroll();\n';
	}
	return code;
};

arduinoGrove.grove_sound_sensor = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let code = 'analogRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_pir_motion_sensor = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
	let code = 'digitalRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_line_finder = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
	let code = 'digitalRead(' + dropdown_pin + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_ultrasonic_ranger = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_unit = Arduino.getFieldValue('UNIT');
	Arduino.definitions_['define_ultrasonic'] = '#include <Ultrasonic.h>\n';
	Arduino.definitions_['var_ultrasonic' + dropdown_pin] =
		'Ultrasonic ultrasonic_' + dropdown_pin + '(' + dropdown_pin + ');';
	let code;
	if (dropdown_unit === 'cm') {
		code = 'ultrasonic_' + dropdown_pin + '.MeasureInCentimeters()';
	} else {
		code = 'ultrasonic_' + dropdown_pin + '.MeasureInInches()';
	}
	return [code, Arduino.ORDER_ATOMIC];
};

arduinoGrove.grove_motor_shield = function () {
	let dropdown_direction = Arduino.getFieldValue('DIRECTION');
	let speed = 127; //arduinoGrove.valueToCode(Arduino, 'SPEED', arduinoGrove.ORDER_ATOMIC) || '127';
	Arduino.setups_['setup_motor'] =
		'pinMode(8,OUTPUT);//I1\n' +
		'  pinMode(11,OUTPUT);//I2\n' +
		'  pinMode(9,OUTPUT);//speedPinA\n' +
		'  pinMode(12,OUTPUT);//I3\n' +
		'  pinMode(13,OUTPUT);//i4\n' +
		'  pinMode(10,OUTPUT);//speedPinB\n';
	let code = '';
	if (dropdown_direction === 'forward') {
		Arduino.definitions_['define_forward'] =
			'void forward()\n' +
			'{\n' +
			'  analogWrite(9,' +
			speed +
			');//input a simulation value to set the speed\n' +
			'  analogWrite(10,' +
			speed +
			');\n' +
			'  digitalWrite(13,HIGH);//turn DC Motor B move clockwise\n' +
			'  digitalWrite(12,LOW);\n' +
			'  digitalWrite(11,LOW);//turn DC Motor A move anticlockwise\n' +
			'  digitalWrite(8,HIGH);\n' +
			'}\n';
		code = 'forward();\n';
	} else if (dropdown_direction === 'right') {
		Arduino.definitions_['define_right'] =
			'void right()\n' +
			'{\n' +
			'  analogWrite(9,' +
			speed +
			');//input a simulation value to set the speed\n' +
			'  analogWrite(10,' +
			speed +
			');\n' +
			'  digitalWrite(13,LOW);//turn DC Motor B move anticlockwise\n' +
			'  digitalWrite(12,HIGH);\n' +
			'  digitalWrite(11,LOW);//turn DC Motor A move anticlockwise\n' +
			'  digitalWrite(8,HIGH);\n' +
			'}\n\n';
		code = 'right();\n';
	} else if (dropdown_direction === 'left') {
		Arduino.definitions_['define_left'] =
			'void left()\n' +
			'{\n' +
			'  analogWrite(9,' +
			speed +
			');//input a simulation value to set the speed\n' +
			'  analogWrite(10,' +
			speed +
			');\n' +
			'  digitalWrite(13,HIGH);//turn DC Motor B move clockwise\n' +
			'  digitalWrite(12,LOW);\n' +
			'  digitalWrite(11,HIGH);//turn DC Motor A move clockwise\n' +
			'  digitalWrite(8,LOW);\n' +
			'}\n\n';
		code = 'left();\n';
	} else if (dropdown_direction === 'backward') {
		Arduino.definitions_['define_backward'] =
			'void backward()\n' +
			'{\n' +
			'  analogWrite(9,' +
			speed +
			');//input a simulation value to set the speed\n' +
			'  analogWrite(10,' +
			speed +
			');\n' +
			'  digitalWrite(13,LOW);//turn DC Motor B move anticlockwise\n' +
			'  digitalWrite(12,HIGH);\n' +
			'  digitalWrite(11,HIGH);//turn DC Motor A move clockwise\n' +
			'  digitalWrite(8,LOW);\n' +
			'}\n\n';
		code = 'backward();\n';
	} else if (dropdown_direction === 'stop') {
		Arduino.definitions_['define_stop'] =
			'void stop()\n' +
			'{\n' +
			'digitalWrite(9,LOW);// Unenble the pin, to stop the motor. Arduino should be done to avid damaging the motor.\n' +
			'digitalWrite(10,LOW);\n' +
			'delay(1000);\n' +
			'}\n\n';
		code = 'stop();\n';
	}
	return code;
};

arduinoGrove.grove_thumb_joystick = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let dropdown_axis = Arduino.getFieldValue('AXIS');
	let stickPIN = '0';
	if (dropdown_axis === 'y') {
		stickPIN = _get_next_pin(dropdown_pin);
	} else {
		stickPIN = dropdown_pin;
	}
	let code = 'analogRead(' + stickPIN + ')';
	return [code, Arduino.ORDER_ATOMIC];
};

function hexToR(h) {
	return parseInt(cutHex(h).substring(0, 2), 16);
}
function hexToG(h) {
	return parseInt(cutHex(h).substring(2, 4), 16);
}
function hexToB(h) {
	return parseInt(cutHex(h).substring(4, 6), 16);
}
function cutHex(h) {
	return h.charAt(0) == '#' ? h.substring(1, 7) : h;
}

arduinoGrove.grove_rgb_led = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let NextPIN = _get_next_pin(dropdown_pin);

	Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
	Arduino.setups_['setup_input_' + NextPIN] = 'pinMode(' + NextPIN + ', OUTPUT);';
	Arduino.definitions_['define_uint8'] = '#define uint8 unsigned char';
	Arduino.definitions_['define_uint16'] = '#define uint16 unsigned int';
	Arduino.definitions_['define_uint32'] = '#define uint32 unsigned long int';
	Arduino.definitions_['define_clkproduce_' + dropdown_pin] =
		'void ClkProduce_' +
		dropdown_pin +
		'(void)\n' +
		'{\n' +
		'  digitalWrite(' +
		dropdown_pin +
		', LOW);\n' +
		'  delayMicroseconds(20);\n' +
		'  digitalWrite(' +
		dropdown_pin +
		', HIGH);\n' +
		'  delayMicroseconds(20);\n' +
		'}\n';
	Arduino.definitions_['define_send32zero_' + dropdown_pin] =
		'void Send32Zero_' +
		dropdown_pin +
		'(void)\n' +
		'{\n' +
		'  uint8 i;\n' +
		'  for (i=0; i<32; i++)\n' +
		'  {\n' +
		'    digitalWrite(' +
		NextPIN +
		', LOW);\n' +
		'    ClkProduce_' +
		dropdown_pin +
		'();\n' +
		'  }\n' +
		'}\n';
	Arduino.definitions_['define_taskanticode'] =
		'uint8 TakeAntiCode(uint8 dat)\n' +
		'{\n' +
		'  uint8 tmp = 0;\n' +
		'  if ((dat & 0x80) == 0)\n' +
		'  {\n' +
		'    tmp |= 0x02;\n' +
		'  }\n' +
		'  \n' +
		'  if ((dat & 0x40) == 0)\n' +
		'  {\n' +
		'    tmp |= 0x01;\n' +
		'  }\n' +
		'  return tmp;\n' +
		'}\n';
	Arduino.definitions_['define_datasend_' + dropdown_pin] =
		'// gray data\n' +
		'void DatSend_' +
		dropdown_pin +
		'(uint32 dx)\n' +
		'{\n' +
		'  uint8 i;\n' +
		'  for (i=0; i<32; i++)\n' +
		'  {\n' +
		'    if ((dx & 0x80000000) != 0)\n' +
		'    {\n' +
		'      digitalWrite(' +
		NextPIN +
		', HIGH);\n' +
		'    }\n' +
		'    else\n' +
		'    {\n' +
		'      digitalWrite(' +
		NextPIN +
		', LOW);\n' +
		'    }\n' +
		'  dx <<= 1;\n' +
		'  ClkProduce_' +
		dropdown_pin +
		'();\n' +
		'  }\n' +
		'}\n';
	Arduino.definitions_['define_datadealwithsend_' + dropdown_pin] =
		'// data processing\n' +
		'void DataDealWithAndSend_' +
		dropdown_pin +
		'(uint8 r, uint8 g, uint8 b)\n' +
		'{\n' +
		'  uint32 dx = 0;\n' +
		'  dx |= (uint32)0x03 << 30;             // highest two bits 1，flag bits\n' +
		'  dx |= (uint32)TakeAntiCode(b) << 28;\n' +
		'  dx |= (uint32)TakeAntiCode(g) << 26;\n' +
		'  dx |= (uint32)TakeAntiCode(r) << 24;\n' +
		'\n' +
		'  dx |= (uint32)b << 16;\n' +
		'  dx |= (uint32)g << 8;\n' +
		'  dx |= r;\n' +
		'\n' +
		'  DatSend_' +
		dropdown_pin +
		'(dx);\n' +
		'}\n';
	let code = 'Send32Zero_' + dropdown_pin + '(); // begin\n';
	//console.log(Arduino.itemCount_);
	if (Arduino.itemCount_ == 0) {
		return '';
	} else {
		for (let n = 0; n < Arduino.itemCount_; n++) {
			let colour_rgb = Arduino.getFieldValue('RGB' + n);
			//console.log(colour_rgb);
			code +=
				'DataDealWithAndSend_' +
				dropdown_pin +
				'(' +
				hexToR(colour_rgb) +
				', ' +
				hexToG(colour_rgb) +
				', ' +
				hexToB(colour_rgb) +
				'); // first node data\n';
		}
	}
	code += 'Send32Zero_' + dropdown_pin + '();  // send to update data\n';
	return code;
};

arduinoGrove.grove_bluetooth_slave = function () {
	let dropdown_pin = Arduino.getFieldValue('PIN');
	let NextPIN = _get_next_pin(dropdown_pin);
	let name = Arduino.getFieldValue('NAME');
	let pincode = Arduino.getFieldValue('PINCODE');
	let statement_receive = Arduino.statementToCode(Arduino, 'RCV');
	let statement_send = Arduino.statementToCode(Arduino, 'SNT');
	/* if(pincode.length != 4){
    alert("pincode length should be 4");
  } */
	Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
	Arduino.definitions_['var_bluetooth_' + dropdown_pin] =
		'SoftwareSerial blueToothSerial_' +
		dropdown_pin +
		'(' +
		dropdown_pin +
		',' +
		NextPIN +
		');\n';

	Arduino.setups_['setup_bluetooth_' + dropdown_pin] = 'Serial.begin(9600);\n';
	Arduino.setups_['setup_bluetooth_' + dropdown_pin] +=
		'  pinMode(' + dropdown_pin + ', INPUT);\n';
	Arduino.setups_['setup_bluetooth_' + dropdown_pin] +=
		'  pinMode(' + NextPIN + ', OUTPUT);\n';
	Arduino.setups_['setup_bluetooth_' + dropdown_pin] +=
		'  setupBlueToothConnection_' + dropdown_pin + '();\n';

	Arduino.definitions_['define_setupBlueToothConnection_' + dropdown_pin] =
		'void setupBlueToothConnection_' +
		dropdown_pin +
		'()\n' +
		'{\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.begin(38400); //Set BluetoothBee BaudRate to default baud rate 38400\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+STWMOD=0\\r\\n"); //set the bluetooth work in slave mode\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+STNA=' +
		name +
		'\\r\\n"); //set the bluetooth name as "' +
		name +
		'"\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+STPIN=0000\\r\\n");//Set SLAVE pincode"0000"\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+STOAUT=1\\r\\n"); // Permit Paired device to connect me\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+STAUTO=0\\r\\n"); // Auto-connection should be forbidden here\n' +
		'  delay(2000); // Arduino delay is required.\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.print("\\r\\n+INQ=1\\r\\n"); //make the slave bluetooth inquirable \n' +
		'  Serial.println("The slave bluetooth is inquirable!");\n' +
		'  delay(2000); // Arduino delay is required.\n' +
		'  blueToothSerial_' +
		dropdown_pin +
		'.flush();\n' +
		'}\n';
	let code =
		'char recvChar_' +
		dropdown_pin +
		';\n' +
		'while(1) {\n' +
		'  if(blueToothSerial_' +
		dropdown_pin +
		'.available()) {//check if there is any data sent from the remote bluetooth shield\n' +
		'    recvChar_' +
		dropdown_pin +
		' = blueToothSerial_' +
		dropdown_pin +
		'.read();\n' +
		'    Serial.print(recvChar_' +
		dropdown_pin +
		');\n' +
		statement_receive +
		'  }\n' +
		'  if(Serial.available()){//check if there is any data sent from the local serial terminal, you can add the other applications here\n' +
		'    recvChar_' +
		dropdown_pin +
		' = Serial.read();\n' +
		'    blueToothSerial_' +
		dropdown_pin +
		'.print(recvChar_' +
		dropdown_pin +
		');\n' +
		statement_send +
		'  }\n' +
		'}\n';
	return code;
};
