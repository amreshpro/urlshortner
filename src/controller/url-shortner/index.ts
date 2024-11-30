import { nanoid } from "nanoid";
import Url from "../../model/url";
import { logger } from "../../utils/logging";
import EnvConfig from "../../config/EnvConfig";

interface UrlRequest extends Request {
  body: {
    originalUrl: string;
    expiration?: string;
    alias?: string;
  };
}

export default class UrlShortnerController {
  // Create a short URL
  static async createShortUrl(req: UrlRequest, res: Response) {
    const { originalUrl, alias, expiration } = req.body;
    logger.info(req);
    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    try {
      const shortId = alias || nanoid(8);
      const expiresAt = expiration ? new Date(expiration) : null;

      const newUrl = new Url({ originalUrl, shortId, expiresAt });
      console.log(newUrl);
      await newUrl.save();

      res
        .status(201)
        .json({
          shortUrl: `http://localhost:${EnvConfig.PORT}/${shortId}`,
          originalUrl,
        });
    } catch (error) {
      res.status(500).json({ error: "Failed to create short URL" });
    }
  }

  // Get all URLs
  static async getAllUrls(req: Request, res: Response) {
    try {
      const urls = await Url.find();
      res.json(urls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch URLs" });
    }
  }

  // Redirect to original URL
  static async getUrlById(req: Request, res: Response) {
    const { id } = req.params!;
    console.log("Short ID received:", id); // Debug log

    try {
      const url = await Url.findOne({ shortId: id }); // Query database
      console.log("Database result:", url); // Debug log

      if (!url) return res.status(404).json({ error: "URL not found" });

      if (url.expiresAt && new Date() > url.expiresAt) {
        return res.status(410).json({ error: "URL has expired" });
      }

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error("Error fetching URL:", error); // Log error
      res.status(500).json({ error: "Failed to fetch URL" });
    }
  }
}
