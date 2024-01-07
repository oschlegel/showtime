import { AmplifyApp } from '@cdktf/provider-aws/lib/amplify-app';
import { AmplifyBranch } from '@cdktf/provider-aws/lib/amplify-branch';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamRolePolicy } from '@cdktf/provider-aws/lib/iam-role-policy';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { App, TerraformStack, TerraformVariable } from 'cdktf';
import { Construct } from 'constructs';

export class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, 'AWS', {
      region: 'eu-central-1',
    });

    const githubAccessToken = new TerraformVariable(
      this,
      'github_access_token',
      {
        type: 'string',
        description: 'Github access token',
      }
    );

    const serviceRole = new IamRole(this, 'service-role', {
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'amplify.amazonaws.com',
            },
            Effect: 'Allow',
          },
        ],
      }),
    });

    new IamRolePolicy(this, 'service-role-policy', {
      name: 'service-role-policy',
      role: serviceRole.id,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PushLogs',
            Effect: 'Allow',
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Resource:
              'arn:aws:logs:eu-central-1:655755393910:log-group:/aws/amplify/*:log-stream:*',
          },
          {
            Sid: 'CreateLogGroup',
            Effect: 'Allow',
            Action: 'logs:CreateLogGroup',
            Resource:
              'arn:aws:logs:eu-central-1:655755393910:log-group:/aws/amplify/*',
          },
          {
            Sid: 'DescribeLogGroups',
            Effect: 'Allow',
            Action: 'logs:DescribeLogGroups',
            Resource: 'arn:aws:logs:eu-central-1:655755393910:log-group:*',
          },
          {
            Sid: 'SSMParameterStore',
            Effect: 'Allow',
            Action: [
              'ssm:GetParametersByPath',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:DescribeParameters',
            ],
            Resource: '*',
          },
        ],
      }),
    });

    const amplifyApp = new AmplifyApp(this, 'browser-app', {
      name: 'browser-app',
      repository: 'https://github.com/oschlegel/showtime',
      accessToken: githubAccessToken.value,
      buildSpec: `
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npx nx run browser-app:build
  artifacts:
    baseDirectory: dist/apps/browser/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`,
      enableAutoBranchCreation: false,
      enableBranchAutoBuild: false,
      enableBranchAutoDeletion: false,
      platform: 'WEB_COMPUTE',
      iamServiceRoleArn: serviceRole.arn,
    });

    new AmplifyBranch(this, 'main', {
      appId: amplifyApp.id,
      branchName: 'main',
      enableAutoBuild: true,
      framework: 'Next.js - SSR',
      stage: 'PRODUCTION',
    });
  }
}

const app = new App();
new MyStack(app, 'browser-app');
app.synth();
