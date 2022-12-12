import instrucciones_ejecucion_sql from '../../assets/templates/instructions/instrucciones_ejecucion_sql.jira';
import { getBitbucketPath } from './auxiliar.builder';
import { Env, Vault } from '../../constants/index.constant';

/**
 * It generates MSSQL instructions
 * @param dataIssue - is an object that contains the data of the issue.
 * @param group - group name or key name
 * @returns An object with two properties, certification and production.
 */
const getMSSQLInstructions = (dataIssue, group) => {
    const bitbucket_url = getBitbucketPath(dataIssue, group, '');

    const instrucciones_ejecucion_sql_general = instrucciones_ejecucion_sql
        .replaceAll('{{BITBUCKET_DATAENTRY_URL}}', bitbucket_url)
        .replaceAll('{{PROCESS_NAME_DATAENTRY}}', dataIssue[group][Vault.fields.tableName.key]);

    const instrucciones_ejecucion_sql_cert = instrucciones_ejecucion_sql_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{SERVER_APP_WEB_DATAENTRY}}', Env.dataEntryWebServer.certification)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{SERVER_MSSQL_DATAENTRY}}', Env.dataEntryMSSQL.certification)
        .replaceAll('{{BRANCH}}', Env.branch.certification);

    const instrucciones_ejecucion_sql_prod = instrucciones_ejecucion_sql_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{SERVER_APP_WEB_DATAENTRY}}', Env.dataEntryWebServer.production)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{SERVER_MSSQL_DATAENTRY}}', Env.dataEntryMSSQL.production)
        .replaceAll('{{BRANCH}}', Env.branch.production);

    return {
        certification: instrucciones_ejecucion_sql_cert,
        production: instrucciones_ejecucion_sql_prod
    }
}

export { getMSSQLInstructions }