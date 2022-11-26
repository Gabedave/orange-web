"use strict";
// import fetch from 'node-fetch'
import defaultExport from "../utils/stream.js";
const stream = defaultExport;

// Perform Database Search
async function searchDB(model, mediaId) {
  if (!mediaId) return;
  const mod = await model.findOne({ igMediaId: mediaId });

  async function callBack(doc) {
    if (!doc) {
      console.log("Media not in Database", mediaId);
      throw new Error("Media not in Database");
    } else {
      // console.log('there is media in db');
      return doc.url;
    }
  }
  return await callBack(mod);
}

async function getUserDownloads(model, userId) {
  if (!userId) return;
  if (userId === "general_user") {
    return [
      { mediaId: "hello", date: "Saturday, 26 November 2022" },
      { mediaId: "world" },
    ];
  }
  const downloads = await model.find({
    userId: userId,
  });

  return downloads.map((item) => {
    item.date = new Date(item.created_at).toString();
  });
}

export default function (app, mediaModel, usersMediaModel) {
  app.route("/igmedia/:mediaId").get(async function (req, res, next) {
    let mediaId = req.params.mediaId;

    if (!mediaId) {
      res.status(404);
      return next();
    }

    res.render("mediapage", {
      mediaId: mediaId,
      mediaUrl: `/api/stream/?${mediaId}`,
    });
    // SET TO RETURN THE PAGE CONTAINING DOWNLOAD
  });

  app.route("/users/:userId/downloads").get(async function (req, res, next) {
    let userId = req.params.userId;
    console.log({ userId });

    const userDownloads = await getUserDownloads(usersMediaModel, userId);

    if (!userId) {
      res.status(404);
      return next();
    }

    res.render("users-downloads", { userDownloads: userDownloads });
    // SET TO RETURN THE PAGE CONTAINING USERS DOWNLOADS
  });

  app.route("/api/igdownload/").get(async function (req, res, next) {
    const mediaId = req.query.mediaId;
    // console.log(req.query);

    searchDB(mediaModel, mediaId)
      .then((url) => {
        console.log("igdownload", mediaId, url);
        const _stream = false;
        stream(url, _stream, res);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          message: `Media not found. Please use Orangebot Instagram downloader first`,
        });
      });
  });

  app.route("/api/stream/").get(async function (req, res, next) {
    const mediaId = req.query.mediaId;
    // console.log(req.query);

    searchDB(mediaModel, mediaId)
      .then((url) => {
        console.log("stream", mediaId, url);
        const _stream = true;
        stream(url, _stream, res);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          message: `Media not found. Please use Orangebot Instagram downloader first`,
        });
      });
  });
}
