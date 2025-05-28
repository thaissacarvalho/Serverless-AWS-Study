import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const lambdaRequestId = context.awsRequestId; // Gerado no AWS Lambda a cada execução da Lambda. Você encontra o ID no CloudWatch.
  const apiRequestId = event.requestContext.requestId; // Esse é chamado da API Gateway, ele é um ID ÚNICO/EXCLUSIVO e ajuda a rastrear cada requisição HTTP.
  const method = event.httpMethod;

  console.log(`AWS LAMBDA: ${lambdaRequestId} - API GATEWAY: ${apiRequestId}`);

  if (event.resource === '/products') {
    console.log("POST - /products");
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'POST Products  - CREATED',
      })
    }
  } else if (event.resource === "products/{id}") {
    const productId = event.pathParameters!.id as string;

    if (method === "PUT") {
      console.log(`PUT - /products/${productId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `PUT - /products/${productId}`,
        })
      }
    } else if (method === "DELETE") {
      console.log(`DELETE - /products/${productId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `DELETE - /products/${productId}`,
        })
      }
    }
  }

  return {
    statusCode: 400,
    body: "BAD REQUEST"
  }
}