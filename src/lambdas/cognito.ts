import { initClient } from "../db";
// import { WebService } from "../services/web/service";
// import { EEntityTypes, EEventTypes } from "../types";

let initialize = null;

const eventShape = {
  version: "1",
  region: "ca-central-1",
  userPoolId: "ca-central-1_0cNBzg1g1",
  userName: "c4ce68ba-7b60-47a3-80e4-8f1d2f2a5d3c",
  callerContext: {
    awsSdkVersion: "aws-sdk-unknown-unknown",
    clientId: "2n3nrhs9rvcclfhdd6428i5hjr",
  },
  triggerSource: "PreSignUp_SignUp",
  request: {
    userAttributes: {
      given_name: "Pascal",
      family_name: "van Leeuwen",
      email: "pascalvanleeuwen604@gmail.com",
    },
    validationData: null,
  },
  response: {
    autoConfirmUser: false,
    autoVerifyEmail: false,
    autoVerifyPhone: false,
  },
};

exports.handler = async (event) => {
  if (!initialize) {
    initialize = await initClient();
  }

  console.log(event);

  // let consumer: () => Promise<void>;

  // if (entityType === EEntityTypes.Bills) {
  //   if (type === EEventTypes.UpdateBills) {
  //     consumer = async () => await new WebService().updateBills();
  //   }
  // }

  // return consumer?.() || null;
};
