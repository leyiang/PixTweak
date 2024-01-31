export class KeyboardShortcut {
    keysWithCtrl: Map<any, any>;
    keysWithShift: Map<any, any>;

    constructor() {
        this.keysWithCtrl = new Map();
        this.keysWithShift = new Map();
    }

    checkFunction(fn: Function) {
        const isFunction = fn instanceof Function;

        if( ! isFunction ) {
            throw new Error("Callback must be instance of Function");
        }
    }

    listenCtrlKeyAnd(key: string, callback: Function) {
        this.checkFunction(callback);
        this.keysWithCtrl.set(key, callback);
    }
    
    listenShiftKeyAnd(key: string, callback: Function) {
        this.checkFunction(callback);
        this.keysWithShift.set(key, callback);
    }

    add( type: string, key: string, callback:Function ) {
        if( type === "ctrl" ) {
            this.listenCtrlKeyAnd( key, callback );
        } else if( type === "shift" ) {
            this.listenShiftKeyAnd( key, callback );
        }
    }

    keydown( e: KeyboardEvent ) {
        if( e.ctrlKey ) {
            for( let [key, callback] of this.keysWithCtrl ) {
                if( key !== e.key ) continue;

                e.preventDefault();
                callback();
                return;
            }
        }


        if( e.shiftKey ) {
            for( let [key, callback] of this.keysWithShift ) {
                if( key !== e.key ) continue;

                e.preventDefault();
                callback();
                return;
            }
        }
    }

    startListen() {
        window.addEventListener("keydown", (e) => this.keydown(e));
    }
}