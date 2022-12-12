import instrucciones_eliminacion_avro from '../../assets/templates/instructions/instrucciones_eliminacion_avro.jira';
import instrucciones_copy_avro from '../../assets/templates/instructions/instrucciones_copy_avro.jira';
import instrucciones_eliminacion_avro_paritioned from '../../assets/templates/instructions/instrucciones_eliminacion_avro_paritioned.jira';
import { Env, Vault } from '../../constants/index.constant';
import { generatePath, getBitbucketPath } from './auxiliar.builder';

/**
 * It generates instructions to delete avro files
 * @param dataIssue - is an object that contains the data of the issue.
 * @param group - group name or key name
 * @returns An object with two properties: certification and production.
 */
const getAvroDeletedInstructions = (dataIssue, group) => {
    const instrucciones_eliminacion_avro_general = instrucciones_eliminacion_avro
        .replaceAll('{{PROCESS_NAME}}', dataIssue[group][Vault.fields.tableName.key].toUpperCase())
        .replaceAll('{{PROCESS_NAME_LOWERCASE}}', dataIssue[group][Vault.fields.tableName.key].toLowerCase());

    const instrucciones_eliminacion_avro_cert = instrucciones_eliminacion_avro_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification);

    const instrucciones_eliminacion_avro_prod = instrucciones_eliminacion_avro_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production);

    return {
        certification: instrucciones_eliminacion_avro_cert,
        production: instrucciones_eliminacion_avro_prod
    }
}

/**
 * It generates instructions to delete avro files by partition field
 * @param processNames - list of objects.
 * @param pathGeneralData - data path.
 * @returns An object with two properties, certification and production.
 */
const getAvroPartitionedDeletedInstructions = (processNames, pathGeneralData) => {
    
    let avroList = '';

    processNames.forEach((item) => {
        avroList += `hdfs dfs -rm -R {{PATH_DATA}}${item[Vault.fields.chargeProcess.key]}/fecrutinahost=1999-01-01
`;
    });

    const instrucciones_eliminacion_avro_general = instrucciones_eliminacion_avro_paritioned
        .replaceAll('{{LIST_JOBS}}', avroList);

    const instrucciones_eliminacion_avro_cert = instrucciones_eliminacion_avro_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{PATH_DATA}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneralData))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification);

    const instrucciones_eliminacion_avro_prod = instrucciones_eliminacion_avro_general
    .replaceAll('{{PATH_DATA}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneralData))
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production);

    return {
        certification: instrucciones_eliminacion_avro_cert,
        production: instrucciones_eliminacion_avro_prod
    }
}

/**
 * It generates instructions to copy  avro files by partition field
 * @param dataIssue - is an object that contains the data of the issue.
 * @param group - group name or key name.
 * @param processNames - list of objects
 * @param pathGeneralTemporary - path temporary.
 * @param pathGeneralData - path data.
 * @returns An object with two properties, certification and production.
 */
const getCopyAvroInstructions = (dataIssue, group, processNames, pathGeneralTemporary, pathGeneralData) => {
    let avroFolders = '';
    let avroPuts = '';
    let avroChmods = '';
    let avroList = '';

    processNames.forEach((item) => {
        avroFolders += `|${item[Vault.fields.chargeProcess.key]}|{{PATH_TEMPORAL}}avro|
`;
        avroPuts += `hdfs dfs -put {{PATH_TEMPORAL}}avro/${item[Vault.fields.chargeProcess.key]}/ {{PATH_DATA}}
`;
        avroChmods += `hdfs dfs -chmod -R 750 {{PATH_DATA}}${item[Vault.fields.chargeProcess.key]}/fecrutinahost=1999-01-01
`;
        avroList += `hdfs dfs -ls {{PATH_DATA}}${item[Vault.fields.chargeProcess.key]}/fecrutinahost=1999-01-01
`;
    });

    const bitbucket_url = getBitbucketPath(dataIssue, group, '');

    const instrucciones_copy_avro_general = instrucciones_copy_avro
        .replaceAll('{{LIST_FOLDERS_AVRO}}', avroFolders)
        .replaceAll('{{LIST_PUT_AVRO}}', avroPuts)
        .replaceAll('{{LIST_CHMOD_AVRO}}', avroChmods)
        .replaceAll('{{LIST_LS_AVRO}}', avroList)
        .replaceAll('{{URL_BITBUCKET}}', bitbucket_url);
    
    const instrucciones_copy_avro_cert = instrucciones_copy_avro_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.certification)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneralTemporary))
        .replaceAll('{{PATH_DATA}}', generatePath(Env.names.certification, Env.subsidiary.certification, ...pathGeneralData))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.certification)
        .replaceAll('{{GROUP_LKDV}}', Env.groupLKDV.certification);

    const instrucciones_copy_avro_prod = instrucciones_copy_avro_general
        .replaceAll('{{SERVIDOR_LKDV}}', Env.serverLKDV.production)
        .replaceAll('{{PATH_TEMPORAL}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneralTemporary))
        .replaceAll('{{PATH_DATA}}', generatePath(Env.names.production, Env.subsidiary.production, ...pathGeneralData))
        .replaceAll('{{USER_LKDV}}', Env.userLKDV.production)
        .replaceAll('{{GROUP_LKDV}}', Env.groupLKDV.production);

    return {
        certification: instrucciones_copy_avro_cert,
        production: instrucciones_copy_avro_prod
    }
}

export { getAvroDeletedInstructions, getCopyAvroInstructions, getAvroPartitionedDeletedInstructions }