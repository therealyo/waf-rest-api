import { aws_wafv2 } from "aws-cdk-lib";
import { Function, StackContext, use } from "sst/constructs";
import { API } from "./ApiStack";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export function WAF({ stack }: StackContext) {
  const { apiArn } = use(API);
  const ipSet = new aws_wafv2.CfnIPSet(stack, "waf-ip-set", {
    addresses: [],
    ipAddressVersion: "IPV4",
    scope: "REGIONAL",
  });

  const acl = new aws_wafv2.CfnWebACL(stack, "test-acl-from-sst", {
    name: "test-acl-from-sst",
    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      metricName: "metricName",
      sampledRequestsEnabled: false,
    },
    scope: "REGIONAL",
    defaultAction: {
      allow: {},
    },
    rules: [
      {
        name: "block-my-ip",
        priority: 0,
        statement: {
          ipSetReferenceStatement: {
            arn: ipSet.attrArn,
          },
        },
        action: {
          block: {},
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: "metricName",
          sampledRequestsEnabled: false,
        },
      },
    ],
  });

  const apiGatewayAssociation = new aws_wafv2.CfnWebACLAssociation(
    stack,
    "rest-api-association",
    {
      resourceArn: `${apiArn}/stages/${stack.stage}`,
      webAclArn: acl.attrArn,
    }
  );
}
