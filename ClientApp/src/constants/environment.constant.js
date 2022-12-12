const Env = {
    names: {
        certification: 'cert',
        production: 'prod'
    },
    fullNames: {
        certification: 'Certificación',
        production: 'Producción'
    },
    serverLKDV: {
        certification: 'PCDEDGED02 (10.80.218.154)',
        production: 'PCDEDGEP01(10.80.222.91)'
    },
    userLKDV: {
        certification: 'dsadmbcp_cert',
        production: 'dsadmbcp_prod'
    },
    groupLKDV: {
        certification: 'dstage',
        production: 'dstage',
    },
    userKinit: {
        certification: 'UsrCDAdminCERT',
        production: 'UsrCDAdminPROD',
    },
    hiveHost: {
        certification: 'desarrollo.datalake.local',
        production: 'produccion.datalake.local',
    },
    subsidiary: {
        certification: 'bcp',
        production: 'bcp',
    },
    jenkinsRole: {
        certification: 'LT',
        certificationReversion: 'AIO - OPI - PROV',
        production: 'AIO - OPI - PROV',
    },
    userJenkins: {
        certification: 'APICLKCER',
        production: 'APICLKPRO',
    },
    branchJenkins: {
        certification: 'develop',
        production: 'tags/${RELEASE_TAG_NAME}',
    },
    oracleServer: {
        certification: 'PORAC07.credito.bcp.com.pe - DBLKCERT (10.162.6.41)',
        production: 'PORAP08.credito.bcp.com.pe - DBLKPROD (10.162.18.98)',
    },
    oracleDataBase: {
        certification: 'DBLKCERT',
        production: 'DBLKPROD',
    },
    dataEntryWebServer: {
        certification: 'PLKDESOC01',
        production: 'PLKDESOP01',
    },
    dataEntryMSSQL: {
        certification: 'PLKDEDBC01',
        production: 'PLKDEDBP01',
    },
    dataEntryHost: {
        certification: 'dataentrycert',
        production: 'dataentry',
    },
    branch: {
        certification: 'develop',
        production: 'master',
    },
}

export { Env };