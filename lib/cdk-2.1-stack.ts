import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class Cdk21Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    const dynamoDBService = new DynamoDBService(userTable.tableName);

    const Lambdafn = (id: string, handler: string) => {
      return new lambda.Function(this, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: handler,
        code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
      });
    };

    const getUsersLambda = Lambdafn('GetUsersLambda', 'get-users-handler.handler');
    usersResource.addMethod('GET', new apigateway.LambdaIntegration(getUsersLambda));



  }
};