<script>
    import { PaperComponent } from "@visuallyjs/browser-ui-svelte";
    import { ColumnLayout, uuid } from "@visuallyjs/browser-ui";
    import TeamJourneyMatch from "./TeamJourneyMatch.svelte";

    import { getDatasourceContext, getEventBusContext } from '../context';

    export let team;
    export let title;

    const datasource = getDatasourceContext()
	const listener = getEventBusContext()

    let data = null;
    let currentTeam = null;

    debugger

    async function getTeamJourney() {
        if (!team) return;

        const groupName = `Group ${team.group}`;
        const groupStats = await datasource.getGroupStats(groupName);

        const teamGroupMatches = groupStats.matches
            .filter(m => m.team1 === team.name || m.team2 === team.name)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const journeyMatches = [...teamGroupMatches];

        async function findMatchInRound(roundName) {
            const matches = await datasource.getMatchesForRound(roundName);
            const match = matches.find(m => m.team1 === team.name || m.team2 === team.name);
            if (match) {
                journeyMatches.push(match);
            }
        }

        await findMatchInRound("Round of 32");
        await findMatchInRound("Round of 16");
        await findMatchInRound("Quarter-final");
        await findMatchInRound("Semi-final");
        await findMatchInRound("Final");
        await findMatchInRound("Match for third place");

        const nodes = journeyMatches.map(m => ({ ...m, id: uuid() }));
        const edges = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            edges.push({
                source: nodes[i].id,
                target: nodes[i + 1].id
            });
        }

        currentTeam = team;
        data = { nodes, edges };
    }

    $: if (team && datasource && team !== currentTeam) {
        getTeamJourney();
    }

    const viewOptions = {
        nodes: {
            default: {
                component: TeamJourneyMatch,
                events: {
                    tap: (p) => {
                        p.model.setSelection(p.obj);
                        listener.matchTap(p.obj.data);
                    }
                }
            }
        }
    };

    const renderOptions = {
        scale: false,
        layout: {
            type: ColumnLayout.type,
            options: {
                padding: { x: 50, y: 20 }
            }
        },
        edges: {
            connector: "Straight",
            targetMarker: {
                type: "PlainArrow",
                options: { width: 10, length: 10 }
            }
        }
    };
</script>

{#if data}
    <div class="vjs-fwc-team-journey">
        <h3 style="margin: 0.5rem auto; text-align: center;">{title || team?.name}</h3>
        <PaperComponent
            {data}
            modelOptions={{ groupProperty: "vjsGroup" }}
            {renderOptions}
            viewOptions={viewOptions}
        />
    </div>
{/if}
