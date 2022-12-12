import views from '../../views/description.html';
import jobView from '../../views/description.job.html';
import { Vault, Jira, Uri } from '../../constants/index.constant';
import { verifyIsNeeded } from '../../helpers/builder/auxiliar.builder';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));
    const existsProcess = verifyIsNeeded(dataIssue, Vault.groups.process.key);
    const existsDataEntry = verifyIsNeeded(dataIssue, Vault.groups.dataEntry.key);
    const existsBackup = verifyIsNeeded(dataIssue, Vault.groups.backup.key);
    const existsMetadata = verifyIsNeeded(dataIssue, Vault.groups.metadata.key);
    const existsLinaje = verifyIsNeeded(dataIssue, Vault.groups.linaje.key);

    if(!existsBackup && !existsDataEntry && !existsProcess && !existsLinaje && !existsMetadata) location.href = Uri.menu.base;

    let listJobs = null;

    if(existsProcess && !existsDataEntry)
    {
        listJobs = dataIssue[Vault.groups.process.key][Vault.groups.jobGroup.key].filter((element) => !element[Vault.fields.onlyExecution.key]);
    }

    if(existsDataEntry && !existsProcess)
    {
        const objectProcess = {}
        objectProcess[Vault.fields.jobId.key] = 'NA';
        objectProcess[Vault.fields.layerScript.key] = 'NA';
        objectProcess[Vault.fields.chargeProcess.key] = dataIssue[Vault.groups.dataEntry.key][Vault.fields.tableName.key];

        listJobs = [objectProcess];
    }

    element.innerHTML = views.replaceAll('{{titlePage}}', '<i class="bi bi-bar-chart-steps"></i> Descripción')
        .replaceAll('{{label_process_deployment}}', '1. Despliegue de los procesos:')
        .replaceAll('{{metadata_id}}', Vault.fields.processNameMetadata.key)
        .replaceAll('{{metadata_readonly}}', existsMetadata ? '' : 'readonly')
        .replaceAll('{{linaje_id}}', Vault.fields.processNameLinaje.key)
        .replaceAll('{{linaje_readonly}}', existsLinaje ? '' : 'readonly')
        .replaceAll('{{label_metadata_linaje}}', '2. Información metadata/linaje:')
        .replaceAll('{{label_pass_component}}', '3. Información complementaria:')
        .replaceAll('{{critical_id}}', Vault.fields.nameCriticalRutine.key)
        .replaceAll('{{relationships_id}}', Vault.fields.relationships.key)
        .replaceAll('{{type_id}}', Vault.fields.typeRelease.key)
        .replaceAll('{{cross_id}}', Vault.fields.cross.key)
        .replaceAll('{{list_jobs}}', listJobs ? getHTMLByJobs(listJobs, false) : '<i>No se detecto ningún proceso.</i>');

        element.querySelector(`#${Vault.fields.processNameMetadata.key}`).value = existsMetadata ? dataIssue[Vault.groups.metadata.key][Vault.fields.jenkinsUrl.key] + '_METADATA' : 'NA';
        element.querySelector(`#${Vault.fields.processNameLinaje.key}`).value = existsLinaje ? dataIssue[Vault.groups.linaje.key][Vault.fields.jenkinsUrl.key] + '_LINAJE' : 'NA';
        element.querySelector(`#${Vault.fields.typeRelease.key}`).value = existsBackup ? 'Modificado': 'Nuevo';

    behaviors(element, yesHref);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 */
const behaviors = (parent, yesHref) => {
    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.description.key] = {};
        dataIssue[Vault.groups.description.key][Vault.groups.description.key] = true;
        dataIssue[Vault.groups.description.key][Vault.fields.processNameMetadata.key] = parent.querySelector(`#${Vault.fields.processNameMetadata.key}`).value.toUpperCase();
        dataIssue[Vault.groups.description.key][Vault.fields.processNameLinaje.key] = parent.querySelector(`#${Vault.fields.processNameLinaje.key}`).value.toUpperCase();
        dataIssue[Vault.groups.description.key][Vault.fields.nameCriticalRutine.key] = parent.querySelector(`#${Vault.fields.nameCriticalRutine.key}`).value.toUpperCase();
        dataIssue[Vault.groups.description.key][Vault.fields.relationships.key] = parent.querySelector(`#${Vault.fields.relationships.key}`).value.toUpperCase();
        dataIssue[Vault.groups.description.key][Vault.fields.typeRelease.key] = parent.querySelector(`#${Vault.fields.typeRelease.key}`).value;
        dataIssue[Vault.groups.description.key][Vault.fields.cross.key] = parent.querySelector(`#${Vault.fields.cross.key}`).value;

        dataIssue[Vault.groups.description.key][Vault.groups.jobGroup.key] = [];

        parent.querySelectorAll('.job-container').forEach(job => {
            const index = job.id.slice(3);
            const dataJob = {};

            dataJob[Vault.fields.processName.key] = parent.querySelector(`#${Vault.fields.processName.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.layerScript.key] = parent.querySelector(`#${Vault.fields.layerScript.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.technologyProcess.key] = parent.querySelector(`#${Vault.fields.technologyProcess.key}${index}`).value.toUpperCase();
            dataJob[Vault.fields.jobHostId.key] = parent.querySelector(`#${Vault.fields.jobHostId.key}${index}`).value.toLowerCase().toUpperCase();

            dataIssue[Vault.groups.description.key][Vault.groups.jobGroup.key].push(dataJob);
        });

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector(`#${Vault.fields.nameCriticalRutine.key}_option`).addEventListener('change', (event) => {
        parent.querySelector(`#${Vault.fields.nameCriticalRutine.key}`).disabled = event.target.value === 'NO';
    });
}

/**
 * It takes an array of objects, and returns a string of HTML.
 * @param jobs - list of jobs
 * @param readonly - boolean
 * @returns A string of HTML.
 */
 const getHTMLByJobs = (jobs, readonly) => {
    let htmlJob = '';

    jobs.forEach((element, index) => {
        const jobId = element[Vault.fields.jobId.key];
        const identifier = 'job' + index;

        htmlJob += jobView
        .replaceAll('{{index_job}}', identifier)
            .replaceAll('{{layer_id}}', Vault.fields.layerScript.key + index)
            .replaceAll('{{layer_value}}', element[Vault.fields.layerScript.key])
            .replaceAll('{{process_id}}', Vault.fields.processName.key + index)
            .replaceAll('{{technology_id}}', Vault.fields.technologyProcess.key + index)
            .replaceAll('{{job_id}}', Vault.fields.jobHostId.key + index)
            .replaceAll('{{process_value}}', element[Vault.fields.chargeProcess.key])
            .replaceAll('{{job_value}}', jobId && jobId !== 'NA' ? '@' + element[Vault.fields.jobId.key].substr(1, 7) : '')
            .replaceAll('{{process_readonly}}', readonly ? 'readonly' : '');
    });

    return htmlJob;
}