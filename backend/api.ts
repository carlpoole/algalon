import { FastifyInstance, RouteShorthandOptions } from "fastify";
import fetch from "node-fetch";
import config from '../config.json';
import * as redis from './redis'

/**
 * Regex describing a valid Warcraft Logs ID
 */
const regex = {
  wcl: /^[a-zA-Z0-9]{16}$/,
}

export default function (server: FastifyInstance, _opts: RouteShorthandOptions, next: () => void) {

  server.get("/report", async (req: any, res: any) => {
    if (!req.query.id || !req.query.id.match(regex.wcl)) {
      res.code(404).send({ error: 'Invalid ID' })
      return
    }

    try {
      let report = !req.query.refresh && await redis.get(req.query.id)
      if (!report) {
        let wclReport : any = await fetch(`https://classic.warcraftlogs.com/v1/report/fights/${req.query.id}?api_key=${config.wclKey}`)
        wclReport = await wclReport.json()

        wclReport.raid = {}
        for (const friendly of wclReport.friendlies) {
          delete friendly.fights
          delete friendly.server
          wclReport.raid[friendly.id] = friendly
          delete wclReport.raid[friendly.id].id
        }

        delete wclReport.friendlies
        delete wclReport.exportedCharacters

        if (Date.now() - wclReport.end < 3600 * 1000) {
          wclReport.refresh = true
        }

        report = wclReport
      }

      if (!report) {
        return res.code(400).send({error: 'Invalid request'})
      }

      redis.set(req.query.id, report)
      res.cache(3600*24).send(report)
    } catch (e) {
      server.log.error(e)
      res.code(500).send({error: e.message})
    }
  });

  server.get("/reports", async (req: any, res: any) => {
    // Get all raid reports within 8 days ago
    const last = new Date(Date.now() - (8 * 24 * 60 * 60 * 1000)).getTime();

    server.log.info(`Fetching Guild logs for: \x1b[33m${config.guild.name}\x1b[0m`)
    let report = await fetch(`https://classic.warcraftlogs.com/v1/reports/guild/${config.guild.name}/${config.guild.realm}/${config.guild.region}?start=${last}&api_key=${config.wclKey}`)
    report = await report.json()
    res.send(report)
  });

  server.get('/events', async (req: any, res: any) => {
    if (!req.query.id.match(regex.wcl) || !(parseInt(req.query.fight, 10) > -1)) {
      return res.code(404).send({error: 'Invalid request'})
    }

    try {
      let eventType
      let addQuery = ''
      let usePaging = true

      switch (req.query.type) {
        case 'summary':
          eventType = 'summary'
          usePaging = false
          break
        case 'damage':
          eventType = 'damage-done'
        break
        case 'casts':
          eventType = 'casts'
          break
        case 'enemyDeaths':
          eventType = 'deaths'
          addQuery = '&hostility=1'
          break
        case 'enemySummons':
          eventType = 'summons'
          addQuery = '&hostility=1'
          break
        case 'enemyDebuffs':
          eventType = 'debuffs'
          addQuery = '&hostility=1'
          break
        default:
          return res.code(404).send({error: 'Invalid request'})
      }

      const fightKey = parseInt(req.query.fight, 10)
      const redisKey = `${req.query.id}:${fightKey}:${req.query.type}`
      let events = await redis.get(redisKey)
      if (events) {
        return res.cache(3600*24).send(events)
      }

      const report : any = await redis.get(req.query.id)
      if (!report) {
        return res.code(400).send({error: 'Invalid request'})
      }

      if (!report.fights[fightKey]) {
        return res.code(400).send({error: 'Invalid request'})
      }

      server.log.info((new Date()).toISOString(), `Fetching WCL: \x1b[33m${req.query.id}\x1b[0m/\x1b[36m${fightKey+1}\x1b[0m/\x1b[35m${eventType}\x1b[0m`)
      let wclEvents : any = await fetch(`https://classic.warcraftlogs.com/v1/report/events/${eventType}/${req.query.id}?start=${report.fights[fightKey].start_time}&end=${usePaging && report.fights[fightKey].end_time || report.fights[fightKey].start_time}${addQuery}&api_key=${config.wclKey}`)
      wclEvents = await wclEvents.json()
      delete wclEvents.auraAbilities

      while (wclEvents.nextPageTimestamp) {
        let page : any = await fetch(`https://classic.warcraftlogs.com/v1/report/events/${eventType}/${req.query.id}?start=${wclEvents.nextPageTimestamp}&end=${report.fights[fightKey].end_time}${addQuery}&api_key=${config.wclKey}`)
        page = await page.json()
        wclEvents.events = wclEvents.events.concat(page.events)
        wclEvents.nextPageTimestamp = wclEvents.nextPageTimestamp
      }
      events = wclEvents.events

      if (!events) {
        return res.code(400).send({error: 'Invalid request'})
      }

      redis.set(redisKey, events)
      res.cache(3600*24).send(events)
    }
    catch (e) {
      server.log.error(e)
      res.code(500).send({error: e.message})
    }
  })

  next();
};