import views from '../../views/jenkins.html';
import { Vault, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));
    const existLayerProcess = dataIssue && dataIssue[Vault.groups.process.key] && dataIssue[Vault.groups.process.key][Vault.groups.process.key];

    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-table"></i> Metadata')
        .replace('{{label_jenkins}}', 'Ingresa el pipeline jenkins de metadata.')
        .replace('{{collapse_class}}', '')
        .replace('{{reuse_pipeline_colapse}}', '')
        .replaceAll('{{layerScript_id}}', Vault.fields.layerScript.key)
        .replaceAll('{{jenkins_id}}', Vault.fields.jenkinsUrl.key);

    element.querySelector(`#${Vault.fields.layerScript.key}`).value = existLayerProcess ? dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key].toUpperCase() : 'RDV';

    behaviors(element, yesHref);

    element.querySelector(`#${Vault.fields.layerScript.key}`).dispatchEvent(new Event('change'));

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

        dataIssue[Vault.groups.metadata.key][Vault.fields.jenkinsUrl.key] = parent.querySelector(`#${Vault.fields.jenkinsUrl.key}`).value.toUpperCase();
        dataIssue[Vault.groups.metadata.key][Vault.fields.jenkinsFolder.key] = parent.querySelector(`#${Vault.fields.layerScript.key}`).value.toUpperCase();
        dataIssue[Vault.groups.metadata.key][Vault.fields.reusePipeline.key] = parent.querySelector(`#${Vault.fields.reusePipeline.key}`).checked;

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector(`#${Vault.fields.layerScript.key}`).addEventListener('change', (event) => {
        parent.querySelector(`#text${Vault.fields.layerScript.key}`).textContent = event.target.value.toUpperCase();
    });
}

