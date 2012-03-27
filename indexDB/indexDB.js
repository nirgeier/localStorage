// For our demo - let's put all the code under indexDBUti
var indexedDbUtil = function () {
    var
        db, // IDBRequest - Our local DB object reference
        dbVer = '1.0', //The Object store version
        dbName = 'Chegg',
        dbRequest, // The request object when we try to open the DB
        objectName = 'CheggObj', // the test object that we want to store
        objectStore,
        dbVersionRequest,
        keyPath = "name",
        storedData = [
            // In our demo the name is a unique so it will be our key
            {"name":"Name1", "email":"email@gmail.com", "type":"type"},
            {"name":"Name2", "email":"email@gmail.com", "type":"type"}
        ];

    /**
     * open the DB
     */
    function openDB() {

        Helper.debug('Opening /Creating IndexedDB');

        // Check to see if the app/device is supporting the indexedDb
        if ('webkitIndexedDB' in window) {
            // Safari / Chrome
            window.indexedDB = window.webkitIndexedDB;
            window.IDBTransaction = window.webkitIDBTransaction;
        } else if ('mozIndexedDB' in window) {
            // FF
            window.indexedDB = window.mozIndexedDB;
        }

        /**
         * Open our IndexedDB if the browser supports it.
         */
        if (window.indexedDB) {
            Helper.debug('IndexedDB supported :-) ');


            window.indexedDB.deleteDatabase(dbName);
            Helper.error("indexedDB: " + dbName + " deleted");

            // request the opening of the database
            // @param 1: The name of the database
            // @param 2: The version of the database
            dbRequest = window.indexedDB.open(dbName, dbVer);

            /**
             * Error handler - trying to open the object storage
             * @param e - error object
             */
            dbRequest.onerror = function (e) {
                Helper.error("Error :", e);
            };

            /**
             * Handler when we upgrading the version of the database.
             * This is the only place where we can crete object stores and indices.
             * @param event
             *
             * !! Not supported by WebKit / Chrome
             */
            dbRequest.onupgradeneeded = function (event) {
                Helper.debug('onupgradeneeded');
                db = event.target.result;
            };


            dbRequest.onupdateneeded = function (event) {
                Helper.debug('onupdateneeded');
                db = event.target.result;
            };

            /**
             * Handler for success DOM event.
             * The event is fired with results as its target.
             * The returned object is IDBRequest
             **/
            dbRequest.addEventListener('success', function (e) {
                var transaction;

                Helper.debug('Indexed DB opened successfully');

                // Get the DB - we were able to open the request
                db = dbRequest.result || e.result;

                // Update the db version.
                // Only when updating the version we can create the object store
                transaction = db.setVersion(dbVer);

                // Handler for update version so we would be able to create object store.
                transaction.onsuccess = function (event) {
                    createObjects();
                }


            }, false);

        }

        // The indexed db is different from the WebSQL by its storage.
        // Web SQL is a Database storage while indexed db is objects storage.
        function createObjects() {
            var i,
                objectsNames = db.objectStoreNames,
                objectExist = objectsNames.contains(objectName);

            Helper.debug('createObject. Exists: ', objectExist);

            // Clear the old data if its exist
            if (objectExist) {
                // delete the old records
                for (i = 0; i < objectsNames.length; i++) {
                    console.dir(objectsNames);
                    if (objectsNames.hasOwnProperty(i)) {
                        Helper.debug('Deleting : ' + objectsNames[i] + "<br/>");
                        try {
                            db.deleteObjectStore(objectsNames[i]);
                        } catch (e) {
                            Helper.error(e);
                        }
                    }
                }
            }

            // check to see if we have deleted our test object
            objectExist = objectsNames.contains(objectName);

            if (!objectExist) {
                Helper.debug("Creating new object store. [" + objectName + "]");
                objectStore = db.createObjectStore(objectName, { "keyPath":keyPath });

                // Create an index to search by name. the name is unique
                objectStore.createIndex("name", "name", {"unique":true });

                // Create an index to search by email. the name is unique
                objectStore.createIndex("email", "email", {"unique":true });

                // add the records to the store
                addRecords();
            }
            printDBInformation(db);

        }

        /**
         * Print the indexedDB content
         * @param db
         */
        function printDBInformation(db) {

            var i, text = [], objects, spacer = '&nbsp;&nbsp;&nbsp;&nbsp;';

            if (db) {

                objects = db.objectStoreNames;
                text.push(spacer + 'DBName       : ' + db.name + '<br/>');
                text.push(spacer + 'Version      : ' + db.version + '<br/>');
                text.push(spacer + 'Object Names : <br/>');

                for (i = 0; i < objects.length; i++) {
                    text.push(spacer + spacer + objects[i] + "<br/>");
                }
                Helper.debug(text.join(''));
            }
        }

        function addRecords() {
            Helper.debug('Add records');
            var key;

            for (key in storedData) {
                if (storedData.hasOwnProperty(key)) {
                    objectStore.add(storedData[key]);
                }
            }
        }

        // dropTable();
        // createTable();
    }

    return{
        init:function () {
            openDB();
        }
    };

}();

indexedDbUtil.init();