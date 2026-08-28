const CACHE_NAME = "rk-store-cache-v1";

const OFFLINE_FILES = [
    "./",
    "./index.html"
];


/* =========================
   INSTALL
========================= */

self.addEventListener(
    "install",
    function(event) {

        self.skipWaiting();

        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {

                    return cache.addAll(
                        OFFLINE_FILES
                    );

                })
        );

    }
);


/* =========================
   ACTIVATE
========================= */

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(function(cacheNames) {

                    return Promise.all(

                        cacheNames
                            .filter(function(name) {

                                return (
                                    name !== CACHE_NAME
                                );

                            })
                            .map(function(name) {

                                return caches.delete(
                                    name
                                );

                            })

                    );

                })
                .then(function() {

                    return self.clients.claim();

                })

        );

    }
);


/* =========================
   FETCH
   NETWORK FIRST
========================= */

self.addEventListener(
    "fetch",
    function(event) {

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        event.respondWith(

            fetch(event.request)
                .then(function(response) {

                    /*
                     * নতুন ফাইল পাওয়া গেলে
                     * নতুন ফাইলই ব্যবহার হবে।
                     */

                    return response;

                })
                .catch(function() {

                    /*
                     * Internet না থাকলে
                     * Cache থেকে চেষ্টা করবে।
                     */

                    return caches.match(
                        event.request
                    );

                })

        );

    }
);