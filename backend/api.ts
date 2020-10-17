import { FastifyInstance, RouteShorthandOptions } from "fastify";
import fetch from "node-fetch";
import config from '../config.json';

/**
 * Regex describing a valid Warcraft Logs ID
 */
const regex = {
    wcl: /^[a-zA-Z0-9]{16}$/,
}

export default async function (server : FastifyInstance, opts: RouteShorthandOptions, next: () => void) {

    server.get("/report", opts, async (req: any, res: any) => {
        if (!req.query.id || !req.query.id.match(regex.wcl)) {
            res.code(404).send({error: 'Invalid ID'})
            return
        }

        let report: any = await fetch(`https://classic.warcraftlogs.com/v1/report/fights/${req.query.id}?api_key=${config.wclKey}`)
        report = await report.json()

        report.raid = {}
        for (const friendly of report.friendlies) {
            delete friendly.fights
            delete friendly.server
            report.raid[friendly.id] = friendly
            delete report.raid[friendly.id].id
        }

        delete report.friendlies
        delete report.exportedCharacters

        res.code(200).send(report);
    });

    server.get("/ping", opts, (_req: any, res: any) => {
        res.code(200).send({ pong: "it worked!" });
    });

    server.get("/status", opts, (_req: any, res: any) => {
        res.send({ date: new Date(), works: true });
    });

    next();
};