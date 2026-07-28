<script>
    import TeamFlag from "./TeamFlag.svelte";
    export let stats;
</script>

{#if stats && stats.rankedTeams}
    <div class="vjs-fwc-group-stats" style="padding: 10px; font-family: sans-serif; background-color: white; margin: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
                <tr style="border-bottom: 2px solid #eee; text-align: left;">
                    <th style="padding: 8px 4px;">#</th>
                    <th style="padding: 8px 4px;">Team</th>
                    <th style="padding: 8px 4px; text-align: center;">W</th>
                    <th style="padding: 8px 4px; text-align: center;">D</th>
                    <th style="padding: 8px 4px; text-align: center;">L</th>
                    <th style="padding: 8px 4px; text-align: center;">F</th>
                    <th style="padding: 8px 4px; text-align: center;">A</th>
                    <th style="padding: 8px 4px; text-align: center;">GD</th>
                    <th style="padding: 8px 4px; text-align: center;">P</th>
                </tr>
            </thead>
            <tbody>
                {#each stats.rankedTeams as team, index}
                    {@const name = team.name}
                    {@const gd = stats.goalsFor[name] - stats.goalsAgainst[name]}
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px 4px;">{index + 1}</td>
                        <td style="padding: 8px 4px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                    <TeamFlag {team} />
                                </div>
                                <span>{name}</span>
                            </div>
                        </td>
                        <td style="padding: 8px 4px; text-align: center;">{stats.wins[name]}</td>
                        <td style="padding: 8px 4px; text-align: center;">{stats.draws[name]}</td>
                        <td style="padding: 8px 4px; text-align: center;">{stats.losses[name]}</td>
                        <td style="padding: 8px 4px; text-align: center;">{stats.goalsFor[name]}</td>
                        <td style="padding: 8px 4px; text-align: center;">{stats.goalsAgainst[name]}</td>
                        <td style="padding: 8px 4px; text-align: center;">{gd > 0 ? `+${gd}` : gd}</td>
                        <td style="padding: 8px 4px; text-align: center; font-weight: bold;">{stats.points[name]}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
