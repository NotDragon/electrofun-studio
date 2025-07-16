<script lang="ts">
	import BlocklyEditor from '$lib/components/BlocklyEditor.svelte';
    let arduinoCode: string = $state('');

    $effect(() => {
        // This effect runs whenever arduinoCode or xmlCode changes
        console.log('Arduino Code:', arduinoCode);
    });
</script>

<BlocklyEditor bind:arduinoCode />
