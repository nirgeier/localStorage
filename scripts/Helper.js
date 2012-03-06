var Helper = function () {

    // Feature detection
    // test to see if the current browser support this feature or not
    var output = document.querySelector('output'),
        waiting = document.querySelector('#waiting'),
        progress = document.querySelector('#progress'),
        workingTimer,
        features = {
            webSQL:{
                supported:!!window.openDatabase,
                src:'WebSQL/WebSQL.js'
            }
        };

    function addScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = 'async';
        document.body.appendChild(script);
        Helper.debug('Loading: ' + src);
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

        debug:function (message) {
            output.insertAdjacentHTML('beforeEnd', '<div>' + message + '</div>');
        },

        error:function (message) {
            output.insertAdjacentHTML('beforeEnd', '<div class="error">' + message + '</div>');
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

