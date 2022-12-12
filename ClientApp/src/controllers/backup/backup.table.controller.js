import viewsChoose from '../../views/chooseMenu.html';
import views from '../../views/table.data.html';
import { Jira, Vault } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref, noHref) => {
    const element = document.createElement('div');

    element.innerHTML = viewsChoose.replace('{{titleChoose}}', '&#191;Quieres hacer un backup de la tabla?').replace('{{idPanelPrincipal}}', 'backupForm');
    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-server"></i> Backup de tabla')
        .replace('{{label_table_data}}', 'Ingresa el nombre de la tabla.')
        .replace('{{collapse_class}}', 'collapse')
        .replaceAll('{{table_id}}', Vault.fields.tableName.key);

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
    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        dataIssue[Vault.groups.backup.key] = {};
        dataIssue[Vault.groups.backup.key][Vault.groups.backup.key] = true;
        dataIssue[Vault.groups.backup.key][Vault.fields.tableName.key] = parent.querySelector(`#${Vault.fields.tableName.key}`).value.toUpperCase();

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });

    parent.querySelector('#cancelChoose').addEventListener('click', () => {
        location.href = noHref;
    });
}
