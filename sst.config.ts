import { SSTConfig } from "sst";
import { API } from "./stacks/ApiStack";
import { WAF } from "./stacks/WAFStack";

export default {
  config(_input) {
    return {
      name: "waf-rest-api",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API);
    app.stack(WAF);
  },
} satisfies SSTConfig;
