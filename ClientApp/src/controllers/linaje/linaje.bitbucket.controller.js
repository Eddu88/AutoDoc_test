import viewsChoose from '../../views/chooseMenu.html';
import views from '../../views/bitbucket.html';
import { Vault, Jira } from '../../constants/index.constant';
import { validateBitbucketFields, validateBitbucketScript } from '../../helpers/bitbucket.helper';

/* A function that returns a div element. */
export default (yesHref, noHref) => {
    const element = document.createElement('div');

    element.innerHTML = noHref ? viewsChoose.replace('{{titleChoose}}', '&#191;Quieres agregar linaje?').replace('{{idPanelPrincipal}}', 'bitbucketForm') : '';

    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-bezier2"></i> Linaje')
        .replace('{{label_bitbucket}}', 'Ingresa la url de bitbucket de linaje.')
        .replace('{{collapse_class}}', noHref ? 'collapse' : '')
        .replace('{{visibility_path_scripts}}', 'd-none')
        .replaceAll('{{bitbucket_id}}', Vault.fields.bitbucketUrl.key);

    behaviors(element, yesHref, noHref);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 * @param noHref - the URL to go to if the user clicks the "No" button
 */
const behaviors = (parent, yesHref, noHref) => {
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

        dataIssue[Vault.groups.linaje.key] = {};
        dataIssue[Vault.groups.linaje.key][Vault.groups.linaje.key] = true;
        dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketUrl.key] = bitbucketParts[0];
        dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketProject.key] = bitbucketParts[1];
        dataIssue[Vault.groups.linaje.key][Vault.fields.bitbucketRepository.key] = bitbucketParts[2];

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    if(noHref) {
        parent.querySelector('#cancelChoose').addEventListener('click', () => {
            location.href = noHref;
        });
    }
}
