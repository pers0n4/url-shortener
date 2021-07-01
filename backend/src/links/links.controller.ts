import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { CreateLinkDto } from "./dto/create-link.dto";
import { LinksService } from "./links.service";

@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get(":url")
  findOne(@Param("url") url: string, @Res() response: FastifyReply) {
    const link = this.linksService.findOne(url);

    return response.status(HttpStatus.MOVED_PERMANENTLY).redirect(link.longUrl);
  }
}
