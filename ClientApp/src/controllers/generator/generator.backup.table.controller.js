import views from '../../views/generator.backup.html';
import { Vault, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    
    element.innerHTML = views.replace('{{titlePage}}', '<i class="bi bi-server"></i> Generar scripts de backup')
        .replaceAll('{{developerName_id}}', Vault.fields.developerName.key)
        .replaceAll('{{productOwner_id}}', Vault.fields.productOwner.key)
        .replaceAll('{{projectName_id}}', Vault.fields.projectName.key)
        .replaceAll('{{schemaDevelop_id}}', Vault.fields.schemaNameBackup.key)
        .replaceAll('{{tableDevelop_id}}', Vault.fields.tableName.key);

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
        
        const developerNameElement = parent.querySelector(`#${Vault.fields.developerName.key}`);
        const productOwnerElement = parent.querySelector(`#${Vault.fields.productOwner.key}`);
        const projectNameElement = parent.querySelector(`#${Vault.fields.projectName.key}`);
        const schemaNameBackupElement = parent.querySelector(`#${Vault.fields.schemaNameBackup.key}`);
        const tableNameElement = parent.querySelector(`#${Vault.fields.tableName.key}`);

        developerNameElement.classList.remove('is-invalid');
        productOwnerElement.classList.remove('is-invalid');
        projectNameElement.classList.remove('is-invalid');
        schemaNameBackupElement.classList.remove('is-invalid');
        tableNameElement.classList.remove('is-invalid');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const dataIssue = {};

        dataIssue[Vault.groups.generatorBackup.key] = {};
        dataIssue[Vault.groups.generatorBackup.key][Vault.groups.generatorBackup.key] = true;
        dataIssue[Vault.groups.generatorBackup.key][Vault.fields.developerName.key] = developerNameElement.value.toUpperCase();
        dataIssue[Vault.groups.generatorBackup.key][Vault.fields.productOwner.key] = productOwnerElement.value.toUpperCase();
        dataIssue[Vault.groups.generatorBackup.key][Vault.fields.projectName.key] = projectNameElement.value.toUpperCase();
        dataIssue[Vault.groups.generatorBackup.key][Vault.fields.schemaNameBackup.key] = schemaNameBackupElement.value.toUpperCase();
        dataIssue[Vault.groups.generatorBackup.key][Vault.fields.tableName.key] = tableNameElement.value.toUpperCase();

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });
}
