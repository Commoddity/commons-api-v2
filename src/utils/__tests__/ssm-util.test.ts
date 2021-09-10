import { SSMUtil } from "../ssm-util";
import { ESSMParams } from "../../types";

beforeAll(async () => {
  SSMUtil.initInstance();
});

describe(`SSMUtil methods`, () => {
  it("Should initialize correctly", () => {
    const ssmUtilInstance = SSMUtil.getInstance();

    expect(ssmUtilInstance).toBeDefined();
  });

  it("Should fetch a string param", async () => {
    const uri = await SSMUtil.getInstance().getVar(
      ESSMParams.MongoConnectionString,
    );

    expect(uri).toBeDefined();
    expect(typeof uri).toEqual("string");
  });
});
