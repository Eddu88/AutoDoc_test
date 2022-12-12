
const Vault = {
    groups: {
        backup: { 
            key: "backup",
            value: "Proceso de backup",
        },
        process: { 
            key: "process",
            value: "Proceso principal",
        },
        metadata: { 
            key: "metadata",
            value: "Metadata",
        },
        linaje: { 
            key: "linaje",
            value: "Linaje",
        },
        roles: { 
            key: "roles",
            value: "Roles",
        },
        generatorBackup: { 
            key: "generatorBackup",
            value: "Generar Scripts",
        },
        reversion: { 
            key: "reversion",
            value: "Proceso reversion",
        },
        jobGroup: { 
            key: "jobGroup",
            value: "Grupo de procesos"
        },
        templateRepository: { 
            key: "templateRepository",
            value: "Plantilla repositorio"
        },
        description: { 
            key: "description",
            value: "Descripción"
        },
        dataEntry: { 
            key: "dataEntry",
            value: "DataEntry"
        },
        generateJobJenkins: { 
            key: "generateJobJenkins",
            value: "Job Jenkins"
        },
    },
    fields: {
        group: {
            key: "group",
            value: "Grupo",
        },
        summary: {
            key: "summary",
            value: "Titulo",
        },
        security: {
            key: "security",
            value: "Seguridad",
        },
        groupAgileOps: {
            key: "groupAgileOps",
            value: "Aplicación / Grupo AgileOps",
        },
        gobernance: {
            key: "gobernance",
            value: "Gobierno (OPS)",
        },
        productOwner: {
            key: "productOwner",
            value: "Product Owner",
        },
        technicalLead: {
            key: "technicalLead",
            value: "Líder Técnico",
        },
        qualityAssurance: {
            key: "qualityAssurance",
            value: "QA",
        },
        certificationInstruction: {
            key: "certificationInstruction",
            value: "Instrucciones para certificación",
        },
        productionInstruction: {
            key: "productionInstruction",
            value: "Instrucciones para producción",
        },
        reversionInstruction: {
            key: "reversionInstruction",
            value: "Instrucciones para reversión",
        },
        bitbucketProject: {
            key: "bitbucketProject",
            value: "Bitbucket proyecto",
        },
        bitbucketRepository: {
            key: "bitbucketRepository",
            value: "Bitbucket repositorio",
        },
        bitbucketSourceProject: {
            key: "bitbucketSourceProject",
            value: "Bitbucket proyecto fuente",
        },
        bitbucketSourceRepository: {
            key: "bitbucketSourceRepository",
            value: "Bitbucket repositorio fuente",
        },
        bitbucketTemplate: {
            key: "bitbucketTemplate",
            value: "Bitbucket plantilla fuente",
        },
        bitbucketPathScript: {
            key: "bitbucketPathScript",
            value: "Bitbucket scripts",
        },
        bitbucketUrl: {
            key: "bitbucketUrl",
            value: "Bitbucket Url",
        },
        jenkinsUrl: {
            key: "jenkinsUrl",
            value: "Pipeline Jenkins",
        },
        jenkinsFolder: {
            key: "jenkinsFolder",
            value: "Pipeline Folder",
        },
        layerTemporary: {
            key: "layerTemporary",
            value: "Taxonomía temporal - Capa",
        },
        unitTemporary: {
            key: "unitTemporary",
            value: "Taxonomía temporal - Unidad",
        },
        solutionTemporary: {
            key: "solutionTemporary",
            value: "Taxonomía temporal - Solución",
        },
        pathTemporary: {
            key: "pathTemporary",
            value: "Taxonomía temporal - Folder",
        },
        layerScript: {
            key: "layerScript",
            value: "Taxonomía scripts/jar - Capa",
        },
        unitScript: {
            key: "unitScript",
            value: "Taxonomía scripts/jar - Unidad",
        },
        solutionScript: {
            key: "solutionScript",
            value: "Taxonomía scripts/jar - Solución",
        },
        pathScript: {
            key: "pathScript",
            value: "Taxonomía scripts/jar - Folder",
        },
        tableName: {
            key: "tableName",
            value: "Nombre de la tabla",
        },
        jobId: {
            key: "jobId",
            value: "Job #",
        },
        chargeProcess: {
            key: "chargeProcess",
            value: "Id proceso carga",
        },
        fileProcess: {
            key: "fileProcess",
            value: "Fichero carga",
        },
        reusePipeline: {
            key: 'reusePipeline',
            value: "Reutilizar pipeline",
        },
        executeAutomated: {
            key: "executeAutomated",
            value: "Ejecución automatizada",
        },
        developerName: {
            key: "developerName",
            value: "Desarrollador",
        },
        projectName: {
            key: "projectName",
            value: "Projecto",
        },
        schemaNameBackup: {
            key: "schemaNameBackup",
            value: "Schema (BD)",
        },
        jobsExecute: {
            key: "jobsExecute",
            value: "Ejecución de jobs",
        },
        processName: {
            key: "processName",
            value: "Nombre del Proceso",
        },
        processNameMetadata: {
            key: "processNameMetadata",
            value: "Nombre del Proceso Metadata",
        },
        processNameLinaje: {
            key: "processNameLinaje",
            value: "Nombre del Proceso Linaje",
        },
        technologyProcess: {
            key: "technologyProcess",
            value: "Tecnología del Proceso",
        },
        jobHostId: {
            key: "jobHostId",
            value: "Job @",
        },
        criticalRutine: {
            key: "criticalRutine",
            value: "Ruta Crítica",
        },
        nameCriticalRutine: {
            key: "nameCriticalRutine",
            value: "Ruta Crítica Impactada",
        },
        relationships: {
            key: "relationships",
            value: "Predecesor / Sucesor",
        },
        typeRelease: {
            key: "typeRelease",
            value: "Nuevo o Modificado",
        },
        cross: {
            key: "cross",
            value: "Cross",
        },
        parititionType: {
            key: "parititionType",
            value: "Tipo partición",
        },
        onlyExecution: {
            key: "onlyExecution",
            value: "Solo ejecución",
        },
        extractionEngine: {
            key: "extractionEngine",
            value: "Motor extracción RDV",
        },
        sourceMVP: {
            key: "sourceMVP",
            value: "Origen MVP",
        },
        numberTicket: {
            key: "numberTicket",
            value: "Número de ticket",
        },
        typeRequirement: {
            key: "typeRequirement",
            value: "Tipo Requerimiento",
        },
        
    },
};

export { Vault }