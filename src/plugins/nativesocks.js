/* global kiwi */

kiwi.plugin('nativesocks', (kiwi) => {
    kiwi.on('network.connecting', (event) => {
        event.transport = window.preloads.transport;
    });
});
