<script>
    import { onMount } from "svelte";
    import TeamFlag from "./TeamFlag.svelte";
    import { getDatasourceContext, getEventBusContext } from '../context';

    export let selectedTeam;

    const datasource = getDatasourceContext()
	const listener = getEventBusContext()

    let teams = [];

    $: if (datasource) {
        datasource.getTeams().then(t => {
            teams = [...t].sort((a, b) => a.name.localeCompare(b.name));
        });
    }
</script>

<div class="vjs-fwc-teams-list">
    {#each teams as team}
        {@const isSelected = selectedTeam && selectedTeam.name === team.name}
        <div 
            class="vjs-fwc-teams-list-item {isSelected ? 'vjs-fwc-teams-list-item-selected' : ''}"
            on:click={() => {
                if (listener) {
                    listener.teamTap(team);
                    listener.matchTap(null);
                }
            }}
            role="button"
            tabindex="0"
        >
            <div class="vjs-fwc-teams-list-item-flag">
                <TeamFlag {team} />
            </div>
            <div class="vjs-fwc-teams-list-item-details">
                <div class="vjs-fwc-teams-list-item-name">{team.name}</div>
                <div class="vjs-fwc-teams-list-item-info">
                    <span>{team.continent}</span>
                    <span class="vjs-fwc-teams-list-item-separator">|</span>
                    <span>{team.confed}</span>
                    <span class="vjs-fwc-teams-list-item-separator">|</span>
                    <span>Group {team.group}</span>
                </div>
            </div>
        </div>
    {/each}
</div>
