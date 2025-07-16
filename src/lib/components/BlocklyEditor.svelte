<script lang="ts">
	import { onMount } from 'svelte';
	import * as Blockly from 'blockly';
	import 'blockly/blocks';

	import { Arduino } from '$lib/generators/arduino.js';
    import { toolbox } from '$lib/toolbox';
    import { blocks } from '$lib/customBlocks';
	import { lightTheme, darkTheme } from '$lib/blocklyThemes';

	let workspaceDiv: HTMLDivElement;
	let workspace: Blockly.WorkspaceSvg;

	// Bindable props
	export let arduinoCode: string;

	onMount(() => {
		workspace = Blockly.inject(workspaceDiv, {
			toolbox
		});

        Blockly.common.defineBlocks(blocks);

		// Watch workspace changes
		workspace.addChangeListener(() => {
			if (Arduino) {
                // console.log(Blockly.forBlock('controls_for'));
				Arduino.init(workspace);
				const rawCode = Arduino.workspaceToCode(workspace);
				arduinoCode = Arduino.finish(rawCode);
			}
		});
		workspace.setTheme(lightTheme);
	});
</script>

<div bind:this={workspaceDiv} style="height: 500px; width: 100%;"></div>
