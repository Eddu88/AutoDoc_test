import views from '../../views/jenkins.html';
import { Vault, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');

    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-table"></i> DataEntry')
        .replace('{{label_jenkins}}', 'Ingresa el pipeline jenkins de tu proceso.')
        .replace('{{collapse_class}}', '')
        .replace('{{reuse_pipeline_colapse}}', '')
        .replaceAll('{{layerScript_id}}', Vault.fields.layerScript.key)
        .replaceAll('{{jenkins_id}}', Vault.fields.jenkinsUrl.key);

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

        dataIssue[Vault.groups.dataEntry.key][Vault.fields.jenkinsUrl.key] = parent.querySelector(`#${Vault.fields.jenkinsUrl.key}`).value.toUpperCase();
        dataIssue[Vault.groups.dataEntry.key][Vault.fields.jenkinsFolder.key] = parent.querySelector(`#${Vault.fields.layerScript.key}`).value.toUpperCase();
        dataIssue[Vault.groups.dataEntry.key][Vault.fields.reusePipeline.key] = parent.querySelector(`#${Vault.fields.reusePipeline.key}`).checked;

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector(`#${Vault.fields.layerScript.key}`).addEventListener('change', (event) => {
        parent.querySelector(`#text${Vault.fields.layerScript.key}`).textContent = event.target.value.toUpperCase();
    });
}

