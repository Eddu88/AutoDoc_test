import views from '../../views/table.partitioned.html';
import { Vault, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    
    element.innerHTML = views.replace('{{titlePage}}', '<i class="bi bi-table"></i> DataEntry')
        .replaceAll('{{collapse_class}}', '')
        .replaceAll('{{label_table_data}}', 'Nombre de la tabla DataEntry')
        .replaceAll('{{table_id}}', Vault.fields.tableName.key)
        .replaceAll('{{partition_type_id}}', Vault.fields.parititionType.key);

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

        dataIssue[Vault.groups.dataEntry.key] = {};
        dataIssue[Vault.groups.dataEntry.key][Vault.groups.dataEntry.key] = true;
        dataIssue[Vault.groups.dataEntry.key][Vault.fields.tableName.key] = parent.querySelector(`#${Vault.fields.tableName.key}`).value.toUpperCase();
        dataIssue[Vault.groups.dataEntry.key][Vault.fields.parititionType.key] = parent.querySelector(`#${Vault.fields.parititionType.key}`).value;

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });
}
