import views from '../../views/taxonomia.html';
import { Vault, Jira } from '../../constants/index.constant';


/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');

    element.innerHTML = views.replace('{{titlePage}}', '<i class="bi bi-boxes"></i> Proceso principal')
        .replace('{{label_taxonomia_temporary}}', '1. Taxonom&iacute;a temporal:')
        .replaceAll('{{layerTemporary_id}}', Vault.fields.layerTemporary.key)
        .replaceAll('{{unitTemporary_id}}', Vault.fields.unitTemporary.key)
        .replaceAll('{{solutionTemporary_id}}', Vault.fields.solutionTemporary.key)
        .replaceAll('{{temporary_id}}', Vault.fields.pathTemporary.key)
        .replaceAll('{{temporary_label}}', 'Carpeta temporal')
        .replace('{{label_taxonomia_script}}', '2. Taxonom&iacute;a scripts/jar:')
        .replaceAll('{{layerScript_id}}', Vault.fields.layerScript.key)
        .replaceAll('{{unitScript_id}}', Vault.fields.unitScript.key)
        .replaceAll('{{solutionScript_id}}', Vault.fields.solutionScript.key)
        .replaceAll('{{script_id}}', Vault.fields.pathScript.key)
        .replaceAll('{{script_label}}', 'Carpeta scripts')
        .replaceAll('{{script_path_label}}', 'scripts/jars')
        .replaceAll('{{default_value_scripts}}', 'scripts');

    behaviors(element, yesHref);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 */
const behaviors = (parent, yesHref, noHref) => {
    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.process.key][Vault.fields.layerTemporary.key] = parent.querySelector(`#${Vault.fields.layerTemporary.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.unitTemporary.key] = parent.querySelector(`#${Vault.fields.unitTemporary.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.solutionTemporary.key] = parent.querySelector(`#${Vault.fields.solutionTemporary.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.pathTemporary.key] = parent.querySelector(`#${Vault.fields.pathTemporary.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key] = parent.querySelector(`#${Vault.fields.layerScript.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.unitScript.key] = parent.querySelector(`#${Vault.fields.unitScript.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.solutionScript.key] = parent.querySelector(`#${Vault.fields.solutionScript.key}`).value.toLowerCase();
        dataIssue[Vault.groups.process.key][Vault.fields.pathScript.key] = parent.querySelector(`#${Vault.fields.pathScript.key}`).value.toLowerCase();

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    const generateTextPath = (value) => !value ? '' : ('<span class="text-secondary">/</span>' + value.toLowerCase());

    parent.querySelector(`#${Vault.fields.layerTemporary.key}`).addEventListener('change', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.layerTemporary.key}`).forEach(item => item.textContent = event.target.value.toLowerCase());
    });
    parent.querySelector(`#${Vault.fields.unitTemporary.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.unitTemporary.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });
    parent.querySelector(`#${Vault.fields.solutionTemporary.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.solutionTemporary.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });
    parent.querySelector(`#${Vault.fields.pathTemporary.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.pathTemporary.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });

    parent.querySelector(`#${Vault.fields.layerScript.key}`).addEventListener('change', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.layerScript.key}`).forEach(item => item.textContent = event.target.value.toLowerCase());
    });
    parent.querySelector(`#${Vault.fields.unitScript.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.unitScript.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });
    parent.querySelector(`#${Vault.fields.solutionScript.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.solutionScript.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });
    parent.querySelector(`#${Vault.fields.pathScript.key}`).addEventListener('keyup', (event) => {
        parent.querySelectorAll(`.text${Vault.fields.pathScript.key}`).forEach(item => item.innerHTML = generateTextPath(event.target.value.toLowerCase()));
    });
}
