import views from '../../views/jobs-execute.html';
import jobTemplate from '../../views/job.html';
import { Vault, Jira } from '../../constants/index.constant';
import $ from 'jquery';

/* A function that returns a div element. */
export default (yesHref, titlePage = '<i class="bi bi-boxes"></i> Proceso principal', fileProcessRequired = true) => {
    const element = document.createElement('div');
    const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));
    const existsProcess = dataIssue && dataIssue[Vault.groups.process.key] && dataIssue[Vault.groups.process.key][Vault.groups.process.key];
    const existsBackup = dataIssue && dataIssue[Vault.groups.backup.key] && dataIssue[Vault.groups.backup.key][Vault.groups.backup.key];

    element.innerHTML += views.replace('{{titlePage}}', titlePage)
        .replace('{{tabel_jobs}}', 'Ingrese la informaci&oacute;n del job a ejecutar.');

    const firstLayer = existsProcess ? dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key].toUpperCase() : 'rdv';
    const firstChargeProcess = existsBackup ? dataIssue[Vault.groups.backup.key][Vault.fields.tableName.key].toUpperCase() : '';
    const firstFileProcess = existsBackup ? dataIssue[Vault.groups.backup.key][Vault.fields.tableName.key].toUpperCase() + '.py' : '';

    addJob(element, fileProcessRequired, firstLayer, firstChargeProcess, firstFileProcess);

    behaviors(element, yesHref, fileProcessRequired);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 * @param fileProcessRequired - boolean
 */
const behaviors = (parent, yesHref, fileProcessRequired) => {
    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.process.key][Vault.groups.jobGroup.key] = [];

        parent.querySelectorAll('.job-container').forEach(job => {
            const index = job.id.slice(3);
            const dataJob = {};

            dataJob[Vault.fields.layerScript.key] = 'C' + job.querySelector(`#${Vault.fields.layerScript.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.jobId.key] = job.querySelector(`#${Vault.fields.jobId.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.chargeProcess.key] = job.querySelector(`#${Vault.fields.chargeProcess.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.fileProcess.key] = job.querySelector(`#${Vault.fields.fileProcess.key}${index}`).value;
            dataJob[Vault.fields.onlyExecution.key] = job.querySelector(`#${Vault.fields.onlyExecution.key}${index}`).checked;

            dataIssue[Vault.groups.process.key][Vault.groups.jobGroup.key].push(dataJob);
        });

        dataIssue[Vault.groups.process.key][Vault.fields.executeAutomated.key] = parent.querySelector('#executeAutomated').checked;

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector('#addJob').addEventListener('click', () => {
        addJob(parent, fileProcessRequired);
    });
}

/**
 * It adds a new job to the form.
 * @param parent - the parent element of the job container
 * @param fileProcessRequired - boolean
 * @param [firstLayer=null] - The value of the first layerScript field
 * @param [firstChargeProcess=null] - the value of the first charge process
 * @param [firstFileProcess=null] - the value of the first file process
 */
const addJob = (parent, fileProcessRequired, firstLayer = null, firstChargeProcess = null, firstFileProcess = null) => {
    const containers = parent.querySelectorAll('.job-container');
    let index = containers.length + 1;

    if (index > 1) {
        index = Math.max(...[...containers].map(item => parseInt(item.id.slice(3)))) + 1;
    }

    const identifier = 'job' + index;
    const jobElement = jobTemplate
        .replaceAll('{{index_job}}', identifier)
        .replaceAll('{{layerScript_id}}', Vault.fields.layerScript.key + index)
        .replaceAll('{{job_id}}', Vault.fields.jobId.key + index)
        .replaceAll('{{charge_process_id}}', Vault.fields.chargeProcess.key + index)
        .replaceAll('{{file_process_id}}', Vault.fields.fileProcess.key + index)
        .replaceAll('{{only_execution_id}}', Vault.fields.onlyExecution.key + index)
        .replaceAll('{{file_process_required}}', fileProcessRequired ? 'required' : '')
        .replaceAll('{{file_process_visibility}}', fileProcessRequired ? '' : 'd-none')
        .replaceAll('{{visibility}}', index > 1 ? 'd-blobk' : 'd-none');
    const listElement = $(parent.querySelector('#jobList'));
    const jobElementQueriable = $(jobElement);

    listElement.append(jobElementQueriable);

    if (index === 1 && firstLayer && firstChargeProcess && firstFileProcess) {
        parent.querySelector(`#${Vault.fields.layerScript.key}` + index).value = firstLayer;
        parent.querySelector(`#${Vault.fields.chargeProcess.key}` + index).value = firstChargeProcess;
        parent.querySelector(`#${Vault.fields.fileProcess.key}` + index).value = firstFileProcess;
    }
}
