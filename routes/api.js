'use strict';
// import fetch from 'node-fetch'
import defaultExport from '../utils/stream.js'
const stream = defaultExport

// Perform Database Search
async function searchDB(model, mediaId) {
  if (!mediaId) return
  const mod = await model.findOne({ "igMediaId": mediaId });

  async function callBack(doc) {

    if (!doc) {
      throw new Error('Media not in Database')
    } else {
      // console.log('there is media in db');
      return doc.url
    }
  }
  return await callBack(mod);
}

export default function (app, model) {

  app.route('/igmedia/:mediaId')
    .get(async function (req, res, next) {
      let mediaId = req.params.mediaId;

      if (!mediaId) res.status(404)

      res.render('mediapage', { mediaId: mediaId, mediaUrl: `/api/stream/?${mediaId}` });
      // SET TO RETURN THE PAGE CONTAINING DOWNLOAD
    });

  app.route('/api/igdownload/')
    .get(async function (req, res, next) {
      const mediaId = req.query.mediaId;
      // console.log(req.query);

      searchDB(model, mediaId)
        .then(url => {
          console.log("igdownload", mediaId, url)
          const _stream = false
          stream(url, _stream, res);
        })
        .catch((err) => {
          console.error(err)
          res.status(500).send({ message: `Media not found. Please use Orangebot Instagram downloader first` })
        })
    })

  app.route('/api/stream/')
    .get(async function (req, res, next) {
      const mediaId = req.query.mediaId;
      // console.log(req.query);

      searchDB(model, mediaId)
        .then(url => {
          console.log("stream", mediaId, url)
          const _stream = true
          stream(url, _stream, res);
        })
        .catch((err) => {
          console.error(err)
          res.status(500).send({ message: `Media not found. Please use Orangebot Instagram downloader first` })
        })
    })
};