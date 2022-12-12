import instrucciones_backup from '../../assets/templates/instructions/instrucciones_backup.jira';
import reversion_informacion from '../../assets/templates/reversion/reversion_informacion.jira';
import reversion_msck_repair from '../../assets/templates/reversion/reversion_msck_repair.jira';
import { generatePath, getBitbucketPath } from './auxiliar.builder';
import { Env, Vault } from '../../constants/index.constant';

/**
 * It generate backup table instructions
 * @param dataIssue - issue data
 * @param group - group name or key name
 * @returns An object with two properties: instructions and reversion.
 */
const buildBackupInstructions = (dataIssue, group) => {
    // INSTRUCCIONES BACKUP 
    const tableNameBackup =  dataIssue[Vault.groups.backup.key][Vault.fields.tableName.key];
    const instrucciones_backup_general = instrucciones_backup
        .replaceAll('{{BITBUCKET_SCRIPT_BACKUP}}', dataIssue[group][Vault.fields.bitbucketUrl.key])
        .replaceAll('{{TABLE_NAME_BACKUP}}', tableNameBackup);
    
    const pathGeneral = [
        dataIssue[group][Vault.fields.layerTemporary.key],
        dataIssue[group][Vault.fields.unitTemporary.key],
        dataIssue[group][Vault.fields.solutionTemporary.key],
        dataIssue[group][Vault.fields.pathTemporary.key]
    ];

    const backup_cert = instrucciones_backup_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase())
        .replaceAll('{{AMBIENTE}}', Env.names.certification)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneral))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification)
        .replaceAll('{{GROUP_LKDV}}', Env.groupLKDV.certification)
        .replaceAll('{{USER_KINIT}}', Env.userKinit.certification)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.certification);

    const backup_prod = instrucciones_backup_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase())
        .replaceAll('{{AMBIENTE}}', Env.names.production)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneral))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production)
        .replaceAll('{{GROUP_LKDV}}', Env.groupLKDV.production)
        .replaceAll('{{USER_KINIT}}', Env.userKinit.production)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.production);

    //REVERSION INFORMACION
    const pathData = [
        dataIssue[group][Vault.fields.layerTemporary.key],
        dataIssue[group][Vault.fields.unitTemporary.key],
        dataIssue[group][Vault.fields.solutionTemporary.key],
    ];

    const instrucciones_reversion_informacion_general = reversion_informacion
        .replaceAll('{{TABLE_NAME_BACKUP}}', tableNameBackup);

    const reversion_info_cert = instrucciones_reversion_informacion_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification)
        .replaceAll('{{PATH_DATA}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathData))

    const reversion_info_prod = instrucciones_reversion_informacion_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production)
        .replaceAll('{{PATH_DATA}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathData))

    const reversionBitbucketUrl = getBitbucketPath(dataIssue, group);

    const instrucciones_reversion_msck_general = reversion_msck_repair
        .replaceAll('{{BITBUCKET_SCRIPT_REVERSION}}', reversionBitbucketUrl)
        .replaceAll('{{TABLE_NAME_BACKUP}}', tableNameBackup);

    const reversion_msck_cert = instrucciones_reversion_msck_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase())
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneral))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification)
        .replaceAll('{{USER_KINIT}}', Env.userKinit.certification)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.certification);

    const reversion_msck_prod = instrucciones_reversion_msck_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase())
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneral))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production)
        .replaceAll('{{USER_KINIT}}', Env.userKinit.production)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.production);

    return {
        instructions: {
            certification: backup_cert,
            production: backup_prod,
        },
        reversion: {
            certification: reversion_info_cert + reversion_msck_cert,
            production: reversion_info_prod + reversion_msck_prod,
        }
    };
}

export { buildBackupInstructions };