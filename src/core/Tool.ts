import type { Component, Raw } from "vue";

export class Tool {
    id: any;
    name: string;
    icon: string;
    headerComponent: null | Raw<Component>;
    mainComponent: Raw<Component> 
    shortcut: string;

    constructor(
        id: string,
        mainComponent: Raw<Component>, {
            name = "" as string,
            icon = "" as string,
            headerComponent = null as null | Raw<Component>,
            shortcut = "" as string
        }) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.headerComponent = headerComponent;
        this.mainComponent = mainComponent;
        this.shortcut = shortcut;
    }
}