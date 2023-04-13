import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (evt: APIGatewayProxyEvent) => {
  console.log(evt);
  return {
    statusCode: 200,
    body: "HELLO WORLD",
  };
};
