import views from '../../views/jenkins.html';
import { Vault, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');

    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-cpu"></i> Generar jobs Jenkins')
        .replace('{{label_jenkins}}', 'Ingresa el nombre del  pipeline jenkins.')
        .replace('{{collapse_class}}', '')
        .replace('{{reuse_pipeline_colapse}}', 'd-none')
        .replaceAll('{{layerScript_id}}', Vault.fields.layerScript.key)
        .replaceAll('{{jenkins_id}}', Vault.fields.jenkinsUrl.key);

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

        dataIssue[Vault.groups.generateJobJenkins.key] = {};
        dataIssue[Vault.groups.generateJobJenkins.key][Vault.fields.jenkinsUrl.key] = parent.querySelector(`#${Vault.fields.jenkinsUrl.key}`).value.toUpperCase();
        dataIssue[Vault.groups.generateJobJenkins.key][Vault.fields.jenkinsFolder.key] = parent.querySelector(`#${Vault.fields.layerScript.key}`).value.toUpperCase();

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector(`#${Vault.fields.layerScript.key}`).addEventListener('change', (event) => {
        parent.querySelector(`#text${Vault.fields.layerScript.key}`).textContent = event.target.value.toUpperCase();
    });
}

