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
const extractionEngineRouter = (route, rootContent) => {
    const titlePage = '<i class="bi bi-train-freight-front"></i> Motor Minsait - Extracción RDV';
    switch (route) {
        case UriKeys.KEY_EXTRACTION_ENGINE:
        case Uri.extractionEngine.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.extractionEngine.procesoBitbucket));
        }
        case Uri.extractionEngine.procesoBitbucket: {
            return rootContent.appendChild(pages.procesoBitbucketView(Uri.extractionEngine.procesoTaxonomia, null, titlePage));
        }
        case Uri.extractionEngine.procesoTaxonomia: {
            return rootContent.appendChild(pages.engineTaxonomiaView(Uri.extractionEngine.procesoJenkins));
        }
        case Uri.extractionEngine.procesoJenkins: {
            return rootContent.appendChild(pages.procesoJenkinsView(Uri.extractionEngine.procesoJobs, titlePage));
        }
        case Uri.extractionEngine.procesoJobs: {
            return rootContent.appendChild(pages.procesoJobsView(Uri.extractionEngine.metadataBitbucket, titlePage, false));
        }
        case Uri.extractionEngine.metadataBitbucket: {
            return rootContent.appendChild(pages.metadataBitbucketView(Uri.extractionEngine.metadataJenkins, Uri.extractionEngine.linajeBitbucket));
        }
        case Uri.extractionEngine.metadataJenkins: {
            return rootContent.appendChild(pages.metadataJenkinsView(Uri.extractionEngine.linajeBitbucket));
        }
        case Uri.extractionEngine.linajeBitbucket: {
            return rootContent.appendChild(pages.linajeBitbucketView(Uri.extractionEngine.linajeJenkins, Uri.extractionEngine.description));
        }
        case Uri.extractionEngine.linajeJenkins: {
            return rootContent.appendChild(pages.linajeJenkinsView(Uri.extractionEngine.description));
        }
        case Uri.extractionEngine.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.extractionEngine.save));
        }
        case Uri.extractionEngine.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { extractionEngineRouter };