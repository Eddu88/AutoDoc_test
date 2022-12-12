const UriKeys = {
    KEY_URI_CHARGE_PROCESS : '#/charge-process',
    KEY_URI_METADATA : '#/only-metadata',
    KEY_URI_LINAJE : '#/only-linaje',
    KEY_URI_METADATA_LINAJE : '#/metadata-linaje',
    KEY_URI_GENERATE_BACKUP : '#/generate-backup',
    KEY_URI_CREATE_REPOSITORY : '#/create-repository',
    KEY_DATA_ENTRY : '#/dataentry',
    KEY_EXTRACTION_ENGINE : '#/extraction-engine',
    KEY_JOB_JENKINS : '#/job-jenkins',
}

const Uri = {
    menu: {
        base: '#/',
    },

    chargeProcess: {
        roles: `${UriKeys.KEY_URI_CHARGE_PROCESS}/roles`,
        backup: `${UriKeys.KEY_URI_CHARGE_PROCESS}/backup/table`,
        backupBitbucket: `${UriKeys.KEY_URI_CHARGE_PROCESS}/backup/bitbucket`,
        backupTaxonomia: `${UriKeys.KEY_URI_CHARGE_PROCESS}/backup/taxonomia`,
        procesoBitbucket: `${UriKeys.KEY_URI_CHARGE_PROCESS}/proceso/bitbucket`,
        procesoJenkins: `${UriKeys.KEY_URI_CHARGE_PROCESS}/proceso/jenkins`,
        procesoJobs: `${UriKeys.KEY_URI_CHARGE_PROCESS}/proceso/jobs`,
        procesoTaxonomia: `${UriKeys.KEY_URI_CHARGE_PROCESS}/proceso/taxonomia`,
        metadataBitbucket: `${UriKeys.KEY_URI_CHARGE_PROCESS}/metadata/bitbucket`,
        metadataJenkins: `${UriKeys.KEY_URI_CHARGE_PROCESS}/metadata/jenkins`,
        linajeBitbucket: `${UriKeys.KEY_URI_CHARGE_PROCESS}/linaje/bitbucket`,
        linajeJenkins: `${UriKeys.KEY_URI_CHARGE_PROCESS}/linaje/jenkins`,
        description: `${UriKeys.KEY_URI_CHARGE_PROCESS}/description`,
        save: `${UriKeys.KEY_URI_CHARGE_PROCESS}/save`,
    },

    metadata: {
        roles: `${UriKeys.KEY_URI_METADATA}/roles`,
        bitbucket: `${UriKeys.KEY_URI_METADATA}/bitbucket`,
        jenkins: `${UriKeys.KEY_URI_METADATA}/jenkins`,
        description: `${UriKeys.KEY_URI_METADATA}/description`,
        save: `${UriKeys.KEY_URI_METADATA}/save`,
    },

    linaje: {
        roles: `${UriKeys.KEY_URI_LINAJE}/roles`,
        bitbucket: `${UriKeys.KEY_URI_LINAJE}/bitbucket`,
        jenkins: `${UriKeys.KEY_URI_LINAJE}/jenkins`,
        description: `${UriKeys.KEY_URI_LINAJE}/description`,
        save: `${UriKeys.KEY_URI_LINAJE}/save`,
    },

    metadataLinaje: {
        roles: `${UriKeys.KEY_URI_METADATA_LINAJE}/roles`,
        metadataBitbucket: `${UriKeys.KEY_URI_METADATA_LINAJE}/metadata/bitbucket`,
        metadataJenkins: `${UriKeys.KEY_URI_METADATA_LINAJE}/metadata/jenkins`,
        linajeBitbucket: `${UriKeys.KEY_URI_METADATA_LINAJE}/linaje/bitbucket`,
        linajeJenkins: `${UriKeys.KEY_URI_METADATA_LINAJE}/linaje/jenkins`,
        description: `${UriKeys.KEY_URI_METADATA_LINAJE}/description`,
        save: `${UriKeys.KEY_URI_METADATA_LINAJE}/save`,
    },

    generateBackup: {
        infoTable: `${UriKeys.KEY_URI_GENERATE_BACKUP}/info`,
        bitbucket: `${UriKeys.KEY_URI_GENERATE_BACKUP}/bitbucket`,
        save: `${UriKeys.KEY_URI_GENERATE_BACKUP}/save`,
    },

    generateRepository: {
        template: `${UriKeys.KEY_URI_CREATE_REPOSITORY}/template`,
        save: `${UriKeys.KEY_URI_CREATE_REPOSITORY}/save`,
    },

    generateJobJenkins: {
        template: `${UriKeys.KEY_JOB_JENKINS}/template`,
        save: `${UriKeys.KEY_JOB_JENKINS}/save`,
    },

    dataEntry : {
        roles: `${UriKeys.KEY_DATA_ENTRY}/roles`,
        processTable: `${UriKeys.KEY_DATA_ENTRY}/process/table`,
        processBitbucket: `${UriKeys.KEY_DATA_ENTRY}/process/bitbucket`,
        processJenkins: `${UriKeys.KEY_DATA_ENTRY}/process/jenkins`,
        metadataBitbucket: `${UriKeys.KEY_DATA_ENTRY}/metadata/bitbucket`,
        metadataJenkins: `${UriKeys.KEY_DATA_ENTRY}/metadata/jenkins`,
        linajeBitbucket: `${UriKeys.KEY_DATA_ENTRY}/linaje/bitbucket`,
        linajeJenkins: `${UriKeys.KEY_DATA_ENTRY}/linaje/jenkins`,
        description: `${UriKeys.KEY_DATA_ENTRY}/description`,
        save: `${UriKeys.KEY_DATA_ENTRY}/save`,
    },

    extractionEngine : {
        roles: `${UriKeys.KEY_EXTRACTION_ENGINE}/roles`,
        procesoBitbucket: `${UriKeys.KEY_EXTRACTION_ENGINE}/proceso/bitbucket`,
        procesoJenkins: `${UriKeys.KEY_EXTRACTION_ENGINE}/proceso/jenkins`,
        procesoJobs: `${UriKeys.KEY_EXTRACTION_ENGINE}/proceso/jobs`,
        procesoTaxonomia: `${UriKeys.KEY_EXTRACTION_ENGINE}/proceso/taxonomia`,
        metadataBitbucket: `${UriKeys.KEY_EXTRACTION_ENGINE}/metadata/bitbucket`,
        metadataJenkins: `${UriKeys.KEY_EXTRACTION_ENGINE}/metadata/jenkins`,
        linajeBitbucket: `${UriKeys.KEY_EXTRACTION_ENGINE}/linaje/bitbucket`,
        linajeJenkins: `${UriKeys.KEY_EXTRACTION_ENGINE}/linaje/jenkins`,
        description: `${UriKeys.KEY_EXTRACTION_ENGINE}/description`,
        save: `${UriKeys.KEY_EXTRACTION_ENGINE}/save`,
    }
}

export { Uri, UriKeys }