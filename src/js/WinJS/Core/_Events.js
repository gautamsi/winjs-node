'use strict';
function createEventProperty(name) {
    var eventPropStateName = "_on" + name + "state";
    return {
        get: function () {
            var state = this[eventPropStateName];
            return state && state.userHandler;
        },
        set: function (handler) {
            var state = this[eventPropStateName];
            if (handler) {
                if (!state) {
                    state = { wrapper: function (evt) { return state.userHandler(evt); }, userHandler: handler };
                    Object.defineProperty(this, eventPropStateName, { value: state, enumerable: false, writable: true, configurable: true });
                    this.addEventListener(name, state.wrapper, false);
                }
                state.userHandler = handler;
            }
            else if (state) {
                this.removeEventListener(name, state.wrapper, false);
                this[eventPropStateName] = null;
            }
        },
        enumerable: true
    };
}
function createEventProperties() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i - 0] = arguments[_i];
    }
    /// <signature helpKeyword="WinJS.Utilities.createEventProperties">
    /// <summary locid="WinJS.Utilities.createEventProperties">
    /// Creates an object that has one property for each name passed to the function.
    /// </summary>
    /// <param name="events" locid="WinJS.Utilities.createEventProperties_p:events">
    /// A variable list of property names.
    /// </param>
    /// <returns type="Object" locid="WinJS.Utilities.createEventProperties_returnValue">
    /// The object with the specified properties. The names of the properties are prefixed with 'on'.
    /// </returns>
    /// </signature>
    var props = {};
    for (var i = 0, len = arguments.length; i < len; i++) {
        var name = arguments[i];
        props["on" + name] = createEventProperty(name);
    }
    return props;
}
var EventMixinEvent = (function () {
    function EventMixinEvent(type, detail, target) {
        this._preventDefaultCalled = false;
        this._stopImmediatePropagationCalled = false;
        this.detail = null;
        this.bubbles = { value: false, writable: false };
        this.cancelable = { value: false, writable: false };
        this.trusted = { value: false, writable: false };
        this.eventPhase = { value: 0, writable: false };
        this.target = null;
        this.timeStamp = null;
        this.type = null;
        this.detail = detail;
        this.target = target;
        this.timeStamp = Date.now();
        this.type = type;
    }
    Object.defineProperty(EventMixinEvent.prototype, "currentTarget", {
        get: function () { return this.target; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventMixinEvent.prototype, "defaultPrevented", {
        get: function () { return this._preventDefaultCalled; },
        enumerable: true,
        configurable: true
    });
    EventMixinEvent.prototype.preventDefault = function () {
        this._preventDefaultCalled = true;
    };
    EventMixinEvent.prototype.stopImmediatePropagation = function () {
        this._stopImmediatePropagationCalled = true;
    };
    EventMixinEvent.prototype.stopPropagation = function () {
    };
    EventMixinEvent.supportedForProcessing = false;
    return EventMixinEvent;
})();
var EventListener = (function () {
    function EventListener() {
        this._listeners = null;
    }
    EventListener.prototype.addEventListener = function (type, listener, useCapture) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.addEventListener">
        /// <summary locid="WinJS.Utilities.eventMixin.addEventListener">
        /// Adds an event listener to the control.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.addEventListener_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="listener" locid="WinJS.Utilities.eventMixin.addEventListener_p:listener">
        /// The listener to invoke when the event is raised.
        /// </param>
        /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.addEventListener_p:useCapture">
        /// if true initiates capture, otherwise false.
        /// </param>
        /// </signature>
        useCapture = useCapture || false;
        this._listeners = this._listeners || {};
        var eventListeners = (this._listeners[type] = this._listeners[type] || []);
        for (var i = 0, len = eventListeners.length; i < len; i++) {
            var l = eventListeners[i];
            if (l.useCapture === useCapture && l.listener === listener) {
                return;
            }
        }
        eventListeners.push({ listener: listener, useCapture: useCapture });
    };
    EventListener.prototype.dispatchEvent = function (type, details) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.dispatchEvent">
        /// <summary locid="WinJS.Utilities.eventMixin.dispatchEvent">
        /// Raises an event of the specified type and with the specified additional properties.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="details" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:details">
        /// The set of additional properties to be attached to the event object when the event is raised.
        /// </param>
        /// <returns type="Boolean" locid="WinJS.Utilities.eventMixin.dispatchEvent_returnValue">
        /// true if preventDefault was called on the event.
        /// </returns>
        /// </signature>
        var listeners = this._listeners && this._listeners[type];
        if (listeners) {
            var eventValue = new EventMixinEvent(type, details, this);
            // Need to copy the array to protect against people unregistering while we are dispatching
            listeners = listeners.slice(0, listeners.length);
            for (var i = 0, len = listeners.length; i < len && !eventValue._stopImmediatePropagationCalled; i++) {
                listeners[i].listener(eventValue);
            }
            return eventValue.defaultPrevented || false;
        }
        return false;
    };
    EventListener.prototype.removeEventListener = function (type, listener, useCapture) {
        /// <signature helpKeyword="WinJS.Utilities.eventMixin.removeEventListener">
        /// <summary locid="WinJS.Utilities.eventMixin.removeEventListener">
        /// Removes an event listener from the control.
        /// </summary>
        /// <param name="type" locid="WinJS.Utilities.eventMixin.removeEventListener_p:type">
        /// The type (name) of the event.
        /// </param>
        /// <param name="listener" locid="WinJS.Utilities.eventMixin.removeEventListener_p:listener">
        /// The listener to remove.
        /// </param>
        /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.removeEventListener_p:useCapture">
        /// Specifies whether to initiate capture.
        /// </param>
        /// </signature>
        useCapture = useCapture || false;
        var listeners = this._listeners && this._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var l = listeners[i];
                if (l.listener === listener && l.useCapture === useCapture) {
                    listeners.splice(i, 1);
                    if (listeners.length === 0) {
                        delete this._listeners[type];
                    }
                    // Only want to remove one element for each call to removeEventListener
                    break;
                }
            }
        }
    };
    EventListener.supportedForProcessing = false;
    return EventListener;
})();
var _export = {
    _createEventProperty: createEventProperty,
    createEventProperties: createEventProperties,
    eventMixin: EventListener,
    EventListener: EventListener
};
module.exports = _export;
