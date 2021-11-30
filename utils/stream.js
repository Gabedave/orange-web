
import fetch from 'node-fetch';
// import fs from 'fs';

export default async function(url, stream=false, res) {
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
            res.status(500).send('Url Expired. Please use downloader again')
        }
        else {
        const chunksize = headers.get('content-length')
        const filename =
        `${new Date().getTime().valueOf().toString()}_${headers.get('x-fb-trip-id')}.${mimetype.split('/')[1]}`
        // const filepath = 'media/'+ filename
        // console.log(filename, mimetype, filepath)
        
        let head
        if (stream) {
            head = {
                // 'Content-Length': chunksize,
                'Content-Type': mimetype,
                "Accept-Ranges": "bytes"
            }
            res.writeHead(200, head)
        } else {
            head = {
                'Content-Disposition': 'attachment; filename=' + filename,
                // 'Content-Length': chunksize,
                'Content-Type': mimetype,
            }
            res.writeHead(200, head)
            
        }
        
        bodyStream.pipe(res)

        // fs.createReadStream(blobStream).pipe(res)
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).send({message: "internal error"})})
}




