import { WebService } from "../services/web/service";
import { initClient } from "../db";

const scriptFunc = async () => {
  await initClient();
  const service = new WebService();

  await service.updateBills();
};

scriptFunc();
