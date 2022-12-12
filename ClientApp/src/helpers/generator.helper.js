import { Jira, Env, Vault } from '../constants/index.constant';
import { buildDescriptionInstructions } from './builder/description.builder';
import { getAvroDeletedInstructions, getCopyAvroInstructions, getAvroPartitionedDeletedInstructions } from './builder/avro.builder';
import { buildBackupInstructions } from './builder/backup.builder';
import { getDDLReversion } from './builder/ddl.builder';
import { getTableDefinitionInstructions } from './builder/table.definition.builder';
import { getFilesReversion } from './builder/files.builder';
import { getJenkinsInstructions } from './builder/jenkins.builder';
import { getMSSQLInstructions } from './builder/mssql.builder';
import { getReversionOracleInstruction } from './builder/oracle.builder';
import { getExecuteProcessInstructions } from './builder/process.builder';
import { verifyIsNeeded } from './builder/auxiliar.builder';

/**
 * It generates instructions for a given type issue.
 * @param dataIssue - is the object that contains all the data that is going to be used to generate the
 * instructions.
 * @returns An object with the following properties:
 * group, summary, security, groupAgileOps, gobernance, productOwner, technicalLead, qualityAssurance,
 * certificationInstruction, productionInstruction, reversionInstruction, description,
 * proccessBitbucket, metadataBitbucket, linajeBitbucket
 */
const generateInstructions = (dataIssue) => {
    const needBackup = verifyIsNeeded(dataIssue, Vault.groups.backup.key);
    const needProcess = verifyIsNeeded(dataIssue, Vault.groups.process.key);
    const needDataEntry = verifyIsNeeded(dataIssue, Vault.groups.dataEntry.key);
    const needMetadata = verifyIsNeeded(dataIssue, Vault.groups.metadata.key);
    const needLinaje = verifyIsNeeded(dataIssue, Vault.groups.linaje.key);
    const extractionEgine = needProcess && dataIssue[Vault.groups.process.key][Vault.fields.extractionEngine.key];
    
    let instructionsGenerated = null;

    if(!needBackup && !needProcess && !needDataEntry) instructionsGenerated = generateMetadataLinajeInstructions(dataIssue, needMetadata, needLinaje);
    if(!needDataEntry && needProcess && !extractionEgine) instructionsGenerated = generateChargeProcessInstructions(dataIssue, needProcess, needBackup, needMetadata, needLinaje);
    if(!needDataEntry && needProcess && extractionEgine) instructionsGenerated = generateExtractionEngineInstructions(dataIssue, needProcess, needMetadata, needLinaje);
    if(needDataEntry && !needProcess) instructionsGenerated = generateDataEntryInstructions(dataIssue, needDataEntry, needMetadata, needLinaje);

    if(!instructionsGenerated) throw ('No se detecto ninguna instrucción a generar!');

    const certification = instructionsGenerated.instructions.certification;
    const production = instructionsGenerated.instructions.production;
    const reversion = instructionsGenerated.reversion.certification + instructionsGenerated.reversion.production;

    const execute = needProcess ? dataIssue[Vault.groups.process.key][Vault.fields.executeAutomated.key] : false;
    const summary = dataIssue[Vault.groups.roles.key][Vault.fields.summary.key];
    const issueSummary = (execute & needProcess ? '[CAMB - CHECK / AUTOMATIZADO] ' + summary : summary);
    const description = buildDescriptionInstructions(dataIssue, needProcess || needDataEntry, needBackup, needMetadata, needLinaje);

    return {
        group: dataIssue[Vault.groups.roles.key][Vault.fields.group.key],
        summary: issueSummary,
        security: dataIssue[Vault.groups.roles.key][Vault.fields.security.key],
        groupAgileOps: dataIssue[Vault.groups.roles.key][Vault.fields.groupAgileOps.key],
        gobernance: dataIssue[Vault.groups.roles.key][Vault.fields.gobernance.key],
        productOwner: dataIssue[Vault.groups.roles.key][Vault.fields.productOwner.key],
        technicalLead: dataIssue[Vault.groups.roles.key][Vault.fields.technicalLead.key],
        qualityAssurance: dataIssue[Vault.groups.roles.key][Vault.fields.qualityAssurance.key],
        sourceMVP: dataIssue[Vault.groups.roles.key][Vault.fields.sourceMVP.key],
        typeRequirement: dataIssue[Vault.groups.roles.key][Vault.fields.typeRequirement.key],
        numberTicket: dataIssue[Vault.groups.roles.key][Vault.fields.numberTicket.key],
        certificationInstruction: certification,
        productionInstruction: production,
        reversionInstruction: reversion,
        description: description,
        proccessBitbucket: instructionsGenerated.bitbucket.process,
        metadataBitbucket: instructionsGenerated.bitbucket.metadata,
        linajeBitbucket: instructionsGenerated.bitbucket.linaje,
    };
}

