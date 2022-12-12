import instrucciones_descripcion from '../../assets/templates/instructions/descripcion_template.jira';
import { generateJobList } from './auxiliar.builder';
import { Vault } from '../../constants/index.constant';

/**
 * It generates data of the description issue
 * @param dataIssue - is an object that contains all the data of the form
 * @param existsAnyProcess - boolean
 * @param existsBackup - boolean
 * @param existsMetadata - boolean
 * @param existsLinaje - boolean
 * @returns A string with format (description issue)
 */
const buildDescriptionInstructions = (dataIssue, existsAnyProcess, existsBackup, existsMetadata, existsLinaje) => {
    let jobList = '';

    dataIssue[Vault.groups.description.key][Vault.groups.jobGroup.key].forEach(element => {
        jobList += existsAnyProcess 
        ? generateJobList(element[Vault.fields.layerScript.key],
            element[Vault.fields.processName.key],
            element[Vault.fields.technologyProcess.key],
            element[Vault.fields.jobHostId.key]) 
        : '';
    });

    jobList += existsMetadata 
        ? generateJobList('NA', dataIssue[Vault.groups.description.key][Vault.fields.processNameMetadata.key], 'METADATA', 'NA')
        : '';

    jobList += existsLinaje 
        ? generateJobList('NA', dataIssue[Vault.groups.description.key][Vault.fields.processNameLinaje.key], 'LINAJE', 'NA') 
        : '';

    const criticalRutineDesc = dataIssue[Vault.groups.description.key][Vault.fields.nameCriticalRutine.key] !== '' 
        ? dataIssue[Vault.groups.description.key][Vault.fields.nameCriticalRutine.key]
        : 'NA';

    const relationships = dataIssue[Vault.groups.description.key][Vault.fields.relationships.key] !== '' 
        ? dataIssue[Vault.groups.description.key][Vault.fields.relationships.key]
        : 'NA';

    const description = instrucciones_descripcion
        .replaceAll('{{JOBS_LIST}}', jobList)
        .replaceAll('{{IS_CRITICAL_RUTINE}}', criticalRutineDesc === 'NA' ? 'NO' : 'SI')
        .replaceAll('{{CRITICAL_RUTINE_DESC}}', criticalRutineDesc)
        .replaceAll('{{RELATIONSHIPS_SCHEDULER}}', relationships)
        .replaceAll('{{TYPE_RELEASE}}', dataIssue[Vault.groups.description.key][Vault.fields.typeRelease.key])
        .replaceAll('{{IS_CROSS}}', dataIssue[Vault.groups.description.key][Vault.fields.cross.key])
        .replaceAll('{{METADATA_IS_INCLUDED}}', existsMetadata ? 'SI' : 'NO')
        .replaceAll('{{HAVE_TABLES_MODIFIED}}', existsBackup ? 'SI' : 'NO');

    return description;
}

export { buildDescriptionInstructions }; 