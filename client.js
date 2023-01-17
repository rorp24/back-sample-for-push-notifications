

if ('serviceWorker' in navigator) {
  console.log('Registerable service worker');
}

async function subscribe() {
    const appconf = await (await fetch('./config/app.config.json')).json();
    const registration = await navigator.serviceWorker.
        register('/worker.js', {scope: '/'});
    
    const subscription = await registration.pushManager.
        subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(appconf.public_key)
        });
        
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
        'content-type': 'application/json'
        }
    });
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function sendData() {
    var data = document.querySelector('#push-text').value
    await fetch('/new-notification-to-send', {
        method: 'POST',
        body: JSON.stringify({content:data}),
        headers: {
        'content-type': 'application/json'
        }
    });
}