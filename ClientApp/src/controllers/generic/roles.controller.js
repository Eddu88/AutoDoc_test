import views from '../../views/roles.html';
import { Jira, Vault } from '../../constants/index.constant';
import { selectInit } from '../../helpers/select2.helper';
import { setStorage, getStorage } from '../../helpers/storage.helper'

/* A function that returns a div element. */
export default (yesHref) => {
    sessionStorage.setItem(Jira.issueKey, "{}");

    const element = document.createElement('div');

    element.innerHTML = views;

    chargeData(element);
    behaviors(element, yesHref);
    selectInit(element, '.form-select2');
    selectInit(element, '.form-select2-without-search', 0);

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

        const dataIssue = {};

        dataIssue[Vault.groups.roles.key] = {};
        dataIssue[Vault.groups.roles.key][Vault.groups.roles.key] = true;
        dataIssue[Vault.groups.roles.key][Vault.fields.group.key] = Jira.groupLKDV;
        dataIssue[Vault.groups.roles.key][Vault.fields.summary.key] = parent.querySelector(`#${Vault.fields.summary.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.security.key] = parent.querySelector(`#${Vault.fields.security.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.groupAgileOps.key] = parent.querySelector(`#${Vault.fields.groupAgileOps.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.gobernance.key] = parent.querySelector(`#${Vault.fields.gobernance.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.productOwner.key] = parent.querySelector(`#${Vault.fields.productOwner.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.technicalLead.key] = parent.querySelector(`#${Vault.fields.technicalLead.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.qualityAssurance.key] = parent.querySelector(`#${Vault.fields.qualityAssurance.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.sourceMVP.key] = parent.querySelector(`#${Vault.fields.sourceMVP.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.typeRequirement.key] = parent.querySelector(`#${Vault.fields.typeRequirement.key}`).value;
        dataIssue[Vault.groups.roles.key][Vault.fields.numberTicket.key] = parent.querySelector(`#${Vault.fields.numberTicket.key}`).value;

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));
        localStorage.setItem(Jira.rolesPersistKey, JSON.stringify(dataIssue[Vault.groups.roles.key]));

        location.href = yesHref;
    });
}

/**
 * It takes a JSON object, a parent element, a key name, an HTML string, and an optional last role
 * object. 
 * 
 * It then generates HTML for the parent element based on the JSON object and the key name. 
 * 
 * If the last role object is provided, it will also set the selected option to the value of the last
 * role object.
 * @param parent - the parent element of the select element
 */
const chargeData = (parent) => {
    const optionHTML = `<option {selected} value="{value}">{value}</option>`;
    const dataJira = getStorage(Jira.dataKey);
    
    const lastRoles = JSON.parse(localStorage.getItem(Jira.rolesPersistKey));

    if (!dataJira) location.href = '/';

    generateHTML(dataJira, parent, Vault.fields.groupAgileOps.key, optionHTML);
    generateHTML(dataJira, parent, Vault.fields.security.key, optionHTML, lastRoles);
    generateHTML(dataJira, parent, Vault.fields.gobernance.key, optionHTML, lastRoles);
    generateHTML(dataJira, parent, Vault.fields.productOwner.key, optionHTML, lastRoles);
    generateHTML(dataJira, parent, Vault.fields.technicalLead.key, optionHTML, lastRoles);
    generateHTML(dataJira, parent, Vault.fields.qualityAssurance.key, optionHTML, lastRoles);
    generateHTML(dataJira, parent, Vault.fields.sourceMVP.key, optionHTML);
    generateHTML(dataJira, parent, Vault.fields.typeRequirement.key, optionHTML);
}

const generateHTML = (dataJira, parent, keyName, optionHTML, lastRole = null) => {
    var elementGroupAgileOps = parent.querySelector(`#${keyName}`);

    if (lastRole && lastRole[keyName]) elementGroupAgileOps.innerHTML = '';

    dataJira[keyName].forEach((col) => {
        elementGroupAgileOps.innerHTML += optionHTML.replaceAll('{value}', col)
            .replaceAll('{selected}', lastRole && col === lastRole[keyName] ? 'selected' : '');
    });
}