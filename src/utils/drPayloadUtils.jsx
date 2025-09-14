export function buildAzurePayload(rows, projectName) {
  return rows.reduce(
    (acc, item) => {
      if (!acc.subscriptionId) {
        acc.subscriptionId = "d6240a3c-34a4-4a5c-955b-06228bf34ca8";
        acc.resourceGroupName = projectName;
        acc.targetRegion = "centralus";
        acc.resourceSuffix = "cus-dr";
        acc.provider = "azure";
      }

      const type = item.type?.toLowerCase();
      const name = item.resourceName;

      if (type === "app service" && !acc.webApps.includes(name)) acc.webApps.push(name);
      else if (type === "function app" && !acc.functionApps.includes(name)) acc.functionApps.push(name);
      else if (type === "virtual machine" && !acc.virtualMachines.includes(name)) acc.virtualMachines.push(name);
      else if (type === "sql server" && !acc.sqlServers.includes(name)) acc.sqlServers.push(name);
      else if (type === "logic app" && !acc.logicApps.includes(name)) acc.logicApps.push(name);
      else if (type === "aks" && !acc.kubernetes.includes(name)) acc.kubernetes.push(name);

      return acc;
    },
    {
      subscriptionId: null,
      resourceGroupName: null,
      targetRegion: null,
      resourceSuffix: null,
      webApps: [],
      functionApps: [],
      virtualMachines: [],
      sqlServers: [],
      logicApps: [],
      kubernetes: [],
      provider: null,
    }
  );
}

export function buildAwsPayload(rows, projectName) {
  return rows.reduce(
    (acc, item) => {
      if (!acc.provider) {
        acc.provider = "aws";
        acc.projectName = projectName;
        acc.sourceRegion = item.location?.toLowerCase() || "us-east-2";
        acc.targetRegion = "us-west-1";
        acc.resourceSuffix = "-dr";
      }

      const type = item.type?.toLowerCase();
      const name = item.resourceName;

      if (type === "ec2" && !acc.ec2Ids.includes(name)) acc.ec2Ids.push(name);
      else if (type === "rds" && !acc.rdsIds.includes(name)) acc.rdsIds.push(name);
      else if (type === "lambda" && !acc.lambdaIds.includes(name)) acc.lambdaIds.push(name);
      else if (type === "eks" && !acc.eksIds.includes(name)) acc.eksIds.push(name);

      return acc;
    },
    {
      provider: null,
      sourceRegion: null,
      targetRegion: null,
      resourceSuffix: null,
      ec2Ids: [],
      rdsIds: [],
      lambdaIds: [],
      eksIds: [],
    }
  );
}

export function buildGcpPayload(rows) {
  return rows.reduce(
    (acc, item) => {
      if (!acc.provider) {
        acc.provider = "gcp";
        acc.sourceRegion = item.location?.toLowerCase() || "us-east-2";
        acc.targetRegion = "us-central1";
        acc.resourceSuffix = "-drdd";
        acc.sourceProjectId = "drd-project-462808";
        acc.sourceProjectName = "selected-project";
      }

      const type = item.type?.toLowerCase();
      const name = item.resourceName;

      if (type === "computeengine" && !acc.gceIds.includes(name)) {
        acc.gceIds.push(name);
        acc.gceSourceZone = "-b";
        acc.gceTargetZone = "-a";
      } else if (type === "sql" && !acc.sqlIds.includes(name)) {
        acc.sqlIds.push(name);
      } else if (type === "gke" && !acc.gkeIds.includes(name)) {
        acc.gkeIds.push(name);
      }

      return acc;
    },
    {
      provider: null,
      sourceRegion: null,
      targetRegion: null,
      resourceSuffix: null,
      sourceProjectId: "",
      sourceProjectName: "",
      gceIds: [],
      sqlIds: [],
      gkeIds: [],
      gceSourceZone: "",
      gceTargetZone: "",
    }
  );
}