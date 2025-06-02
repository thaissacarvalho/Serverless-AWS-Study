import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";

const productsDbd = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient();

const productRepository = new ProductRepository(ddbClient, productsDbd);

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  const lambdaRequestId = context.awsRequestId; // Gerado no AWS Lambda a cada execução da Lambda. Você encontra o ID no CloudWatch.
  const apiRequestId = event.requestContext.requestId; // Esse é chamado da API Gateway, ele é um ID ÚNICO/EXCLUSIVO e ajuda a rastrear cada requisição HTTP.
  const method = event.httpMethod;

  console.log(`AWS LAMBDA: ${lambdaRequestId} - API GATEWAY: ${apiRequestId}`);
  console.log("EVENT: ", JSON.stringify(event, null, 2));

  if (event.path === '/products') {
    console.log("POST - /products");

    const product = JSON.parse(event.body!) as Product;
    const productCreated = await productRepository.create(product);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productCreated)
    }
  } else if (event.path === "/products/{id}") {
    const productId = event.pathParameters!.id as string;

    if (method === "PUT") {
      console.log(`PUT - /products/${productId}`);

      const product = JSON.parse(event.body!) as Product;

      try {
        const productUpdated = await productRepository.updateProduct(productId, product);

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productUpdated)
        }
      } catch (error) {
        console.error("ERROR: ", error);
        return {
          statusCode: 404,
          body: (<Error>error).message
        }
      }
    } else if (method === "DELETE") {
      console.log(`DELETE - /products/${productId}`);

      try {
        const product = await productRepository.deleteProduct(productId);

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(product)
        }
      } catch (error) {
        console.error("ERROR: ", error);
        return {
          statusCode: 404,
          body: (<Error>error).message
        }
      }
    }
  }

  return {
    statusCode: 400,
    body: "BAD REQUEST"
  }
}