import instrucciones_definicion_tabla from '../../assets/templates/instructions/instrucciones_definicion_tabla.jira';
import { Jira, Env, Vault } from '../../constants/index.constant';

/**
 * It generates table definition instructions
 * @param dataIssue - is an object that contains all the information from the Jira issue.
 * @param group - group name or key name
 * @returns An object with two properties: certification and production.
 */
const getTableDefinitionInstructions = (dataIssue, group) => {
    const instrucciones_definicion_tabla_general = instrucciones_definicion_tabla
        .replaceAll('{{HOST_IMAGE_SERVER}}', Jira.serverImage)
        .replaceAll('{{PROCESS_NAME_DATAENTRY}}', dataIssue[group][Vault.fields.tableName.key])
        .replaceAll('{{PARTITION_OPTION}}', dataIssue[group][Vault.fields.parititionType.key]);

    const instrucciones_definicion_tabla_cert = instrucciones_definicion_tabla_general
        .replaceAll('{{DATAENTRY_HOST}}', Env.dataEntryHost.certification);

    const instrucciones_definicion_tabla_prod = instrucciones_definicion_tabla_general
        .replaceAll('{{DATAENTRY_HOST}}', Env.dataEntryHost.production);

    return {
        certification: instrucciones_definicion_tabla_cert,
        production: instrucciones_definicion_tabla_prod
    }
}

export { getTableDefinitionInstructions }