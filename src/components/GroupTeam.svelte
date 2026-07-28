<script>
    import TeamFlag from "./TeamFlag.svelte";
    import {getDatasourceContext} from "../context.js";

    let showStatsTable = false;

    const datasource = getDatasourceContext();
    const { data } = $props()

    let stats = $state(null)
	datasource.getGroupStats(`Group ${data.group}`).then(s => {
        stats = s.stats
	})

    let rank = $derived(stats ? stats.rankings[data.name] : -1)

</script>

<div class="vjs-fwc-group-team-node" data-ranking={rank}>
    <div class="vjs-fwc-group-team" title={data.name}><TeamFlag team={data}/></div>
    {#if !showStatsTable}
        <div class="vjs-fwc-group-team-stats">
            <span style="white-space: nowrap;">{data.name}</span>
            {#if stats}
                <table style="color: #555555;">
                    <thead>
                        <tr>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>F</th>
                            <th>A</th>
                            <th>P</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stats.wins[data.name]}</td>
                            <td>{stats.draws[data.name]}</td>
                            <td>{stats.losses[data.name]}</td>
                            <td>{stats.goalsFor[data.name]}</td>
                            <td>{stats.goalsAgainst[data.name]}</td>
                            <td>{stats.points[data.name]}</td>
                        </tr>
                    </tbody>
                </table>
            {/if}
        </div>
    {/if}
    {#if showStatsTable}
        <span style="margin-left: 10px;">{data.name}</span>
    {/if}
</div>
