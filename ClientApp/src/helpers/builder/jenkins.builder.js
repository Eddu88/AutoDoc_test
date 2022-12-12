import instrucciones_jenkins from '../../assets/templates/instructions/instrucciones_jenkins.jira';
import instrucciones_movimiento_jenkins from '../../assets/templates/instructions/instrucciones_movimiento_jenkins.jira';
import instrucciones_jenkins_ejecucion_cert from '../../assets/templates/instructions/instrucciones_jenkins_ejecucion_cert.jira';
import instrucciones_jenkins_ejecucion_prod from '../../assets/templates/instructions/instrucciones_jenkins_ejecucion_prod.jira';
import reversion_jenkins from '../../assets/templates/reversion/reversion_jenkins.jira';

import { generateJobsJenkinsList, generateJenkinsData} from './auxiliar.builder';
import { Env, Vault, Jira } from '../../constants/index.constant';

/**
 * It generates jenkins instructions (move and/or execute).
 * @param dataIssue - The issue object from the Jira API
 * @param needMetadata - true if you want to include the metadata in the instructions
 * @param needLinaje - if true, the script will look for the linaje of the issue.
 * @param [needPrincipalProcess=false] - if true, it will include the principal process in the
 * instructions
 * @param [group=None] - The group of the issue.
 * @param [includeReversion=true] - if true, the script will include the reversion step.
 * @returns object with certification and productions instructions.
 */
const getJenkinsInstructions = (dataIssue, needMetadata, needLinaje, needPrincipalProcess = false, group = 'None', includeReversion = true) => {
    //INSTRUCCIONES JENKINS
    const jobsJenkins = []
        .concat(needPrincipalProcess ? generateJenkinsData(dataIssue, group) : [])
        .concat(needMetadata ? generateJenkinsData(dataIssue, Vault.groups.metadata.key) : [])
        .concat(needLinaje ? generateJenkinsData(dataIssue, Vault.groups.linaje.key) : []);

    if(!jobsJenkins.length) {
        return {
            instructions: {
                certification: '', 
                production: '',
            },
            reversion: {
                certification: '',
                production: ''
            }
        }; 
    }

    const jobsToMove = jobsJenkins.filter(job => !job.reuse_pipeline)
    const folderJenkins = 
        needPrincipalProcess ? dataIssue[group][Vault.fields.jenkinsFolder.key] 
        : needMetadata ? dataIssue[Vault.groups.metadata.key][Vault.fields.jenkinsFolder.key] 
        : dataIssue[Vault.groups.linaje.key][Vault.fields.jenkinsFolder.key];

    const instructions_jenkins_general = instrucciones_jenkins
        .replaceAll('{{HOST_IMAGE_SERVER}}', Jira.serverImage)
        .replaceAll('{{LIST_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsJenkins))
        .replaceAll('{{LIST_CONFIG_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsJenkins, true))
        .replaceAll('{{CAPA}}', folderJenkins);

    let movimiento_jenkins_cert = '';
    let movimiento_jenkins_prod = '';

    if (jobsToMove.length) {
        const instructions_moving_general = instrucciones_movimiento_jenkins
            .replaceAll('{{HOST_IMAGE_SERVER}}', Jira.serverImage)
            .replaceAll('{{LIST_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsToMove))
            .replaceAll('{{CAPA}}', folderJenkins);

        movimiento_jenkins_cert = instructions_moving_general
            .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase());
        movimiento_jenkins_prod = instructions_moving_general
            .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase());
    }

    const ejecucionjenkins_cert = instrucciones_jenkins_ejecucion_cert
        .replaceAll('{{LIST_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsJenkins))
        .replaceAll('{{HOST_IMAGE_SERVER}}', Jira.serverImage)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase());

    const jenkins_cert = instructions_jenkins_general
        .replaceAll('{{UNIDAD_SOPORTE_JENKINS}}', Env.jenkinsRole.certification)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase())
        .replaceAll('{{USER_JENKINS}}', Env.userJenkins.certification)
        .replaceAll('{{BRANCH_JENKINS}}', Env.branchJenkins.certification)
        .replaceAll('{{AMBIENTE}}', Env.names.certification)
        .replaceAll('{{MOVING_PIPELINE}}', movimiento_jenkins_cert)
        .replaceAll('{{EJECUCION_PIPELINE}}', ejecucionjenkins_cert);

    const ejecucionjenkins_prod = instrucciones_jenkins_ejecucion_prod
        .replaceAll('{{LIST_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsJenkins))
        .replaceAll('{{HOST_IMAGE_SERVER}}', Jira.serverImage)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase());

    const jenkins_prod = instructions_jenkins_general
        .replaceAll('{{UNIDAD_SOPORTE_JENKINS}}', Env.jenkinsRole.production)
        .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase())
        .replaceAll('{{USER_JENKINS}}', Env.userJenkins.production)
        .replaceAll('{{BRANCH_JENKINS}}', Env.branchJenkins.production)
        .replaceAll('{{AMBIENTE}}', Env.names.production)
        .replaceAll('{{MOVING_PIPELINE}}', movimiento_jenkins_prod)
        .replaceAll('{{EJECUCION_PIPELINE}}', ejecucionjenkins_prod);

    //REVESION JENKINS

    let reversion_jenkins_cert = '';
    let reversion_jenkins_prod = '';

    if (jobsToMove.length && includeReversion) {
        const reversion_jenkins_general = reversion_jenkins
        .replaceAll('{{CAPA}}', folderJenkins)
        .replaceAll('{{LIST_JOBS_PIPELINE}}', generateJobsJenkinsList(jobsToMove));

        reversion_jenkins_cert = reversion_jenkins_general
            .replaceAll('{{UNIDAD_SOPORTE_JENKINS}}', Env.jenkinsRole.certificationReversion)
            .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.certification)
            .replaceAll('{{AMBIENTE_UPPER}}', Env.names.certification.toUpperCase());

        reversion_jenkins_prod = reversion_jenkins_general
            .replaceAll('{{UNIDAD_SOPORTE_JENKINS}}', Env.jenkinsRole.production)
            .replaceAll('{{AMBIENTE_INSTRUCCIONES}}', Env.fullNames.production)
            .replaceAll('{{AMBIENTE_UPPER}}', Env.names.production.toUpperCase());
    }
    

    return {
        instructions: {
            certification: jenkins_cert, 
            production: jenkins_prod,
        },
        reversion: {
            certification: reversion_jenkins_cert,
            production: reversion_jenkins_prod
        }
    };
}

export { getJenkinsInstructions }