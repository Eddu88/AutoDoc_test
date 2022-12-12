import views from '../../views/menu.html';
import { Uri, Jira } from '../../constants/index.constant';

/* A function that returns a div element. */
export default () => {
    const element = document.createElement('div');
    element.innerHTML += views.replace('{{titlePage}}', '<i class="bi bi-back"></i> Menu de pases');

    behaviors(element)
    return element;
}

/**
 * It set behaviors to the elements
 * @param parent - the parent element 
 */
const behaviors = (parent) => {
    sessionStorage.setItem(Jira.issueKey, JSON.stringify({}));

    parent.querySelector('#continueProcess').addEventListener('click', () => location.href = Uri.chargeProcess.roles);
    parent.querySelector('#continueMetadata').addEventListener('click', () => location.href = Uri.metadata.roles);
    parent.querySelector('#continueLinaje').addEventListener('click', () => location.href = Uri.linaje.roles);
    parent.querySelector('#continueMetadataLinaje').addEventListener('click', () => location.href = Uri.metadataLinaje.roles);
    parent.querySelector('#continueGeneratorBackupt').addEventListener('click', () => location.href = Uri.generateBackup.infoTable);
    parent.querySelector('#continueCreateRepository').addEventListener('click', () => location.href = Uri.generateRepository.template);
    parent.querySelector('#continueDataEntry').addEventListener('click', () => location.href = Uri.dataEntry.roles);
    parent.querySelector('#continueExtractionEngine').addEventListener('click', () => location.href = Uri.extractionEngine.roles);
    parent.querySelector('#continueCreateJobJenkins').addEventListener('click', () => location.href = Uri.generateJobJenkins.template);
}
