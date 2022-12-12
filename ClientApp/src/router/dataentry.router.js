import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'


/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the current route
 * @param rootContent - the div where the content is going to be appended
 * @returns The return content view;
 */
const dataEntryRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_LINAJE:
        case Uri.dataEntry.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.dataEntry.processTable));
        }
        case Uri.dataEntry.processTable: {
            return rootContent.appendChild(pages.dataEntryTableView(Uri.dataEntry.processBitbucket));
        }
        case Uri.dataEntry.processBitbucket: {
            return rootContent.appendChild(pages.dataEntryBitbucketView(Uri.dataEntry.processJenkins));
        }
        case Uri.dataEntry.processJenkins: {
            return rootContent.appendChild(pages.dataEntryJenkinsView(Uri.dataEntry.metadataBitbucket));
        }
        case Uri.dataEntry.metadataBitbucket: {
            return rootContent.appendChild(pages.metadataBitbucketView(Uri.dataEntry.metadataJenkins, Uri.dataEntry.linajeBitbucket));
        }
        case Uri.dataEntry.metadataJenkins: {
            return rootContent.appendChild(pages.metadataJenkinsView(Uri.dataEntry.linajeBitbucket));
        }
        case Uri.dataEntry.linajeBitbucket: {
            return rootContent.appendChild(pages.linajeBitbucketView(Uri.dataEntry.linajeJenkins, Uri.dataEntry.description));
        }
        case Uri.dataEntry.linajeJenkins: {
            return rootContent.appendChild(pages.linajeJenkinsView(Uri.dataEntry.description));
        }
        case Uri.dataEntry.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.dataEntry.save));
        }
        case Uri.dataEntry.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { dataEntryRouter };
