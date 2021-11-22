'use strict';
import fetch from 'node-fetch'
import defaultExport from '../utils/stream.js'
const stream = defaultExport

// Perform Database Search
async function searchDB(model, mediaId) {
  if (!mediaId) return
  const mod = await model.findOne({"mediaId":mediaId});
  
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

export default function (app,model) {

  app.route('/api/igmedia/:mediaId')
    .get(async function (req, res, next){
      let mediaId = req.params.mediaId;
      // console.log(mediaId);

      res.render('mediapage', {mediaId: mediaId});
      // SET TO RETURN THE PAGE CONTAINING DOWNLOAD
    });
    
  app.route('/api/igdownload/')
    .get(async function (req, res, next){
      const mediaId = req.query.mediaId;
      // console.log(req.query);
      
      searchDB(model, mediaId)
      .then(url => {
        stream(url, res);
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send({message: `Media not found. Please use Orangebot Instagram downloader first`})
      })
    })
    
};app.route('/api/stream/')
    .get(async function (req, res, next){
      const mediaId = req.query.mediaId;
      // console.log(req.query);
      
      searchDB(model, mediaId)
      .then(url => {
        stream(url, stream=true, res);
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send({message: `Media not found. Please use Orangebot Instagram downloader first`})
      })
    })