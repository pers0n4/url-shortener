import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import { CreateLinkDto } from "./dto/create-link.dto";
import { Link } from "./interfaces/link.interface";

@Injectable()
export class LinksService {
  private readonly links: Link[] = [];

  create(dto: CreateLinkDto): Link {
    // TODO: check valid url
    const existedLink = this.links.find((link) => link.longUrl === dto.url);
    if (existedLink) {
      return existedLink;
    }

    const hash = createHash("sha256");
    hash.update(dto.url);

    const digest = hash.digest("hex");
    const chunkSize = 8;
    const chunkLength = digest.length / chunkSize;
    const encodingTable =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    const digestChunk: string[] = [].concat(
      ...digest
        .split("")
        .map((_, index) =>
          index % chunkLength ? [] : digest.slice(index, index + chunkLength)
        )
    );
    const encodedDigest = digestChunk.map(
      (chunk) => encodingTable[parseInt(chunk, 16) % encodingTable.length]
    );
    const encodedUrl = encodedDigest.join("");

    // TODO: check collision

    const link: Link = {
      shortUrl: encodedUrl,
      longUrl: dto.url,
    };

    this.links.push(link);
    return link;
  }

  findOne(shortUrl: string): Link {
    const existedLink = this.links.find((link) => link.shortUrl === shortUrl);
    if (!existedLink) {
      throw new NotFoundException("Not Found");
    }

    // TODO: count visited

    return existedLink;
  }
}
