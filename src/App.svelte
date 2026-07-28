<script>
    import { onMount } from "svelte";
    import { WorldCupDatasource } from "@visuallyjs/open-football-worldcup-datasource";

    import { setDatasourceContext, setEventBUsContext } from './context';

    import HeaderComponent from "./components/HeaderComponent.svelte";
    import GroupStage from "./components/GroupStage.svelte";
    import Tournament from "./components/Tournament.svelte";
    import TeamsList from "./components/TeamsList.svelte";
    import TeamJourney from "./components/TeamJourney.svelte";
    import TeamViewer from "./components/TeamViewer.svelte";
    import SquadViewer from "./components/SquadViewer.svelte";
    import MatchViewer from "./components/MatchViewer.svelte";
    import SelectSomething from "./components/SelectSomething.svelte";

    import "./fifaworldcup.css";

    let year = 2026;
    let ds = new WorldCupDatasource({ year });
    setDatasourceContext(ds);

    let selectedTeam = null;
    let selectedSquad = null;
    let selectedMatch = null;
    let currentView = 'tournament';

    const listener = {
        teamTap: (team) => {
            selectedTeam = team;
            if (team) {
                ds.getSquad(team.name).then(s => {
                    selectedSquad = s;
                });
            } else {
                selectedSquad = null;
            }
        },
        matchTap: (match) => {
            selectedMatch = match;
            console.log("tap match ", match);
        }
    };

    setEventBUsContext(listener)

    function handleViewChange(view) {
        selectedSquad = null;
        selectedTeam = null;
        selectedMatch = null;
        currentView = view;
    }
</script>

<div class="vjs-fwc-app-container">
    <HeaderComponent {year} onViewChange={handleViewChange} />
    <div class="vjs-fwc-main">
        <div class="vjs-fwc-main-body">
            {#if currentView === 'group-stage'}
                <GroupStage {year} showStatsTable={false} />
            {:else if currentView === 'tournament'}
                <Tournament />
            {:else if currentView === 'teams'}
                <div style="display: flex; height: 100%;">
                    <div style="flex: 1 0 50%; height: 100%; border: 1px solid; border-radius: 5px; overflow: auto;">
                        <TeamsList {selectedTeam} />
                    </div>
                    <div style="flex: 1 0 50%; height: 100%; border: 1px solid; border-radius: 5px; overflow: auto; margin: 0 0.5rem;">
                        <TeamJourney team={selectedTeam}  title="Journey" />
                        {#if !selectedTeam}
                            <SelectSomething msg="Select a team to view details" />
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
        <div class="vjs-fwc-main-sidebar">
            {#if currentView === 'group-stage'}
                <TeamViewer team={selectedTeam} />
                <SquadViewer squad={selectedSquad} />
                {#if !selectedTeam && !selectedSquad}
                    <SelectSomething msg="Select a team to view details" />
                {/if}
            {:else if currentView === 'teams'}
                {#if selectedMatch}
                    <MatchViewer match={selectedMatch} />
                    <hr />
                {/if}
                <TeamViewer team={selectedTeam} />
                <SquadViewer squad={selectedSquad} />
                {#if !selectedTeam && !selectedSquad}
                    <SelectSomething msg="Select a team to view details" />
                {/if}
            {:else if currentView === 'tournament'}
                <MatchViewer match={selectedMatch} />
            {/if}
        </div>
    </div>
</div>
