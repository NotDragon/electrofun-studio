import * as Blockly from 'blockly';

declare global {
	namespace Blockly {
		let Arduino: Blockly.Generator;
	}
}
