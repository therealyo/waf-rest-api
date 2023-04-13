import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

import { StackContext, Function } from "sst/constructs";

export function API({ stack }: StackContext) {
  const lambda = new Function(stack, "test-lambda", {
    handler: "packages/functions/src/lambda.handler",
  });

  const api = new RestApi(stack, "test-rest-api-cdk", {
    domainName: {
      domainName: "gateway.lambda-dev.website",
      certificate: Certificate.fromCertificateArn(
        stack,
        "test-api",
        "arn:aws:acm:eu-west-1:843771403489:certificate/8e8da552-5281-4efa-9003-2f126410be14"
      ),
    },
    deployOptions: {
      stageName: stack.stage,
    },
  });

  api.root.addMethod("GET", new LambdaIntegration(lambda));

  const apiArn = `arn:${stack.partition}:apigateway:${stack.region}::/restapis/${api.restApiId}`;

  return {
    apiArn,
  };
}
