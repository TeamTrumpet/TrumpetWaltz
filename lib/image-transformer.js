var gm = require('gm').subClass({ imageMagick: true }),
    _ = require('lodash');

var transformMap = {
    // route example: /d/<img id>?w=100&h=100
    w: function(item, options) {
        return item.resize(options.w, options.h);
    },
    // route example: /d/<img id>?s=50
    s: function(item, options) {
        return item.resize(options.s, null, '%');
    },
    // route example: /d/<img id>?q=50
    q: function(item, options){
        return item
                .compress('JPEG')
                .quality(options.q);

    },
    // route example: /d/<img id>?type=Grayscale
    type: function(item, options){
        return item
            .type(options.type);
    },
    // route example: /d/<img id>?sepia
    sepia: function(item, options){
        return item
            .sepia();
    },
    // route example: /d/<img id>?col=10,10,0
    col: function(item, options){
        return item
            .colorize.apply(item, options.col.split(","));
    },
    default: function(item){ return item; }
};

exports = module.exports = function(stream, options) {
    var item = gm(stream);

    _.each(_.keys(options), function(key){
        var transform = transformMap[key] || transformMap['default'];
        item = transform(item, options);
    });

    return item.stream();
};
