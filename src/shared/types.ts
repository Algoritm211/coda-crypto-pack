import * as coda from "@codahq/packs-sdk";

export type AddSyncTableParams = Parameters<InstanceType<typeof coda.PackDefinitionBuilder>['addSyncTable']>[0];

export type AddFormulaParams = Parameters<InstanceType<typeof coda.PackDefinitionBuilder>['addFormula']>[0]