import { ParliamentsService } from "../services/parliaments/service";
import { initClient } from "../db";

const scriptFunc = async () => {
  await initClient();
  const service = new ParliamentsService();

  await service.createOne({
    number: 43,
    startDate: new Date("2019-12-05"),
    endDate: new Date("2021-08-15"),
    parliamentarySessions: [
      {
        number: 1,
        startDate: new Date("2019-12-05"),
        endDate: new Date("2020-08-18"),
        bills: [],
      },
      {
        number: 2,
        startDate: new Date("2020-09-23"),
        endDate: new Date("2021-08-15"),
        bills: [],
      },
    ],
  });

  await service.closeDbConnection();
};

scriptFunc();
