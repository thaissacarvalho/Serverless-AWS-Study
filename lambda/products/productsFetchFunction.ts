import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  if(event.resource === "/products") {
    if (event.httpMethod === 'GET') {
      
    }
  }

}