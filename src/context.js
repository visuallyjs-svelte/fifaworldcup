import { setContext, getContext } from 'svelte';

const DS_KEY = Symbol('worldCupDatasource');

export function setDatasourceContext(datasource) {
    setContext(DS_KEY, datasource);
}

export function getDatasourceContext() {
    return getContext(DS_KEY);
}

const EVENT_BUS_KEY = Symbol('worldCupDatasourceEventBus');

export function setEventBUsContext(bus) {
    setContext(EVENT_BUS_KEY, bus);
}

export function getEventBusContext() {
    return getContext(EVENT_BUS_KEY);
}

const GROUP_CONTEXT_KEY = Symbol('worldCupDatasourceCurrentGroup');

export function setGroupContext(bus) {
    setContext(GROUP_CONTEXT_KEY, bus);
}

export function getGroupContext() {
    return getContext(GROUP_CONTEXT_KEY);
}
