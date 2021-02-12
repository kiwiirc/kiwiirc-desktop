/* global kiwi */

const pkg = window.preloads.pkg;
const os = window.preloads.os;

kiwi.plugin('sysinfo', function (kiwi) {
    kiwi.state.$on('input.command.sysinfo', function (event, command, params) {
        const stats = [
            'Client:\x02 ' + pkg.name + ' v' + pkg.version,
            'OS:\x02 ' + os.platform() + ' ' + os.arch + ' ' + os.release,
            'CPU:\x02 ' + os.cpus().length + 'x - ' + os.cpus()[0].model,
            'RAM:\x02 ' + formatBytes(os.totalmem - os.freemem) + '/' + formatBytes(os.totalmem),
        ];
        kiwi.state.getActiveBuffer().say('[\x02' + stats.join('] [') + ']');
    });

    // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});
