var Helper = function () {

    // Feature detection
    // test to see if the current browser support this feature or not
    var output = document.querySelector('output'),
        waiting = document.querySelector('#waiting'),
        progress = document.querySelector('#progress'),
        workingTimer,
        features = {
            /*webSQL:{
             supported:!!window.openDatabase,
             src:'WebSQL/WebSQL.js'
             },*/
            indexDB:{
                supported:!!window.webkitIndexedDB || !!window.mozIndexedDB,
                src:'indexDB/indexDB.js'
            }
        };

    function addScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = 'async';
        document.body.appendChild(script);
        Helper.debug('Loading: ' + src);
    }

    function convertToText(args) {
        var key, reply = '';

        if (!args.length) {
            return;
        }

        for (key in args) {
            reply += ', ' + args[key];
        }
        return reply.substr(2);
    }

    return{

        /**
         ** Init
         **/
        init:function () {
            var key, current;
            for (key in features) {
                if (features.hasOwnProperty(key)) {
                    current = features[key];
                    if (current.supported) {
                        addScript(features[key].src);
                    }
                }
            }
        },

        debug:function () {
            output.insertAdjacentHTML('beforeEnd', '<div>' + convertToText(arguments) + '</div>');
        },

        error:function () {
            output.insertAdjacentHTML('beforeEnd', '<div class="error">' + convertToText(arguments) + '</div>');
        },

        startWaiting:function () {
            progress.innerHTML = '';
            waiting.style.display = 'block';
            this.working();
        },
        stopWaiting:function () {
            waiting.style.display = 'none';
            clearTimeout(workingTimer);
        },
        working:function () {
            clearTimeout(workingTimer);
            progress.insertAdjacentHTML('beforeEnd', '.');
            workingTimer = setTimeout(Helper.working, 1000);
        }

    }

}();

Helper.init();

