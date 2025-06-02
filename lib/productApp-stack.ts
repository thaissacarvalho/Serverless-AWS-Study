import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm"; // AWS SYSTEMS MANAGER

export class ProductsAppStack extends cdk.Stack {
  readonly productFetchHandler: lambdaNodeJS.NodejsFunction;
  readonly productAdminHandler: lambdaNodeJS.NodejsFunction;
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

    // Products Layer
    const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn");
    const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn);

    this.productFetchHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsFetchFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        functionName: "ProductsFetchFunction",
        entry: "lambda/products/productsFetchFunction.ts",
        handler: "handler",
        memorySize: 512,
        timeout: cdk.Duration.seconds(10),
        bundling: {
          minify: true,
          sourceMap: false,
          nodeModules: [
            'aws-xray-sdk-core'
          ]
        },
        environment: {
          PRODUCTS_DDB: this.productDdb.tableName
        },
        layers: [productsLayer],
        tracing: lambda.Tracing.ACTIVE
      });

    this.productDdb.grantReadData(this.productFetchHandler); // Somente ler a informação do handler

    this.productAdminHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsAdminFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        functionName: "ProductsAdminFunction",
        entry: "lambda/products/productsAdminFunction.ts",
        handler: "handler",
        memorySize: 512,
        timeout: cdk.Duration.seconds(10),
        bundling: {
          minify: true,
          sourceMap: false,
          nodeModules: [
            'aws-xray-sdk-core'
          ]
        },
        environment: {
          PRODUCTS_DDB: this.productDdb.tableName
        },
        layers: [productsLayer],
        tracing: lambda.Tracing.ACTIVE
      });

    this.productDdb.grantWriteData(this.productAdminHandler); // Somente escrever a informação do handler
  };
}
