import views from '../../views/save.html';
import modal from '../../views/modal.confirm.html';
import notification from '../../views/notification.html';
import { App, Uri, Jira } from '../../constants/index.constant';
import { generateTable } from '../../helpers/table.helper';
import { generateInstructions } from '../../helpers/generator.helper';
import { Modal, Toast } from 'bootstrap';

/* A function that returns a div element. */
export default () => {
    const element = document.createElement('div');

    const modalId = 'jiraIssue';

    element.innerHTML = views
        .replaceAll('{{visibility_pull_request}}', '')
        .replaceAll('{{modal_id}}', modalId)
        .replaceAll('{{button_modal_label}}', 'Generar ticket Jira');

    element.innerHTML += modal
        .replaceAll('{{modal_id}}', modalId)
        .replaceAll('{{title_modal}}', 'Generar ticket en JIRA')
        .replaceAll('{{body_modal}}', 'Esta apunto de generar un ticket MVP, &#191; Desea proceder?');

    element.innerHTML += notification
        .replaceAll('{{notification_id}}', modalId)
        .replaceAll('{{label_notification}}', 'Issue Jira');

    behaviors(element, modalId);

    return element;
}

/**
 * It sends a POST request to BCP Server Api
 * @param parent - The parent element where the table is generated.
 * @param modalId - is the id of the modal that is being used.
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

        const dataIssueSend = generateInstructions(dataIssue);

        dataIssueSend['generatePullRequest'] = parent.querySelector('#pullRequestActive').checked;

        console.dir(dataIssueSend);

        fetch(new Request(`${App.host}jira/createissue`),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataIssueSend),
        })
        .then(result => {
            if (!result.ok) return Promise.reject(result.text())
            return result.json();
        })
        .then(result => {
            notificationElement.querySelector('.icon-alert').innerHTML = '<i class="bi bi-bookmark-check-fill text-success"></i>';
            notificationElement.querySelector('.toast-body').innerHTML = `El ticket fue generado correctamente: <a href="${result.url}" target="_blank">${result.id}</a>`;
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
