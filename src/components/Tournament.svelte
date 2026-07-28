<script>
    import { onMount } from "svelte";
    import { SurfaceComponent, ControlsComponent } from "@visuallyjs/browser-ui-svelte";
    import { uuid } from "@visuallyjs/browser-ui";
    import MatchSummary from "./MatchSummary.svelte";

    import { getDatasourceContext, getEventBusContext } from '../context';

    const datasource = getDatasourceContext()
	const listener = getEventBusContext()

    let data = null;

    async function getMatches(roundName) {
        const matches = await datasource.getMatchesForRound(roundName);
        return matches.map(o => Object.assign({ id: uuid() }, o));
    }

    async function assemble() {
        const r32 = await getMatches("Round of 32");
        const r16 = await getMatches("Round of 16");
        const qf = await getMatches("Quarter-final");
        const sf = await getMatches("Semi-final");
        const f = await getMatches("Final");

        const nodes = [f[0], ...sf, ...qf, ...r16, ...r32];
        const edges = [];

        function findPreviousMatches(focusMatch, matchList) {
            return matchList.filter(m => 
                m.team1 === focusMatch.team1 || 
                m.team2 === focusMatch.team1 || 
                m.team1 === focusMatch.team2 || 
                m.team2 === focusMatch.team2
            );
        }

        sf.forEach(m => {
            edges.push({ source: f[0].id, target: m.id });
            const quarters = findPreviousMatches(m, qf);
            quarters.forEach(q => {
                edges.push({ source: m.id, target: q.id });
                const ros = findPreviousMatches(q, r16);
                ros.forEach(rs => {
                    edges.push({ source: q.id, target: rs.id });
                    const rot = findPreviousMatches(rs, r32);
                    rot.forEach(rt => {
                        edges.push({ source: rs.id, target: rt.id });
                    });
                });
            });
        });

        data = { nodes, edges };
    }

    onMount(() => {
        assemble();
    });

    const renderOptions = {
        layout: {
            type: "Hierarchy",
            options: {
                invert: true,
                axis: "vertical",
                unattachedRootPadding: 0,
                padding: {
                    x: 160, y: 40
                }
            }
        },
        edges: {
            connector: "Orthogonal",
            overlays: [
                {
                    type: "PlainArrow",
                    options: {
                        direction: -1,
                        location: 0
                    }
                }
            ]
        },
        zoomToFit: true,
        elementsDraggable: false
    };

    const viewOptions = {
        nodes: {
            default: {
                component: MatchSummary,
                events: {
                    "tap": (p) => {
                        debugger
                        listener.matchTap(p.obj.data);
                        p.model.setSelection(p.obj);
                    }
                }
            }
        }
    };
</script>

<div class="vjs-fwc-tournament-placeholder">
    {#if data}
        <SurfaceComponent {data} {renderOptions} {viewOptions}>
            <ControlsComponent clear={false} undoRedo={false} />
        </SurfaceComponent>
    {/if}
</div>
