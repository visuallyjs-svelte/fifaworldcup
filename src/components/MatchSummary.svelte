<script>
    import TeamFlag from "./TeamFlag.svelte";
    import { getDatasourceContext, getEventBusContext } from '../context';

    let {data} = $props();

    const listener = getEventBusContext()
	const datasource = getDatasourceContext()

    let team1 = $state(null);
    let team2 = $state(null);

    datasource.getTeam(data.team1).then(t => team1 = t);
    datasource.getTeam(data.team2).then(t => team2 = t);

    function finalScore(idx) {
        return data.score.et ? data.score.et[idx] : data.score.ft[idx];
    }
</script>

{#if data}
    <div class="vjs-fwc-match-summary">
        <!-- Team 1 Row -->
        <div class="vjs-fwc-match-team-row" on:click={() => listener?.teamTap(team1)} role="button" tabindex="0">
            <div class="vjs-fwc-group-team"><TeamFlag team={team1}/></div>
            <span class="vjs-fwc-match-team-name">{team1?.name || ''}</span>
            <span class="vjs-fwc-match-team-score">
                {finalScore(0)}
                {#if data.score.p && data.score.p[0] !== undefined && data.score.p[0] !== null}
                    ({data.score.p[0]})
                {/if}
            </span>
        </div>

        <!-- Team 2 Row -->
        <div class="vjs-fwc-match-team-row" on:click={() => listener?.teamTap(team2)} role="button" tabindex="0">
            <div class="vjs-fwc-group-team"><TeamFlag team={team2}/></div>
            <span class="vjs-fwc-match-team-name">{team2?.name || ''}</span>
            <span class="vjs-fwc-match-team-score">
                {finalScore(1)}
                {#if data.score.p && data.score.p[1] !== undefined && data.score.p[1] !== null}
                    ({data.score.p[1]})
                {/if}
            </span>
        </div>
    </div>
{/if}
