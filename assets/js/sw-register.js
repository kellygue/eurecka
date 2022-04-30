window.onload = () => {
    // registration of the service worker
    if ( "serviceWorker" in navigator) {
        navigator.serviceWorker.register('/sw-eurecka.js')
        .then(registration => {
            // do something with the registration 
        })
        .catch(err => console.error(`Unable the install the service worker`, err))
    } else {
        console.error(`Your browser does not support PWA`);
    }
}