import { ParliamentsService } from "../service/parliaments/service";

const scriptFunc = async () => {
  const service = new ParliamentsService();

  await service.createOne({
    number: 43,
    start_date: new Date("2019-12-05"),
    parliamentarySessions: [
      {
        number: 1,
        start_date: new Date("2019-12-05"),
        end_date: new Date("2020-08-18"),
        bills: [],
      },
      {
        number: 2,
        start_date: new Date("2020-09-23"),
        end_date: new Date("2021-08-15"),
        bills: [],
      },
    ],
  });
};

scriptFunc();
