import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

class MyApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });

    const createLambdaFunction = (id: string, handler: string, method: string, resource: apigateway.Resource) => {
      const lambdaFn = new lambda.Function(this, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler,
        code: lambda.Code.fromAsset('lambda'),
        environment: {
          TABLE_NAME: userTable.tableName,
        },
      });

      resource.addMethod(method, new apigateway.LambdaIntegration(lambdaFn));

      return lambdaFn;
    };

    const api = new apigateway.RestApi(this, 'MyApi');
    const usersResource = api.root.addResource('users');

    const getUsersLambda = createLambdaFunction('GetUsersLambda', 'get-users.handler', 'GET', usersResource);
    const getUserLambda = createLambdaFunction('GetUserLambda', 'get-user.handler', 'GET', usersResource);
    const createUserLambda = createLambdaFunction('CreateUserLambda', 'create-user.handler', 'POST', usersResource);
    const updateUserLambda = createLambdaFunction('UpdateUserLambda', 'update-user.handler', 'PUT', usersResource);
    const deleteUserLambda = createLambdaFunction('DeleteUserLambda', 'delete-user.handler', 'DELETE', usersResource);
  }
}
