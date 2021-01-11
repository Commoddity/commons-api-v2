// Load .env data into process.env
import dotenv from "dotenv-flow";
dotenv.config({ node_env: "dev" });

import { WebService } from "../service/web";
import { BillsService } from "../service/bills";
import { EventsService } from "../service/events";

const legisInfoUrl =
  "https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149";

// const summariesUrl = process.env.SUMMARY_URL;

// Mapped to 'yarn db:update_database' script in package.json to call database update chain
// DEV NOTE ---> WILL BE ADDED TO SCHEDULED JOB ONCE APP DEPLOYED - EXECUTE EVERY 24 HOURS

(async () => {
  const timerMessage = `[UPDATE DB SCRIPT] Successfully executed in `;
  console.time(timerMessage);

  console.log(
    `[UPDATE DB SCRIPT] Beginning new fetch of Bills for LEGISinfo website ...`,
  );

  try {
    const {
      billsArray,
      eventsArray,
    } = await new WebService().getLegisInfoCaller(legisInfoUrl);

    console.log(
      `[UPDATE DB SCRIPT] Succesfully fetched ${billsArray.length} bills and ${eventsArray.length} events ...\n`,
    );

    const createdBills = await new BillsService().createManyBills(billsArray);

    console.log(
      `[UPDATE DB SCRIPT] Succesfully added ${createdBills.length} bills to the database ...\n`,
    );

    const createdEvents = await new EventsService().createManyEvents(
      eventsArray,
    );

    console.log(
      `[UPDATE DB SCRIPT] Succesfully added ${createdEvents.length} events to the database ...\n`,
    );

    console.timeEnd(timerMessage);
  } catch (error) {
    console.error(`[UPDATE DB SCRIPT ERROR] ${error}`);
  }
})();
