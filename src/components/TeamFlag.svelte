<script>
    import { FIFACountryCode } from "../fifa-converter.js";
    export let team;

    $: isoCode = team ? FIFACountryCode(team.fifa_code)?.ISO2?.toLowerCase() : null;
</script>

{#if team}
    {#if isoCode}
        <img class="vjs-fwc-team-flag" src="https://static.visuallyjs.com/img/flags/1x1/{isoCode}.svg" alt="{team.name}" />
    {:else}
        <span>{team.fifa_code}</span>
    {/if}
{/if}
