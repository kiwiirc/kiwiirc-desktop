/* global kiwi */

kiwi.plugin('title', function (kiwi) {
    kiwi.state.$watch('ui.active_buffer', function () {
        const newTitle = [
            'Kiwi IRC',
            '-',
            kiwi.state.getActiveBuffer().getNetwork().name,
            '-',
            window.kiwi.state.getActiveBuffer().name,
        ];
        document.title = newTitle.join(' ');
    });
});
