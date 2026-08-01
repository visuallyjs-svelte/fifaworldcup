<script>
    export let year;
    export let onViewChange;
</script>

<header class="vjs-fwc-header">
    <div class="vjs-fwc-header-title">
        FIFA World Cup {year}
    </div>
    <nav class="vjs-fwc-header-nav">
        <button on:click={() => onViewChange('teams')} class="vjs-fwc-header-link">
            Teams
        </button>
        <button on:click={() => onViewChange('group-stage')} class="vjs-fwc-header-link">
            Group Stage
        </button>
        <button on:click={() => onViewChange('tournament')} class="vjs-fwc-header-link">
            Tournament
        </button>
    </nav>
</header>
