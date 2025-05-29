#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from "../lib/productApp-stack";
import { EcommerceAPIStack } from "../lib/ecommerceApi-stack";
import { ProductsAppLayersStack } from '../lib/productAppLayers-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "529088271277",
  region: "us-east-1",
};

const tags = {
  cost: "ECommerce",
  team: "SiecolaCode",
};

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env
});

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env
});

productsAppStack.addDependency(productsAppLayersStack);

const eCommerceAPIStack = new EcommerceAPIStack(app, "EcommerceApp", {
  productsFetchHandler: productsAppStack.productFetchHandler,
  productsAdminHandler: productsAppStack.productAdminHandler,
  tags: tags,
  env: env
});

eCommerceAPIStack.addDependency(productsAppStack);