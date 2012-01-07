var h = new window['Hypher'](module.exports);

if (typeof module.exports.id === 'string') {
    module.exports.id = [module.exports.id];
}

module.exports.id.forEach(function (id) {
    window['Hypher']['languages'][id] = h;
});

}());
