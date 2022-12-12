import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'

/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const metadataRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_METADATA:
        case Uri.metadata.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.metadata.bitbucket));
        }
        case Uri.metadata.bitbucket: {
            return rootContent.appendChild(pages.metadataBitbucketView(Uri.metadata.jenkins));
        }
        case Uri.metadata.jenkins: {
            return rootContent.appendChild(pages.metadataJenkinsView(Uri.metadata.description));
        }
        case Uri.metadata.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.metadata.save));
        }
        case Uri.metadata.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { metadataRouter };