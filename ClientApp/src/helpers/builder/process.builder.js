import instrucciones_ejecucion_job_cert from '../../assets/templates/instructions/instrucciones_ejecucion_job_cert.jira';
import instrucciones_ejecucion_job_prod from '../../assets/templates/instructions/instrucciones_ejecucion_job_prod.jira';

import { Vault } from '../../constants/index.constant';

/**
 * It generates process execute instructions
 * @param dataIssue - The object that contains all the data from the form.
 * @param group - group name or key name
 * @returns An object with two properties: certification and production.
 */
const getExecuteProcessInstructions = (dataIssue, group) => {
    let ejecucion_proceso_cert = '';
    let ejecucion_proceso_prod = '';

    if (!dataIssue[group][Vault.fields.executeAutomated.key]) {
        const listJobs = dataIssue[group][Vault.groups.jobGroup.key];
        let jobEjecucionCert = '';
        let jobEjecucionProd = '';
        let logEjecucion = '';

        listJobs.forEach((item, index) => {
            jobEjecucionCert += `${index + 1}.- ${item[Vault.fields.jobId.key]} | ${item[Vault.fields.chargeProcess.key]} | ${item[Vault.fields.layerScript.key]}\n`;
            jobEjecucionProd += `sh /prod/bcp/ctrl/ksh/PRC_EjecutaJobs.ksh ${item[Vault.fields.chargeProcess.key]} ${item[Vault.fields.layerScript.key]}\n`;
            logEjecucion += `${index + 1}.- ${item[Vault.fields.chargeProcess.key]}.log\n`;
        });

        ejecucion_proceso_cert = instrucciones_ejecucion_job_cert
            .replaceAll('{{EJECUCION_JOBS}}', jobEjecucionCert)
            .replaceAll('{{LOGS_JOBS_EJECUCION}}', logEjecucion);

        ejecucion_proceso_prod = instrucciones_ejecucion_job_prod
            .replaceAll('{{EJECUCION_JOBS}}', jobEjecucionProd)
            .replaceAll('{{LOGS_JOBS_EJECUCION}}', logEjecucion);
    }

    return {
        certification: ejecucion_proceso_cert, 
        production: ejecucion_proceso_prod,
    };
}

export { getExecuteProcessInstructions }