var express = require('express'),
    transform = require('./lib/image-transformer'),
    config  = require('./config'),
    app     = express(),
    server,

    // Amazon
    AWS = require('aws-sdk'),
    s3 = new AWS.S3();

app.get(/d\/(.+)/, function(req, res) {
    var params = {
        Bucket: config.get('BUCKET_NAME'),
        Key: req.params[0]
    };

    s3.getObject(params, function(err, image_stream) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            return 500;
        }

        // Send response
        res.setHeader('Cache-Control', 'public, max-age=604800');
        transform(image_stream.Body, req.query)
            .pipe(res);
    });
});

app.listen(config.get('PORT'), function(){
    console.log('server started on port ' + config.get('PORT'));
});
