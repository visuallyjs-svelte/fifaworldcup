<script>
    import { onMount } from "svelte";
    import { getDatasourceContext } from '../context';
    import GroupViewer from "./GroupViewer.svelte";

    export let showStatsTable = false;
    const datasource = getDatasourceContext();

    let groups = [];

    onMount(() => {
        datasource.getGroups().then(g => groups = g);
    });
</script>

<div class="vjs-fwc-groups">
    {#each groups as group}
        <GroupViewer groupName={group.name} {showStatsTable} />
    {/each}
</div>
