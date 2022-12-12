import { Vault } from '../../constants/index.constant';

/**
 * It generates script backup path in bitbucket url.
 * @param dataIssue - The issue object
 * @param group - the group of the issue (e.g. "Vault")
 * @param [subPath=reversion] - The subpath of the bitbucket repository.
 * @returns A string
 */
const getBitbucketPath = (dataIssue, group, subPath = 'reversion') =>
{
    const projectBitbucket = dataIssue[group][Vault.fields.bitbucketProject.key];
    const repositoryBitbucket = dataIssue[group][Vault.fields.bitbucketRepository.key];
    return `https://bitbucket.lima.bcp.com.pe/projects/${projectBitbucket}/repos/${repositoryBitbucket}/browse/${subPath}`;
}

/**
 * It generates bitbucket url to git
 * @param dataIssue - The issue object
 * @param group - the group of the issue
 * @returns A string with the following format:
 * https://bitbucket.lima.bcp.com.pe/scm/{projectBitbucket}/{repositoryBitbucket}.git
 */
const getBitbucketGit = (dataIssue, group) => {
    const projectBitbucket = dataIssue[group][Vault.fields.bitbucketProject.key];
    const repositoryBitbucket = dataIssue[group][Vault.fields.bitbucketRepository.key];
    return `https://bitbucket.lima.bcp.com.pe/scm/${projectBitbucket}/${repositoryBitbucket}.git`;
}

/**
 * It takes any number of arguments, converts them to lowercase, and returns a string with each
 * argument separated by a forward slash.
 * @param argv - an array of strings
 * @returns A function that takes in an unlimited amount of arguments and returns a string.
 */
const generatePath = (...argv) => {
    const pathProcessed = argv.map(item => item ? `/${item.toLowerCase()}` : '').join('');

    return `${pathProcessed}/`;
}

/**
 * It takes 4 parameters and returns a string with the parameters in a table format.
 * @param layer - The layer of the process
 * @param nameProcess - The name of the process
 * @param technology - The technology used in the process
 * @param jobId - The job ID of the job you want to run.
 * @returns A string.
 */
const generateJobList = (layer, nameProcess, technology, jobId) => {
    return `|${layer}|${nameProcess}|${technology}|${jobId}|
    `;
}

/**
 * It takes an array of jobs and returns a string formated.
 * @param jobsToMove - an array of jobs
 * @param [config=false] - boolean
 * @returns lists of jobs formatted
 */
const generateJobsJenkinsList = (jobsToMove, config = false) => {
    let jobsList = '';

    jobsToMove.forEach((item, index) => {
        if (!config) {
            jobsList += `|${index + 1}|${item.pipeline_name}_{{AMBIENTE_UPPER}}|
            `;
        }
        else {
            jobsList += `||JOB ${index + 1}||${item.pipeline_name}_{{AMBIENTE_UPPER}}||
            |Repository URL|[${item.bitbucket_url}]|
            `;
        }        
    });

    return jobsList;
}

/**
 * If verify if in the data exist a especific group or key.
 * @param dataIssue - issue data
 * @param group - group name of key name
 * @returns if exists return true otherwise return false
 */
const verifyIsNeeded = (dataIssue, group) => {
    return  Boolean(dataIssue[group] && Object.keys(dataIssue[group]).length && dataIssue[group][group]);
}

/**
 * It makes jenkins data
 * @param dataIssue - The issue object that contains all the fields and values
 * @param nameKey - key name of the object
 * @returns Jenkins data: bitbucket_url, pipeline_name, reuse_pipeline
 */
const generateJenkinsData = (dataIssue, nameKey) => {
    const bitbucket_url = getBitbucketGit(dataIssue, nameKey);
    const pipeline_name = dataIssue[nameKey][Vault.fields.jenkinsUrl.key];
    const reuse_pipeline = dataIssue[nameKey][Vault.fields.reusePipeline.key];

    return [{
        bitbucket_url: bitbucket_url,
        pipeline_name: pipeline_name,
        reuse_pipeline: reuse_pipeline,
    }];
}

export {
    getBitbucketPath,
    getBitbucketGit,
    generatePath,
    generateJobList,
    generateJobsJenkinsList,
    verifyIsNeeded,
    generateJenkinsData
};
