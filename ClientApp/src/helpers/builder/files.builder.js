import reversion_fichero_fuente from '../../assets/templates/reversion/reversion_fichero_fuente.jira';
import { generatePath } from './auxiliar.builder';
import { Env, Vault } from '../../constants/index.constant';

/**
 * It generates instructions to files reversions
 * @param dataIssue - is an object that contains the data of the issue.
 * @param group - group name or key name
 * @param pathGeneralFichero - relatives path of the file
 * @returns An object with two properties: certification and production.
 */
const getFilesReversion = (dataIssue, group, pathGeneralFichero) => {
    //REVERSION FICHERO
    const listJobs = dataIssue[group][Vault.groups.jobGroup.key]
        .filter((item) => !item[Vault.fields.onlyExecution.key] && item[Vault.fields.layerScript.key] !== 'CALI');;
    let reversionFiles = '';
    let reversionFileExample = '';

    listJobs.forEach((item, index) => {
        reversionFiles += `${index + 1}.- ${item[Vault.fields.fileProcess.key]}\n`;
        reversionFileExample += `${index + 1}.- ${item[Vault.fields.fileProcess.key]}_20200916203036\n`;
    });

    const reversion_file_general = reversion_fichero_fuente
        .replaceAll('{{FILE_PROCESS}}', reversionFiles)
        .replaceAll('{{FILE_PROCESS_EJM}}', reversionFileExample);

    const reversion_file_cert = reversion_file_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{AMBIENTE}}', Env.names.certification)
        .replaceAll('{{PATH_SCRIPTS}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneralFichero));

    const reversion_file_prod = reversion_file_general
        .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{AMBIENTE}}', Env.names.production)
        .replaceAll('{{PATH_SCRIPTS}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneralFichero));

    return {
        certification: reversion_file_cert, 
        production: reversion_file_prod,
    };
}

export { getFilesReversion }