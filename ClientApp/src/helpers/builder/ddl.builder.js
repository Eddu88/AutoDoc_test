import reversion_ddl from '../../assets/templates/reversion/reversion_ddl.jira';
import { generatePath, getBitbucketPath } from './auxiliar.builder';
import { Env } from '../../constants/index.constant';

/**
 * It takes in a bunch of parameters, and returns an object with two properties, certification and
 * production
 * @param dataIssue - issue data
 * @param group - group name or key name
 * @param pathGeneralTemporary - Array of relatives path
 * @param processNames - list of processes
 * @param [type=TABLE] - 'TABLE'
 * @returns An object with two properties, certification and production.
 */
const getDDLReversion = (dataIssue, group, pathGeneralTemporary, processNames, type = 'TABLE') => {
    // REVERSION DDL 
    const reversionBitbucketUrl = getBitbucketPath(dataIssue, group);

    let listProcess = '';

    processNames.forEach(element => {
        listProcess += `!run {{PATH_TEMPORAL}}{{AMBIENTE_UPPER}}_DDL_${type}_${element}_REV.hql
`;
    });

    const reversion_ddl_general = reversion_ddl
        .replaceAll('{{BITBUCKET_SCRIPT_REVERSION}}', reversionBitbucketUrl)
        .replaceAll('{{TYPE_DDL}}', type)
        .replaceAll('{{LIST_JOBS}}', listProcess);

    const reversion_ddl_cert = reversion_ddl_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase())
        .replaceAll('{{AMBIENTE}}', Env.names.certification)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneralTemporary))
        .replaceAll('{{USER_KINIT}}', Env.userKinit.certification)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.certification);

    const reversion_ddl_prod = reversion_ddl_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase())
        .replaceAll('{{AMBIENTE}}', Env.names.production)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneralTemporary))
        .replaceAll('{{USER_KINIT}}', Env.userKinit.production)
        .replaceAll('{{HIVE_HOST}}', Env.hiveHost.production);

    return {
        certification: reversion_ddl_cert, 
        production: reversion_ddl_prod
    };
}

export { getDDLReversion }