var express = require('express'),
    transform = require('./lib/image-transformer'),
    config  = require('./config'),
    app     = express(),
    server,

    // Amazon
    AWS = require('aws-sdk'),
    s3 = new AWS.S3();

app.get(/d\/(.+)\/(.+)/, function(req, res) {
    var params = {
        Bucket: req.params[0],
        Key: req.params[1]
    };

    console.log("now getting bucket[" + params.Bucket + "] key[" + params.Key + "]");

    s3.getObject(params, function(err, image_stream) {
        if (err) {
            if (err.code == 'NoSuchKey') {
                return res.status(404).send();
            }

            console.log(err, err.stack); // an error occurred
            return res.status(500).send();
        }

        // Send response
        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.setHeader('Content-Type', image_stream.ContentType);
        transform(image_stream.Body, req.query).pipe(res);
    });
});

app.listen(config.get('PORT'), function(){
    console.log('server started on port ' + config.get('PORT'));
});
