import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
  readonly productFetchHandler: lambdaNodeJS.NodejsFunction;
  readonly productDdb: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.productDdb = new dynamodb.Table(this, "ProductsDdb", {
      tableName: "products",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.productFetchHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsFetchFunction", 
      { 
        runtime: lambda.Runtime.NODEJS_LATEST,
        functionName: "ProductsFetchFunction", 
        entry: "lambda/products/productsFetchFunction.ts", 
        handler: "handler",
        memorySize: 512,
        timeout: cdk.Duration.seconds(10),
        bundling: {
          minify: true,
          sourceMap: false
        },
        environment: {
          PROCUTS_DDB: this.productDdb.tableName
        }
      });
    
    this.productDdb.grantReadData(this.productFetchHandler);
  };
}
