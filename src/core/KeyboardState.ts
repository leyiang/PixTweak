export const PRESSED = 1;
export const RELEASED = 0;

export class KeyboardState {
    keyStates: Map<any, any>;
    keyMap: Map<any, any>;

    constructor() {
        this.keyStates = new Map();
        this.keyMap = new Map();
    }

    addMapping(key: string, callback: Function) {
        this.keyMap.set( key, callback );
    }

    handleEvent(e: KeyboardEvent) {
        const { key } = e;

        if( ! this.keyMap.has(key) ) {
            return false;
        }

        e.preventDefault();

        const keyState = e.type === "keydown" ? PRESSED : RELEASED;

        // Same State
        if( this.keyStates.get(key) === keyState ) {
            return;
        }

        this.keyStates.set(key, keyState);
        const callback = this.keyMap.get( key );

        callback( keyState );
    }

    listenTo() {
        ["keydown", "keyup"].forEach( eventName => {
            window.addEventListener(eventName, e => {
                this.handleEvent( e as KeyboardEvent );
            });
        });
    }
}