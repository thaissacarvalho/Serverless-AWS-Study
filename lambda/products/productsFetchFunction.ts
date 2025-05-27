import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const lambdaRequestId = context.awsRequestId; // Gerado no AWS Lambda a cada execução da Lambda. Você encontra o ID no CloudWatch.
  const apiRequestId = event.requestContext.requestId; // Esse é chamado da API Gateway, ele é um ID ÚNICO/EXCLUSIVO e ajuda a rastrear cada requisição HTTP.
  const method = event.httpMethod;

  console.log(`AWS LAMBDA: ${lambdaRequestId} - API GATEWAY: ${apiRequestId}`);
  
  if (event.resource === "/products") {
    if (method === 'GET') {
      console.log('GET');

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'GET Products  - OK',
        })
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad Request',
    })
  }
}