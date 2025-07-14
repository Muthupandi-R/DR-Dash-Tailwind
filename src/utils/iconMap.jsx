// src/utils/iconMap.js
import AwsCompute from '../assets/Icons/aws/ec2.png';
import AwsDb from '../assets/Icons/aws/rds.png';
import AwsKubernetes from '../assets/Icons/aws/eks.png';
import AwsServerlessComputing from '../assets/Icons/aws/lambda.png';
import AwsServerlessWorkflow from '../assets/Icons/aws/elasticbeanstalk.png';

import AzureCompute from '../assets/Icons/azure/virtualmachine.png';
import AzureDb from '../assets/Icons/azure/sqlserver.png';
import AzureKubernetes from '../assets/Icons/azure/aks.png';
import AzureServerlessComputing from '../assets/Icons/azure/functionapp.png';
import AzureServerlessWorkflow from '../assets/Icons/azure/webapp.png';

import GcpCompute from '../assets/Icons/gcp/computeengine.png';
import GcpDb from '../assets/Icons/gcp/sql.png';
import GcpKubernetes from '../assets/Icons/gcp/gke.png';
import GcpServerlessComputing from '../assets/Icons/gcp/cloudfunction.png';
import GcpServerlessWorkflow from '../assets/Icons/gcp/workflow.png';

const iconMap = {
  aws: {
    ec2: AwsCompute,
    rds: AwsDb,
    eks: AwsKubernetes,
    lambda: AwsServerlessComputing,
    elasticbeanstalk: AwsServerlessWorkflow,
  },
  azure: {
    virtualmachine: AzureCompute,
    sqlserver: AzureDb,
    aks: AzureKubernetes,
    functionapp: AzureServerlessComputing,
    webapp: AzureServerlessWorkflow,
  },
  gcp: {
    computeengine: GcpCompute,
    sql: GcpDb,
    gke: GcpKubernetes,
    cloudfunction: GcpServerlessComputing,
    workflow: GcpServerlessWorkflow,
  },
};

export const getIcon = (cloud, serviceType) => {
  const cleanKey = serviceType.replace(/\s+/g, '').toLowerCase();
  return iconMap?.[cloud?.toLowerCase()]?.[cleanKey] || null;
};
