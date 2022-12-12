import views from '../../views/template.respository.html';
import { Vault, Jira, App, Bitbucket } from '../../constants/index.constant';
import { selectInit } from '../../helpers/select2.helper';
import { Modal } from 'bootstrap';
import $ from 'jquery';

/* A function that returns a div element. */
export default (yesHref) => {
    const element = document.createElement('div');
    
    element.innerHTML = views.replace('{{titlePage}}', '<i class="bi bi-layout-wtf"></i> Crear repositorio desde plantilla')
        .replaceAll('{{projectSource_id}}', Vault.fields.bitbucketSourceProject.key)
        .replaceAll('{{repositorySource_id}}', Vault.fields.bitbucketSourceRepository.key)
        .replaceAll('{{templateSource_id}}', Vault.fields.bitbucketTemplate.key)
        .replaceAll('{{projectName_id}}', Vault.fields.bitbucketRepository.key);

    behaviors(element, yesHref);
    selectInit(element, '.form-select', 0);

    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 * @param yesHref - the URL to go to if the user clicks the "Yes" or "Continue" button
 */
const behaviors = (parent, yesHref) => {
    
    Modal.getOrCreateInstance(parent.querySelector(`#loadTemplatesModal`)).show();

    loadTemplates(parent);
    setEventsChangeToSelects(parent);

    parent.querySelector('#continue').addEventListener('click', () => {
        const form = parent.querySelector('.needs-validation');
        
        const projectSourceElement = parent.querySelector(`#${Vault.fields.bitbucketSourceProject.key}`);
        const repositorySourceElement = parent.querySelector(`#${Vault.fields.bitbucketSourceRepository.key}`);
        const templateSourceElement = parent.querySelector(`#${Vault.fields.bitbucketTemplate.key}`);
        const repositoryElement = parent.querySelector(`#${Vault.fields.bitbucketRepository.key}`);

        projectSourceElement.classList.remove('is-invalid');
        repositorySourceElement.classList.remove('is-invalid');
        templateSourceElement.classList.remove('is-invalid');
        repositoryElement.classList.remove('is-invalid');

        form.classList.add('was-validated');
        if (!form.checkValidity()) return false;

        const regexRepositoryValidation = /^([a-zA-Z0-9]+([_-]?[a-zA-Z0-9]+)+)$/;

        if (!repositoryElement.value.match(regexRepositoryValidation)) {
            form.classList.remove('was-validated');
            repositoryElement.classList.add('is-invalid');
            return false;
        }

        const dataIssue = {};

        dataIssue[Vault.groups.templateRepository.key] = {};
        dataIssue[Vault.groups.templateRepository.key][Vault.groups.templateRepository.key] = true;
        dataIssue[Vault.groups.templateRepository.key][Vault.fields.bitbucketSourceProject.key] = projectSourceElement.value;
        dataIssue[Vault.groups.templateRepository.key][Vault.fields.bitbucketSourceRepository.key] = repositorySourceElement.value;
        dataIssue[Vault.groups.templateRepository.key][Vault.fields.bitbucketTemplate.key] = templateSourceElement.value;
        dataIssue[Vault.groups.templateRepository.key][Vault.fields.bitbucketProject.key] = projectSourceElement.value;
        dataIssue[Vault.groups.templateRepository.key][Vault.fields.bitbucketRepository.key] = repositoryElement.value.toLowerCase();

        sessionStorage.setItem(Jira.issueKey, JSON.stringify(dataIssue));

        console.dir(dataIssue);

        location.href = yesHref;
    });
}

/**
 * "When the value of the first select changes, load the second select with the values from the first
 * select's value, and when the value of the second select changes, load the third select with the
 * values from the second select's value."
 * @param parent - the parent element of the select element
 */
const setEventsChangeToSelects = (parent) => {
    $(parent.querySelector(`#${Vault.fields.bitbucketSourceProject.key}`)).on('change', (event) => {
        const value = event.target.value;
        loadSelect(parent, Vault.fields.bitbucketTemplate.key, []); 

        const data = JSON.parse(localStorage.getItem(Bitbucket.key));
        const repositories = data.filter(element => element.project === value)[0].repositories.map(element => element.name);

        loadSelect(parent, Vault.fields.bitbucketSourceRepository.key, repositories); 
    });

    $(parent.querySelector(`#${Vault.fields.bitbucketSourceRepository.key}`)).on('change', (event) => {
        const projectSelected = parent.querySelector(`#${Vault.fields.bitbucketSourceProject.key}`).value;
        const value = event.target.value;

        const data = JSON.parse(localStorage.getItem(Bitbucket.key));
        const repository = data.filter(element => element.project === projectSelected)[0]
            .repositories.filter(element => element.name === value)[0];

        loadSelect(parent, Vault.fields.bitbucketTemplate.key, repository.branches); 
    });
}

/**
 * It fetches a list of templates from a BCP Server and populates a select element with the results
 * @param parent - the parent element of the select element
 * @returns The result of the fetch request.
 */
const loadTemplates = (parent) => {
    if(App.modeChecker === 'dev')
    {
        localStorage.setItem(Bitbucket.key, JSON.stringify(Bitbucket.templatesTest));
        loadSelect(parent, Vault.fields.bitbucketSourceProject.key, Bitbucket.templatesTest.map(element => element.project));
        hideModal(parent, 2000);

        return false;
    }

    fetch(new Request(`${App.host}bitbucket/templates`),
    {
        method: 'GET'
    })
    .then(result => {
        if (!result.ok) return Promise.reject(result.text())
        return result.json();
    })
    .then(result => {
        localStorage.setItem(Bitbucket.key, JSON.stringify(result));

        loadSelect(parent, Vault.fields.bitbucketSourceProject.key, result.map(element => element.project));

        hideModal(parent);
    })
    .catch(err => {
        if (!(err instanceof Promise)) {
            parent.querySelector('#modalContent').innerHTML = '<span class="text-danger"> <i class="bi bi-exclamation-triangle-fill"></i> Fatal: Unable to connect to local server!</span>';
            console.dir(err);

            return false;
        }
        err.then(messageError => {
            parent.querySelector('#modalContent').innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> ${messageError}</span>`;
            console.dir(err);
        })
    });
}

/**
 * It takes a parent element, a key, and an array of data, and then it creates a select element with
 * the key as its id, and then it populates the select element with the data
 * @param parent - The parent element of the select element
 * @param key - The key of the select element
 * @param data - The data to be loaded into the select.
 */
const loadSelect = (parent, key, data) => {
    const select = parent.querySelector(`#${key}`);
    select.innerHTML = '<option selected disabled value="">Elije una opción</option>';
    const optionTemplate = '<option value="{{data}}">{{data}}</option>';

    data.forEach((value) => {
        select.innerHTML += optionTemplate.replaceAll('{{data}}', value);
    });
}

/**
 * After a certain amount of time, hide the modal.
 * @param parent - The parent element of the modal.
 * @param [timeOut=1500] - The time in milliseconds to wait before hiding the modal.
 */
 const hideModal = (parent, timeOut = 1500) => {
    setTimeout(() => {
        const modal = Modal.getOrCreateInstance(parent.querySelector(`#loadTemplatesModal`));
        modal.hide();
    }, timeOut);
}