# Ecommerce AWS

Esse projeto tem a finalidade de entender sobre o AWS Cloud Development Kit e AWS Software Development Kit.

Nsse projeto, o pensado foi um ecommerce utilizando tal ecossistema da AWS utilizando:
- AWS Lambda e Lambda LayerS
- AWS SNS
- REST API com API GATEWAY
- AWS DynamoDB e DynamoDB Stream
- AWS S3
- WebSocket API com o AWS API Gateway
- AWS SES
- AWS SNS
- AWS EventBridge
- AWS IAM
- AWS X-Ray
- AWS CloudWatch Alarms/Insights
- AWS Cost Explorer

No projeto será criado um Ecommerce contendo:
- Ecommerce ficticio 
- Gerenciamento de produtos
- Gerenciamento de pedidos
- Geração de Eventos 
- Importação de notas fiscais
- Auditoria


-> COMANDOS

- cdk bootstrap = Utilizado uma unica vez por conta/região
- cdk list - Lista todas as STACK do projeto
- cdk deploy --all - Instalação de todas as stacks que possui no projeto

URL test -> https://qiqhyy4pui.execute-api.us-east-1.amazonaws.com/prod/