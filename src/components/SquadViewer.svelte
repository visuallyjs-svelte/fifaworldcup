<script>
    import Player from "./Player.svelte";
    export let squad;
</script>

{#if squad}
    <div class="vjs-wc-squad-info" style="padding: 10px;">
        <h3>PLAYERS</h3>
        <div style="display: flex; flex-wrap: wrap;">
            {#each squad.players as player}
                <Player {player} />
            {/each}
        </div>
    </div>
{/if}
