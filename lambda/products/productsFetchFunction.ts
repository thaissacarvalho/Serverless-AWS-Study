import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";

const productsDbd = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient();

const productRepository = new ProductRepository(ddbClient, productsDbd);

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const lambdaRequestId = context.awsRequestId; // Gerado no AWS Lambda a cada execução da Lambda. Você encontra o ID no CloudWatch.
  const apiRequestId = event.requestContext.requestId; // Esse é chamado da API Gateway, ele é um ID ÚNICO/EXCLUSIVO e ajuda a rastrear cada requisição HTTP.
  const method = event.httpMethod;

  console.log(`AWS LAMBDA: ${lambdaRequestId} - API GATEWAY: ${apiRequestId}`);

  if (event.resource === "/products") {
    if (method === 'GET') {
      console.log('GET /products');

      const products = await productRepository.getAllProducts();

      return {
        statusCode: 200,
        body: JSON.stringify(products)
      }
    }
  } else if (event.resource === "/products/{id}") {

    const productId = event.pathParameters!.id as string;

    console.log(`GET /products/${productId}`);

    try {
      const product = await productRepository.getProductById(productId);

      return {
        statusCode: 200,
        body: JSON.stringify(product)
      }
    } catch (error) {
      console.error((<Error>error).message);
      return {
        statusCode: 404,
        body: (<Error>error).message
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