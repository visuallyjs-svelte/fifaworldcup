<script>
    import { AnchorLocations, CircularLayout, LabelOverlay } from "@visuallyjs/browser-ui";
    import { PaperComponent} from "@visuallyjs/browser-ui-svelte";
    import GroupTeam from "./GroupTeam.svelte";
    import GroupStatsComponent from "./GroupStatsComponent.svelte";
    import { getDatasourceContext, getEventBusContext } from '../context';

    let { groupName, showStatsTable} = $props()

    const datasource = getDatasourceContext();
    const listener = getEventBusContext()

	let loaded = $state(false)
    let data = $state({ nodes: [], edges: [] });
    let stats = $state({});

    const modelOptions = {
        groupProperty: "vjsGroup"
    };

    const renderOptions = {
        layout: {
            type: CircularLayout.type,
            options: { }
        }
    };

    const view = {
        nodes: {
            default: {
                component: GroupTeam,
                events: {
                    "mouseover": (p) => {
                        p.model.addToSelection(p.obj.getAllEdges())
                    },
                    "mouseout": (p) => {
                        p.model.removeFromSelection(p.obj.getAllEdges())
                    },
                    "tap": (p) => listener.teamTap(p.obj.data)
                }
            }
        },
        edges: {
            default: {
                detachable: false,
                anchor: AnchorLocations.Center,
                overlays: [
                    {
                        type: LabelOverlay.type,
                        options: {
                            label: "{{team1Score}}",
                            location: 0.35
                        }
                    },
                    {
                        type: LabelOverlay.type,
                        options: {
                            label: "{{team2Score}}",
                            location: 0.65
                        }
                    }
                ],
                events: {
                    "tap": (p) => {
                        listener.matchTap(p.obj.data.match)
                    },
                    "mouseover": (p) => {
                        p.model.addToSelection(p.obj)
                    },
                    "mouseout": (p) => {
                        p.model.removeFromSelection(p.obj)
                    },
                }
            }
        }
    };

    datasource.getGroupStats(groupName).then(gs => {
        const nodes = gs.teams.slice();
        const edges = gs.matches.map(match => {
            return {
                source: match.team1,
                target: match.team2,
                data: {
                    team1Score: `${match.score.ft[0]}`,
                    team2Score: `${match.score.ft[1]}`,
                    match
                }
            };
        });
        data = { nodes, edges };
        stats = gs.stats;
        loaded = true
    });

    function toggleStats() {
        showStatsTable = !showStatsTable;
    }
</script>

<div class={`vjs-fwc-group` + (showStatsTable ? ` vjs-fwc-group-with-stats` : ``)} style="position: relative;">
    <div class="vjs-fwc-group-title">{groupName}</div>
    <div class="vjs-fwc-group-stats-toggle"
        on:click={toggleStats}
        style="
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: {showStatsTable ? '#d0d0d0' : 'transparent'};
            transition: background-color 0.2s;
        "
        title={showStatsTable ? "Hide stats table" : "Show stats table"}
        role="button"
        tabindex="0">
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
    </div>
	{#if loaded}
		<PaperComponent modelOptions={modelOptions} data={data} renderOptions={renderOptions} viewOptions={view}/>
	{/if}
    {#if showStatsTable}
        <GroupStatsComponent {stats}/>
    {/if}
</div>
