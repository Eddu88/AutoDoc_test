import views from '../../views/save.html';
import modal from '../../views/modal.confirm.html';
import notification from '../../views/notification.html';
import { Vault, Jira, App, Uri } from '../../constants/index.constant';
import { generateTable } from '../../helpers/table.helper';
import { Modal, Toast } from 'bootstrap';

/* A function that returns a div element. */
export default () => {
    const element = document.createElement('div');

    const modalId = 'backupGenerate';

    element.innerHTML = views
        .replaceAll('{{visibility_pull_request}}', 'd-none')
        .replaceAll('{{modal_id}}', modalId)
        .replaceAll('{{button_modal_label}}', 'Generar scripts');

    element.innerHTML += modal
        .replaceAll('{{modal_id}}', modalId)
        .replaceAll('{{title_modal}}', 'Generar scripts en bitbucket')
        .replaceAll('{{body_modal}}', 'Esta apunto de generar scripts en el repositorio, &#191;Desea proceder?');

    element.innerHTML += notification
        .replaceAll('{{notification_id}}', modalId)
        .replaceAll('{{label_notification}}', 'Backup Scritps');

    behaviors(element, modalId);

    return element;
}

/**
 * It sends a POST request to BCP Server Api
 * @param parent - the parent element where the table will be generated
 * @param modalId - is the id of the modal that will be shown when the user clicks the button.
 */
const behaviors = (parent, modalId) => {
    const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

    if (!dataIssue || !Object.keys(dataIssue).length) location.href = Uri.menu.base;

    generateTable(parent, dataIssue);

    parent.querySelector('#saveIssue').addEventListener('click', (event) => {
        const modal = Modal.getInstance(parent.querySelector(`#confirm${modalId}`));
        const cancelButton = parent.querySelector(`#cancel${modalId}`);
        const target = event.target;
        const notificationElement = parent.querySelector(`#notify${modalId}`);
        const notification = new Toast(notificationElement);

        cancelButton.setAttribute('disabled', 'disabled');
        target.setAttribute('disabled', 'disabled');
        target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generando...`;

        const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));

        const dataToSend = {
            project: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.bitbucketProject.key],
            repository: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.bitbucketRepository.key],
            projectName: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.projectName.key],
            developer: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.developerName.key],
            productOwner: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.productOwner.key],
            schemaName: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.schemaNameBackup.key],
            tableName: dataIssue[Vault.groups.generatorBackup.key][Vault.fields.tableName.key],
        };

        console.dir(dataToSend);

        fetch(new Request(`${App.host}bitbucket/GenerateBackupScripts`),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(result => {
            if (!result.ok) return Promise.reject(result.text())
            return result.json();
        })
        .then(result => {
            console.dir(result);
            notificationElement.querySelector('.icon-alert').innerHTML = '<i class="bi bi-bookmark-check-fill text-success"></i>';
            notificationElement.querySelector('.toast-body').innerHTML = `Los scripts fueron generados en: <a href="${result.url}" target="_blank">${dataToSend.project}/${dataToSend.repository}</a>`;
        })
        .catch(err => {
            if (!(err instanceof Promise)) {
                notificationElement.querySelector('.icon-alert').innerHTML = '<i class="bi bi-bookmark-x-fill text-danger"></i>';
                notificationElement.querySelector('.toast-body').innerHTML = "Fatal: Unable to connect to local server!";
                console.dir(err);

                return false;
            }
            err.then(messageError => {
                notificationElement.querySelector('.icon-alert').innerHTML = '<i class="bi bi-bookmark-x-fill text-danger"></i>';
                notificationElement.querySelector('.toast-body').innerHTML = messageError;
            })
        })
        .finally(() => {
            modal.hide();
            notification.show();

            cancelButton.removeAttribute('disabled');
            target.removeAttribute('disabled');
            target.innerHTML = `Si, Generar`;
        });
    });
}
