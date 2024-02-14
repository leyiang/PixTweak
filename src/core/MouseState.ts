import { Vec } from "./Vec";

type mouseCallback = (e: MouseEvent, ...others: any) => any;
type mouseMoveCallback = (e: MouseEvent, dx: number, dy: number) => any;

interface registration {
    on: null | string | ( () => boolean ),
    callback: mouseCallback 
}

interface mousemoveRegistration extends registration {
    callback: mouseMoveCallback
}

class MouseState {
    mouseupRegistration: registration[];
    mousemoveRegistration: mousemoveRegistration[];
    mousedownRegistration: registration[];
    startPos: Vec;
    currentPos: Vec;

    constructor() {
        this.mouseupRegistration = [];
        this.mousemoveRegistration = [];
        this.mousedownRegistration = [];

        this.startPos = new Vec();
        this.currentPos = new Vec();

        this.#startListen();
    }

    #startListen() {
        window.addEventListener("mousemove", e => this.#mousemove(e));
        window.addEventListener("mousedown", e => this.#mousedown(e));
        window.addEventListener("mouseup", e => this.#mouseup(e));
    }

    #mousedown(e: MouseEvent) {
        this.mousedownRegistration.forEach( info => {
            let triggerCallback = this.#checkTrigger(info.on, e);

            if( triggerCallback ) {
                this.startPos.set( e.clientX, e.clientY );
                info.callback?.(e, this.startPos);
            }
        });
    }

    #mousemove(e: MouseEvent) {
        this.mousemoveRegistration.forEach( info => {
            let triggerCallback = this.#checkTrigger(info.on, e);

            if( triggerCallback ) {
                this.currentPos.set( e.clientX, e.clientY );
                let dx = this.currentPos.x - this.startPos.x;
                let dy = this.currentPos.y - this.startPos.y;

                info.callback?.(e, dx, dy);
            }
        });
    }

    #mouseup(e: MouseEvent) {
        this.startPos.set(0, 0);
        this.startPos.set(0, 0);
        this.mouseupRegistration.forEach( info => {
            let triggerCallback = this.#checkTrigger(info.on, e);

            if( triggerCallback ) {
                info.callback?.(e);
            }
        });
    }

    #checkTrigger( on: registration["on"], e: MouseEvent ) {
        if( typeof on === "function" ) {
            return on?.();
        } else if( typeof on === "string" && e.target instanceof Element ) {
            return this.#checkTarget( on, e.target );
        } else if ( on === null ) {
            return true;
        }

        return false;
    }

    #checkTarget(on: string, target: Element ): boolean {
        if( on[0] === "." ) {
            // class name
            return target.classList.contains( on.slice(1) );
        } else if( on[0] === "#" ) {

        } else {
            // not class name
            // and not id
            return false;
        }

        return false;
    }

    onMouseUp( callback: mouseCallback, on = null as registration["on"] ) : Function {
        const ref = {
            on, callback
        };

        this.mouseupRegistration.push( ref );
        return () => this.removeRef( ref, this.mouseupRegistration );
    }

    onMouseMove( callback: mouseMoveCallback, on = null as registration["on"] ) : Function {
        const ref = {
            on, callback
        };
        this.mousemoveRegistration.push( ref );
        return () => this.removeRef( ref, this.mousemoveRegistration );
    }

    onMouseDown( callback: mouseCallback, on = null as registration["on"] ) : Function {
        const ref = {
            on, callback
        };

        this.mousedownRegistration.push( ref );
        return () => this.removeRef( ref, this.mousedownRegistration );
    }

    /**
     * Remove item by object reference
     */
    removeRef( ref: registration, from: registration[] ) {
        const index = from.indexOf( ref );

        if( index >= 0 ) {
            from.splice( index, 1 );
        }
    }
}

export const mouseState = new MouseState;