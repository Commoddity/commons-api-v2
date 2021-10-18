import { initClient } from "../db";
import { UsersService } from "../services/users/service";
import { ECognitoTriggerSource, ICognitoContext, ICognitoEvent } from "../types";

let initialize = null;

exports.handler = async (
  event: ICognitoEvent,
  _context: ICognitoContext,
  callback: (_arg: any, event: ICognitoEvent) => unknown,
) => {
  if (!initialize) {
    initialize = await initClient();
  }

  const {
    request: { userAttributes },
    triggerSource,
  } = event;

  const service = new UsersService();
  const resolver = {
    [ECognitoTriggerSource.PreSignUp_SignUp]: () => {
      return service.checkIfEmailExists(userAttributes);
    },

    [ECognitoTriggerSource.PostConfirmation_ConfirmSignUp]: () => {
      return service.cognitoSignUp(userAttributes);
    },
  }[triggerSource];

  await resolver?.();

  await service.closeDbConnection();
  callback(null, event);
};