/**
 * It generates instructions for a metadata or lineage process.
 * @param dataIssue - the object that contains all the data from the form
 * @param needMetadata - boolean
 * @param needLinaje - boolean
 * @returns An object with 3 properties: instructions, reversion, and bitbucket.
 */
const generateMetadataLinajeInstructions = (dataIssue, needMetadata, needLinaje) => {
    if(!needMetadata && !needLinaje) return null;

    //INSTRUCCIONES JENKINS    
    const jenkinsInstructions = 
        getJenkinsInstructions(dataIssue, needMetadata, needLinaje);

    const jenkins_cert = jenkinsInstructions.instructions.certification;
    const jenkins_prod = jenkinsInstructions.instructions.production;

    //REVERSION JENKINS
    const reversion_jenkins_cert = jenkinsInstructions.reversion.certification;
    const reversion_jenkins_prod = jenkinsInstructions.reversion.production;

    const bitbucketMetadata = needMetadata 
        ? {
            project: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketRepository.key],
        }
        : {};
    const bitbucketLinaje = needLinaje
        ? {
            project: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketRepository.key],
        }
        : {};

    return {
        instructions: {
            certification: jenkins_cert,
            production: jenkins_prod,
        },
        reversion: {
            certification: reversion_jenkins_cert,
            production: reversion_jenkins_prod,
        },
        bitbucket: {
            process: {},
            metadata: bitbucketMetadata,
            linaje: bitbucketLinaje,
        }
    };
}

/**
 * It generates the instructions for the process of MINSAIT extraction engine, which are the instructions 
 * for the instructions for the jenkins, the instructions for the execution of the process, copy avro files, the
 * reversion of the jenkins, the reversion of the DDL, the reversion of the
 * Oracle 
 * @param dataIssue - is the object that contains all the information of the issue.
 * @param needProcess - boolean
 * @param needBackup - boolean
 * @param needMetadata - boolean
 * @param needLinaje - boolean
 * @returns An object with 3 properties: instructions, reversion, and bitbucket.
 */
