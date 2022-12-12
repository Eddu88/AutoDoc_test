import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, Jira, Vault, App } from '../constants/index.constant';
import { verifyIsNeeded } from '../helpers/builder/auxiliar.builder';

/**
 * It takes a route and a rootContent element and appends a child element to the rootContent element
 * based on the route.
 * @param route - the current route
 * @param rootContent - the div where the content is going to be appended
 * @returns The return is the content view;
 */
const chargeProcessRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_CHARGE_PROCESS:
        case Uri.chargeProcess.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.chargeProcess.backup));
        }
        case Uri.chargeProcess.backup: {
            return rootContent.appendChild(pages.backupTableView(Uri.chargeProcess.backupBitbucket, Uri.chargeProcess.procesoBitbucket));
        }
        case Uri.chargeProcess.backupBitbucket: {
            return rootContent.appendChild(pages.backupBitbucketView(Uri.chargeProcess.backupTaxonomia));
        }
        case Uri.chargeProcess.backupTaxonomia: {
            return rootContent.appendChild(pages.backupTaxonomiaView(Uri.chargeProcess.procesoBitbucket));
        }
        case Uri.chargeProcess.procesoBitbucket: {
            const dataIssue = JSON.parse(sessionStorage.getItem(Jira.issueKey));
            const taxonomiaEnable = !verifyIsNeeded(dataIssue, Vault.groups.backup.key);

            return rootContent.appendChild(pages.procesoBitbucketView(taxonomiaEnable ? Uri.chargeProcess.procesoTaxonomia : Uri.chargeProcess.procesoJenkins, Uri.chargeProcess.metadataBitbucket));
        }
        case Uri.chargeProcess.procesoTaxonomia: {
            return rootContent.appendChild(pages.procesoTaxonomiaView(Uri.chargeProcess.procesoJenkins));
        }
        case Uri.chargeProcess.procesoJenkins: {
            return rootContent.appendChild(pages.procesoJenkinsView(Uri.chargeProcess.procesoJobs));
        }
        case Uri.chargeProcess.procesoJobs: {
            return rootContent.appendChild(pages.procesoJobsView(Uri.chargeProcess.metadataBitbucket));
        }
        case Uri.chargeProcess.metadataBitbucket: {
            return rootContent.appendChild(pages.metadataBitbucketView(Uri.chargeProcess.metadataJenkins, Uri.chargeProcess.linajeBitbucket));
        }
        case Uri.chargeProcess.metadataJenkins: {
            return rootContent.appendChild(pages.metadataJenkinsView(Uri.chargeProcess.linajeBitbucket));
        }
        case Uri.chargeProcess.linajeBitbucket: {
            return rootContent.appendChild(pages.linajeBitbucketView(Uri.chargeProcess.linajeJenkins, Uri.chargeProcess.description));
        }
        case Uri.chargeProcess.linajeJenkins: {
            return rootContent.appendChild(pages.linajeJenkinsView(Uri.chargeProcess.description));
        }
        case Uri.chargeProcess.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.chargeProcess.save));
        }
        case Uri.chargeProcess.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { chargeProcessRouter };