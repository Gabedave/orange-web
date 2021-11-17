import fetch from 'node-fetch';
// import fs from 'fs';

export default async function(url, res) {
    let headers
    fetch(url, {
        mode: 'no-cors',
        referrer: url,
        referrerPolicy: 'same-origin'
    })
    .then(resp => {
        headers = resp.headers
        // console.log(headers, headers.get('content-type'))
        return resp.body;
    })
    .then(bodyStream => {
        const mimetype = headers.get('content-type')
        if (mimetype === 'text/plain') {
            res.status(500).send('Url Expired. Plese use downloader again')
        }
        else {
        const chunksize = headers.get('content-length')
        const filename =
        `${new Date().getTime().valueOf().toString()}_${headers.get('x-fb-trip-id')}.${mimetype.split('/')[1]}`
        // const filepath = 'media/'+ filename
        // console.log(filename, mimetype, filepath)
        
        const head = {
            'Content-Disposition': 'attachment; filename=' + filename,
            'Content-Length': chunksize,
            'Content-Type': mimetype
        }
        res.writeHead(200, head)
        bodyStream.pipe(res)

        // fs.createReadStream(blobStream).pipe(res)
        }
    }).catch(() => res.status(500).send({message: "internal error"}))
}