const generateExtractionEngineInstructions =  (dataIssue, needProcess, needMetadata, needLinaje) => {
    if(!needProcess && !needMetadata && !needLinaje) return null;
    
    //INSTRUCCIONES JENKINS    
    const jenkinsProcessInstructions = 
        getJenkinsInstructions(dataIssue, false, false, needProcess, Vault.groups.process.key, false);
    const jenkinsMetadataLinajeInstructions = 
        getJenkinsInstructions(dataIssue, needMetadata, needLinaje, false, null, false);
    const jenkinsInstructions = 
        getJenkinsInstructions(dataIssue, needMetadata, needLinaje, needProcess, Vault.groups.process.key);

    const jenkinsProcess_cert = jenkinsProcessInstructions.instructions.certification;
    const jenkinsProcess_prod = jenkinsProcessInstructions.instructions.production;
    const jenkinsMetadataLinaje_cert = jenkinsMetadataLinajeInstructions.instructions.certification;
    const jenkinsMetadataLinaje_prod = jenkinsMetadataLinajeInstructions.instructions.production;

    //INSTRUCCIONES EJECUCION PROCESO
    const executeProcessInstructions = getExecuteProcessInstructions(dataIssue, Vault.groups.process.key);

    const ejecucion_proceso_cert = executeProcessInstructions.certification;
    const ejecucion_proceso_prod = executeProcessInstructions.production;

    //INSTRUCCIONES COPIADO AVRO
    const listProcess = dataIssue[Vault.groups.process.key][Vault.groups.jobGroup.key]
        .filter((item) => !item[Vault.fields.onlyExecution.key] && item[Vault.fields.layerScript.key] !== 'CALI');
    
    const pathGeneralTemporary = [
        dataIssue[Vault.groups.process.key][Vault.fields.layerTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.unitTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.solutionTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.pathTemporary.key]
    ];

    const pathGeneralData = [
        dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key],
        dataIssue[Vault.groups.process.key][Vault.fields.unitScript.key],
        dataIssue[Vault.groups.process.key][Vault.fields.solutionScript.key],
        dataIssue[Vault.groups.process.key][Vault.fields.pathScript.key]
    ];
    
    const copyAvroInstructions = getCopyAvroInstructions(dataIssue, Vault.groups.process.key, listProcess, pathGeneralTemporary, pathGeneralData);
    const copy_avro_cert = copyAvroInstructions.certification;
    const copy_avro_prod = copyAvroInstructions.production;

    //REVERSION JENKINS
    const reversion_jenkins_cert = jenkinsInstructions.reversion.certification;
    const reversion_jenkins_prod = jenkinsInstructions.reversion.production;
    
    // REVERSION ORACLE
    const tableNames = listProcess.map((item) => item[Vault.fields.chargeProcess.key]);
    const reversion_oracle_admin = getReversionOracleInstruction(dataIssue, Vault.groups.process.key, tableNames);
    const reversion_oracle_calidad = getReversionOracleInstruction(dataIssue, Vault.groups.process.key, tableNames, 'CALIDAD');
    const reversion_oracle_ingesta = getReversionOracleInstruction(dataIssue, Vault.groups.process.key, tableNames, 'INGESTA');
    const reversion_oracle_cert = reversion_oracle_admin.certification
        + reversion_oracle_calidad.certification
        + reversion_oracle_ingesta.certification;
    const reversion_oracle_prod = reversion_oracle_admin.production
        + reversion_oracle_calidad.production
        + reversion_oracle_ingesta.production;

    // REVERSION DDL 
    const reversionDDLTables = getDDLReversion(dataIssue, Vault.groups.process.key, pathGeneralTemporary, tableNames);
    const reversionDDLView = getDDLReversion(dataIssue, Vault.groups.process.key, pathGeneralTemporary, tableNames, 'VIEW');
    const reversion_ddl_cert = reversionDDLTables.certification + reversionDDLView.certification;
    const reversion_ddl_prod =  reversionDDLTables.production + reversionDDLView.production;

    // REVERSION AVRO
    const reversionAvro = getAvroPartitionedDeletedInstructions(listProcess, pathGeneralData)
    const reversion_avro_cert = reversionAvro.certification;
    const reversion_avro_prod = reversionAvro.production;

    const bitbucketMetadata = needMetadata 
        ? {
            project: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketRepository.key],
        }
        : {};
    const bitbucketLinaje = needLinaje
        ? {
            project: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketRepository.key],
        }
        : {};

    return {
        instructions: {
            certification: jenkinsProcess_cert + ejecucion_proceso_cert + copy_avro_cert + jenkinsMetadataLinaje_cert,
            production: jenkinsProcess_prod + ejecucion_proceso_prod + copy_avro_prod + jenkinsMetadataLinaje_prod,
        },
        reversion: {
            certification: reversion_jenkins_cert + reversion_oracle_cert + reversion_ddl_cert + reversion_avro_cert,
            production: reversion_jenkins_prod + reversion_oracle_prod + reversion_ddl_prod + reversion_avro_prod,
        },
        bitbucket: {
            process: {
                project: dataIssue[Vault.groups.process.key][Vault.fields.bitbucketProject.key],
                repository: dataIssue[Vault.groups.process.key][Vault.fields.bitbucketRepository.key],
            },
            metadata: bitbucketMetadata,
            linaje: bitbucketLinaje,
        }
    };
}

