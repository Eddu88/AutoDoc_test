import viewsChoose from '../../views/chooseMenu.html';
import views from '../../views/bitbucket.html';
import { Vault, Jira } from '../../constants/index.constant';
import { validateBitbucketFields, validateBitbucketScript } from '../../helpers/bitbucket.helper';
import { verifyIsNeeded } from '../../helpers/builder/auxiliar.builder';

/* A function that returns a div element. */
export default (yesHref, noHref, titlePage = '<i class="bi bi-boxes"></i> Proceso principal') => {
    const element = document.createElement('div');
    const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));
    const backupExists = verifyIsNeeded(dataIssue, Vault.groups.backup.key);

    if (!backupExists && noHref) {
        element.innerHTML = viewsChoose.replace('{{titleChoose}}', '&#191;Tienes un proceso principal?').replace('{{idPanelPrincipal}}', 'bitbucketForm');
    }

    element.innerHTML += views.replace('{{titlePage}}', titlePage)
        .replace('{{label_bitbucket}}', 'Ingresa la url de bitbucket de tu proceso.')
        .replace('{{collapse_class}}', !backupExists && noHref ? 'collapse' : '')
        .replace('{{visibility_path_scripts}}', 'd-none')
        .replaceAll('{{bitbucket_id}}', Vault.fields.bitbucketUrl.key);

    const project = backupExists ? dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketProject.key] : null;
    const repository = backupExists ? dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketRepository.key] : null;

    element.querySelector(`#${Vault.fields.bitbucketUrl.key}`).value = backupExists ? `https://bitbucket.lima.bcp.com.pe/projects/${project}/repos/${repository}` : '';

    behaviors(element, yesHref, noHref, backupExists);

    element.querySelector(`#${Vault.fields.bitbucketUrl.key}`).dispatchEvent(new Event('keyup'));

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 * @param noHref - the URL to go to if the user clicks the "No" button
 * @param existsBackup - Boolean
 */
const behaviors = (parent, yesHref, noHref, exitstBackup) => {
    parent.querySelector(`#${Vault.fields.bitbucketUrl.key}`).addEventListener('keyup', (event) => {
        validateBitbucketFields(event, parent);
    });

    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');

        const bitbucketElement = parent.querySelector(`#${Vault.fields.bitbucketUrl.key}`);
        bitbucketElement.classList.remove('is-invalid');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const bitbucketParts = validateBitbucketScript(bitbucketElement.value);

        if (!bitbucketParts || !bitbucketParts[0] || !bitbucketParts[1] || !bitbucketParts[2]) {
            form.classList.remove('was-validated');
            bitbucketElement.classList.add('is-invalid');
            return false;
        }

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.process.key] = {};
        dataIssue[Vault.groups.process.key][Vault.groups.process.key] = true;
        dataIssue[Vault.groups.process.key][Vault.fields.bitbucketUrl.key] = bitbucketParts[0];
        dataIssue[Vault.groups.process.key][Vault.fields.bitbucketProject.key] = bitbucketParts[1];
        dataIssue[Vault.groups.process.key][Vault.fields.bitbucketRepository.key] = bitbucketParts[2];

        if (exitstBackup) {
            dataIssue[Vault.groups.process.key][Vault.fields.layerTemporary.key] = dataIssue[Vault.groups.backup.key][Vault.fields.layerTemporary.key];
            dataIssue[Vault.groups.process.key][Vault.fields.unitTemporary.key] = dataIssue[Vault.groups.backup.key][Vault.fields.unitTemporary.key];
            dataIssue[Vault.groups.process.key][Vault.fields.solutionTemporary.key] = dataIssue[Vault.groups.backup.key][Vault.fields.solutionTemporary.key];
            dataIssue[Vault.groups.process.key][Vault.fields.pathTemporary.key] = dataIssue[Vault.groups.backup.key][Vault.fields.pathTemporary.key];
            dataIssue[Vault.groups.process.key][Vault.fields.layerScript.key] = dataIssue[Vault.groups.backup.key][Vault.fields.layerScript.key];
            dataIssue[Vault.groups.process.key][Vault.fields.unitScript.key] = dataIssue[Vault.groups.backup.key][Vault.fields.unitScript.key];
            dataIssue[Vault.groups.process.key][Vault.fields.solutionScript.key] = dataIssue[Vault.groups.backup.key][Vault.fields.solutionScript.key];
            dataIssue[Vault.groups.process.key][Vault.fields.pathScript.key] = dataIssue[Vault.groups.backup.key][Vault.fields.pathScript.key];
        }

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    if (noHref && !exitstBackup) {
        parent.querySelector('#cancelChoose').addEventListener('click', () => {
            location.href = noHref;
        });
    }
}

