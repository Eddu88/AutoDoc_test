import views from '../../views/bitbucket.html';
import { Jira, Vault } from '../../constants/index.constant';
import { validateBitbucketFields, validateBitbucketScript } from '../../helpers/bitbucket.helper';


/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    
    element.innerHTML = views.replace('{{titlePage}}', '<i class="bi bi-server"></i> Backup de tabla')
        .replace('{{label_bitbucket}}', 'Ingresa la url de bitbucket donde se encuentran los scripts.')
        .replace('{{visibility_path_scripts}}', 'visible')
        .replaceAll('{{bitbucket_id}}', Vault.fields.bitbucketUrl.key);

    behaviors(element, yesHref);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 */
const behaviors = (parent, yesHref) => {
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

        if (!bitbucketParts || !bitbucketParts[0] || !bitbucketParts[1] || !bitbucketParts[2] || !bitbucketParts[3]) {
            form.classList.remove('was-validated');
            bitbucketElement.classList.add('is-invalid');
            return false;
        }

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketUrl.key] = bitbucketParts[0];
        dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketProject.key] = bitbucketParts[1];
        dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketRepository.key] = bitbucketParts[2];
        dataIssue[Vault.groups.backup.key][Vault.fields.bitbucketPathScript.key] = bitbucketParts[3];

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });
}