/**
 * It generates the instructions for the process of a charge, which are the instructions for the
 * backup, the instructions for the jenkins, the instructions for the execution of the process, the
 * reversion of the jenkins, the reversion of the file, the reversion of the DDL, the reversion of the
 * Oracle and the bitbucket
 * @param dataIssue - is the object that contains all the information of the issue.
 * @param needProcess - boolean
 * @param needBackup - boolean
 * @param needMetadata - boolean
 * @param needLinaje - boolean
 * @returns An object with 3 properties: instructions, reversion, and bitbucket.
 */
const generateChargeProcessInstructions = (dataIssue, needProcess, needBackup, needMetadata, needLinaje) => {
    if(!needBackup && !needProcess && !needMetadata && !needLinaje) return null;
    
    //INSTRUCCIONES BACKUP
    const backup_intruction = needBackup ? buildBackupInstructions(dataIssue, Vault.groups.process.key) : null;
    const backup_instructions_cert = backup_intruction ? backup_intruction.instructions.certification : '';
    const backup_instructions_prod = backup_intruction ? backup_intruction.instructions.production : '';

    const backup_reversion_cert = backup_intruction ? backup_intruction.reversion.certification : '';
    const backup_reversion_prod = backup_intruction ? backup_intruction.reversion.production : '';

    //INSTRUCCIONES JENKINS    
    const jenkinsInstructions = 
        getJenkinsInstructions(dataIssue, needMetadata, needLinaje, needProcess, Vault.groups.process.key);

    const jenkins_cert = jenkinsInstructions.instructions.certification;
    const jenkins_prod = jenkinsInstructions.instructions.production;

    //INSTRUCCIONES EJECUCION PROCESO
    const executeProcessInstructions = getExecuteProcessInstructions(dataIssue, Vault.groups.process.key);

    const ejecucion_proceso_cert = executeProcessInstructions.certification;
    const ejecucion_proceso_prod = executeProcessInstructions.production;

    //REVERSION JENKINS
    const reversion_jenkins_cert = jenkinsInstructions.reversion.certification;
    const reversion_jenkins_prod = jenkinsInstructions.reversion.production;

    //REVERSION FICHERO
    let reversion_file_cert = '';
    let reversion_file_prod = '';

    if (dataIssue[Vault.groups.description.key][Vault.fields.typeRelease.key] === 'Modificado') {
        const pathGeneralFichero = [
            dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key],
            dataIssue[Vault.groups.process.key][Vault.fields.unitScript.key],
            dataIssue[Vault.groups.process.key][Vault.fields.solutionScript.key],
            dataIssue[Vault.groups.process.key][Vault.fields.pathScript.key]
        ];
        const fileReversionInstruccions = getFilesReversion(dataIssue, Vault.groups.process.key, pathGeneralFichero);

        reversion_file_cert = fileReversionInstruccions.certification;
        reversion_file_prod = fileReversionInstruccions.production;
    }
    
    // REVERSION DDL 
    const tableNames = dataIssue[Vault.groups.process.key][Vault.groups.jobGroup.key]
        .filter((item) => !item[Vault.fields.onlyExecution.key])
        .map((item) => item[Vault.fields.chargeProcess.key]);

    const pathGeneralTemporary = [
        dataIssue[Vault.groups.process.key][Vault.fields.layerTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.unitTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.solutionTemporary.key],
        dataIssue[Vault.groups.process.key][Vault.fields.pathTemporary.key]
    ];

    const reversionDDL = getDDLReversion(dataIssue, Vault.groups.process.key, pathGeneralTemporary, tableNames);
    const reversion_ddl_cert = reversionDDL.certification;
    const reversion_ddl_prod =  reversionDDL.production;

    // REVERSION ORACLE
    const reversion_oracle = getReversionOracleInstruction(dataIssue, Vault.groups.process.key, tableNames) ;
    const reversion_oracle_cert = reversion_oracle.certification;
    const reversion_oracle_prod = reversion_oracle.production;

    const bitbucketMetadata = needMetadata 
        ? {
            project: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketRepository.key],
        }
        : {};
    const bitbucketLinaje = needLinaje
        ? {
            project: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketRepository.key],
        }
        : {};

    return {
        instructions: {
            certification: backup_instructions_cert + jenkins_cert + ejecucion_proceso_cert,
            production: backup_instructions_prod + jenkins_prod + ejecucion_proceso_prod,
        },
        reversion: {
            certification: reversion_jenkins_cert + reversion_file_cert + reversion_ddl_cert + reversion_oracle_cert + backup_reversion_cert,
            production: reversion_jenkins_prod + reversion_file_prod + reversion_ddl_prod + reversion_oracle_prod + backup_reversion_prod,
        },
        bitbucket: {
            process: {
                project: dataIssue[Vault.groups.process.key][Vault.fields.bitbucketProject.key],
                repository: dataIssue[Vault.groups.process.key][Vault.fields.bitbucketRepository.key],
            },
            metadata: bitbucketMetadata,
            linaje: bitbucketLinaje,
        }
    };
}

