export default class Modool {
    
    // Overridable lifecycle methods

    init() {}

    events() {
        return {};
    }

    destroy() {
        this.destroyEvents();
    }


    // Private methods

    constructor(name) {
        this.name = name;
        this.is_initialized = false;
        this.element = null;
        this.elements = {};
        this._events = this.events();

        document.addEventListener('DOMContentLoaded', () => {
            this.setElement();
            this.initialize();
        });
    }

    initialize() {
        if (!this.element) {
            this.is_initialized = false;
            return;
        } 

        this.setElements();
        this.setupEvents();
        this.init();

        this.is_initialized = true;
    }

    setElement() {
        this.element = document.querySelector(`[data-modool="${this.name}"]`);
    }

    setElements() {
        this.element.querySelectorAll('[data-modool-el]').forEach((el) => {
            const el_name = el.dataset.modoolEl;
            const elements = this.element.querySelectorAll("[data-modool-el='"+el_name+"']");

            if (elements.length > 1) {
                this.elements[el_name] = Array.from(elements);
            } else {
                this.elements[el_name] = elements[0];
            }
        });
    }

    setupEvents() {
        Object.keys(this._events).forEach((trigger_el_str) => {
            const fn = this._events[trigger_el_str];
            const [trigger, el_name] = trigger_el_str.split(' ');
            if (el_name) {
                if (el_name === 'window') {
                    window.addEventListener(trigger, fn);
                } else {
                    const el = this.elements[el_name];
                    if (Array.isArray(el)) {
                        el.forEach((_el) => {
                            _el.addEventListener(trigger, fn);
                        });
                    } else {
                        el.addEventListener(trigger, fn);
                    }
                }
            }
        });
    }

    destroyEvents() {
        Object.keys(this._events).forEach((trigger_el_str) => {
            const fn = this._events[trigger_el_str];
            var [trigger, el_name] = trigger_el_str.split(' ');
            if (el_name) {
                if (el_name === 'window') {
                    window.removeEventListener(trigger, fn);
                } else {
                    const el = this.elements[el_name];
                    if (Array.isArray(el)) {
                        el.forEach((_el) => {
                            _el.removeEventListener(trigger, fn);
                        });
                    } else {
                        el.removeEventListener(trigger, fn);
                    }
                }
            }
        });
    }


    // Public Static Methods
    // Sometimes you need to get an element outside of
    // the main Modool. Here's how ya do it.

    static getGlobalElement(name) {
        const elements = document.querySelectorAll(`[data-global-el="${name}"]`)

        if (elements.length > 1) {
            return Array.from(elements);
        } else {
            return elements[0];
        }
    }


    // Public methods
    // These methods are great to use if you're loading
    // and unloading Modools dynamically.

    check() {
        this.setElement();
        if (this.is_initialized) {
            if (this.element === null) {
                this.is_initialized = false;
                this.destroy();
            }
        } else {
            this.initialize();
        }
    }

    reload() {
        this.destroyEvents();
        this.setElements();
        this.setupEvents();
    }
}
