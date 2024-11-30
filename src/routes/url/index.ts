import express from "express";
import UrlShortnerController from "../../controller/url-shortner";

const urlShortnerRouter = express.Router();

urlShortnerRouter.post("/", UrlShortnerController.createShortUrl);
urlShortnerRouter.get("/", UrlShortnerController.getAllUrls);
urlShortnerRouter.get("/:id", UrlShortnerController.getUrlById);

export default urlShortnerRouter;
