import reversion_parametros_oracle from '../../assets/templates/reversion/reversion_parametros_oracle.jira';

import { getBitbucketPath } from './auxiliar.builder';
import { Env } from '../../constants/index.constant';

/**
 * It generates oracle reversion instructions
 * @param dataIssue - is the object that contains all the data of the issue.
 * @param group - group name or key name.
 * @param [schema=ADMIN] - the schema name.
 * @returns An object with two properties: certification and production.
 */
const getReversionOracleInstruction = (dataIssue, group, processNames, schema = 'ADMIN') => {
    //REVERSION ORACLE
    const reversionBitbucketUrl = getBitbucketPath(dataIssue, group);

    `- REV_{{AMBIENTE_UPPER}}_DML_{{TABLE_NAME_BACKUP}}.sql
    `;

    let listProcess = '';

    processNames.forEach(element => {
        listProcess += `- {{AMBIENTE_UPPER}}_DML_${schema}_${element}_REV.sql
        `;
    });
    
    const instrucciones_reversion_oracle_general = reversion_parametros_oracle
        .replaceAll('{{BITBUCKET_SCRIPT_REVERSION}}', reversionBitbucketUrl)
        .replaceAll('{{SCHEMA_NAME}}', schema)
        .replaceAll('{{LIST_JOBS}}', listProcess);

    const reversion_oracle_cert = instrucciones_reversion_oracle_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase())
        .replaceAll('{{SERVIDOR_ORACLE}}', Env.oracleServer.certification)
        .replaceAll('{{BASEDATOS_ORACLE}}', Env.oracleDataBase.certification);

    const reversion_oracle_prod = instrucciones_reversion_oracle_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase())
        .replaceAll('{{SERVIDOR_ORACLE}}', Env.oracleServer.production)
        .replaceAll('{{BASEDATOS_ORACLE}}', Env.oracleDataBase.production);

    return {
        certification: reversion_oracle_cert, 
        production: reversion_oracle_prod
    };
}

export { getReversionOracleInstruction }