/**
 * It generates instructions for a data entry process.
 * @param dataIssue - the object that contains all the data from the form
 * @param needDataEntry - boolean
 * @param needMetadata - boolean
 * @param needLinaje - boolean
 * @returns An object with 3 properties: instructions, reversion, and bitbucket.
 */
const generateDataEntryInstructions = (dataIssue, needDataEntry, needMetadata, needLinaje) => {
    if(!needDataEntry && !needMetadata && !needLinaje) return null;
    
    //INSTRUCCIONES JENKINS    
    const jenkinsInstructions = getJenkinsInstructions(dataIssue, needMetadata, needLinaje, needDataEntry, Vault.groups.dataEntry.key);

    const jenkins_cert = jenkinsInstructions.instructions.certification;
    const jenkins_prod = jenkinsInstructions.instructions.production;

    const sqlExecuteInstructions = getMSSQLInstructions(dataIssue, Vault.groups.dataEntry.key);
    const sqlExecute_cert = sqlExecuteInstructions.certification;
    const sqlExecute_prod = sqlExecuteInstructions.production;

    const defineTableInstructions = getTableDefinitionInstructions(dataIssue, Vault.groups.dataEntry.key);
    const tableDefined_cert = defineTableInstructions.certification;
    const tableDefined_prod = defineTableInstructions.production;

    const deletedAvroInstruction_prod = needMetadata ? getAvroDeletedInstructions(dataIssue, Vault.groups.dataEntry.key).production : '';

    //REVERSION JENKINS
    const reversion_jenkins_cert = jenkinsInstructions.reversion.certification;
    const reversion_jenkins_prod = jenkinsInstructions.reversion.production;
    
    // REVERSION DDL 
    const tableName = dataIssue[Vault.groups.dataEntry.key][Vault.fields.tableName.key];
    const pathGeneralTemporary = ['rdv', 'tmp'];

    const reversionDDL = getDDLReversion(dataIssue, Vault.groups.dataEntry.key, pathGeneralTemporary, [tableName]);
    const reversion_ddl_cert = reversionDDL.certification;
    const reversion_ddl_prod =  reversionDDL.production;

    const bitbucketMetadata = needMetadata 
        ? {
            project: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.metadata.key][Vault.fields.bitbucketRepository.key],
        }
        : {};
    const bitbucketLinaje = needLinaje
        ? {
            project: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketRepository.key],
        }
        : {};

    return {
        instructions: {
            certification: jenkins_cert + sqlExecute_cert + tableDefined_cert,
            production: jenkins_prod + sqlExecute_prod + tableDefined_prod + deletedAvroInstruction_prod,
        },
        reversion: {
            certification: reversion_jenkins_cert + reversion_ddl_cert,
            production: reversion_jenkins_prod + reversion_ddl_prod,
        },
        bitbucket: {
            process: {
                project: dataIssue[Vault.groups.dataEntry.key][Vault.fields.bitbucketProject.key],
                repository: dataIssue[Vault.groups.dataEntry.key][Vault.fields.bitbucketRepository.key],
            },
            metadata: bitbucketMetadata,
            linaje: bitbucketLinaje,
        }
    };
}

export { generateInstructions };