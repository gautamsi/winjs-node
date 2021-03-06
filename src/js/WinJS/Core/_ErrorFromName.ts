'use strict';
 class ErrorFromName {
    static supportedForProcessing: boolean = false;
    name: string;
    message: string;
    constructor(name: string, message?: string) {
        /// <signature helpKeyword="WinJS.ErrorFromName">
        /// <summary locid="WinJS.ErrorFromName">
        /// Creates an Error object with the specified name and message properties.
        /// </summary>
        /// <param name="name" type="String" locid="WinJS.ErrorFromName_p:name">The name of this error. The name is meant to be consumed programmatically and should not be localized.</param>
        /// <param name="message" type="String" optional="true" locid="WinJS.ErrorFromName_p:message">The message for this error. The message is meant to be consumed by humans and should be localized.</param>
        /// <returns type="Error" locid="WinJS.ErrorFromName_returnValue">Error instance with .name and .message properties populated</returns>
        /// </signature>
        this.name = name;
        this.message = message || name;
    }
}


// import _Base = require('./_Base');
// _Base.Namespace.define("WinJS", {
//     // ErrorFromName establishes a simple pattern for returning error codes.
//     //
//     ErrorFromName: ErrorFromName
// });

export = ErrorFromName;