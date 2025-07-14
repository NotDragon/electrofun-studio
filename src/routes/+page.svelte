<script lang="ts">
	import BlocklyEditor from '$lib/components/BlocklyEditor.svelte';
    let arduinoCode: string = $state('');
    let xmlCode: string = $state('');

    $effect(() => {
        // This effect runs whenever arduinoCode or xmlCode changes
        console.log('Arduino Code:', arduinoCode);
        console.log('XML Code:', xmlCode);
    });
</script>

<BlocklyEditor bind:arduinoCode bind:xmlCode />
