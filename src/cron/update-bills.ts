import { WebService } from "@services";

export const handler = async (): Promise<void> => {
  await new WebService().updateBills();
};
