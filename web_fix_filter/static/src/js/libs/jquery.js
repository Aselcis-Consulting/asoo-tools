odoo.define('web.jquery.fix_filter', function (require) {

    "use strict";

    $.extend($.event, {
        handlers: function(event, handlers ) {
            var sel, handleObj, matches, i,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;

            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // ODOO CHANGE: cherry-picking https://github.com/jquery/jquery/commit/c82a6685bb9
            // Support: Firefox<=42+
            // Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
            if ( delegateCount && cur.nodeType &&
                ( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

                    /* jshint eqeqeq: false */
                    for ( ; cur != this; cur = cur.parentNode || this ) {
                            /* jshint eqeqeq: true */
                            // Don't check non-elements (#13208)
                            // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                            if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
                                    matches = [];
                                    for ( i = 0; i < delegateCount; i++ ) {
                                            handleObj = handlers[ i ];
                                            // Don't conflict with Object.prototype properties (#13203)
                                            sel = handleObj.selector + " ";
                                            if ( matches[ sel ] === undefined ) {
                                                    matches[ sel ] = handleObj.needsContext ?
                                                        jQuery( sel, this ).index( cur ) >= 0 :
                                                        jQuery.find( sel, this, null, [ cur ] ).length;
                                            }
                                            if ( matches[ sel ] ) {
                                                    matches.push( handleObj );
                                            }
                                    }
                                    if ( matches.length ) {
                                            handlerQueue.push({ elem: cur, handlers: matches });
                                    }
                            }
                    }
            }
            // Add the remaining (directly-bound) handlers
            if ( delegateCount < handlers.length ) {
                    handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
            }
            return  handlerQueue;
            // return  handlerQueue === [] ? null : handlerQueue;

            }
    });
    // var jq = require('web.jquery.extensions');
    //
    // var jqEvent = jq.event;
    //
    // jqEvent.handlers =function( event, handlers ) {
    //         var sel, handleObj, matches, i,
    //                 handlerQueue = [],
    //                 delegateCount = handlers.delegateCount,
    //                 cur = event.target;
    //
    //         // Find delegate handlers
    //         // Black-hole SVG <use> instance trees (#13180)
    //         // ODOO CHANGE: cherry-picking https://github.com/jquery/jquery/commit/c82a6685bb9
    //         // Support: Firefox<=42+
    //         // Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
    //         if ( delegateCount && cur.nodeType &&
    //                 ( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
    //
    //                 /* jshint eqeqeq: false */
    //                 for ( ; cur != this; cur = cur.parentNode || this ) {
    //                         /* jshint eqeqeq: true */
    //                         // Don't check non-elements (#13208)
    //                         // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
    //                         if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
    //                                 matches = [];
    //                                 for ( i = 0; i < delegateCount; i++ ) {
    //                                         handleObj = handlers[ i ];
    //                                         // Don't conflict with Object.prototype properties (#13203)
    //                                         sel = handleObj.selector + " ";
    //                                         if ( matches[ sel ] === undefined ) {
    //                                                 matches[ sel ] = handleObj.needsContext ?
    //                                                         jQuery( sel, this ).index( cur ) >= 0 :
    //                                                         jQuery.find( sel, this, null, [ cur ] ).length;
    //                                         }
    //                                         if ( matches[ sel ] ) {
    //                                                 matches.push( handleObj );
    //                                         }
    //                                 }
    //                                 if ( matches.length ) {
    //                                         handlerQueue.push({ elem: cur, handlers: matches });
    //                                 }
    //                         }
    //                 }
    //         }
    //         // Add the remaining (directly-bound) handlers
    //         if ( delegateCount < handlers.length ) {
    //                 handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
    //         }
    //         return handlerQueue;
    //     };
    //
    // return jq;
});