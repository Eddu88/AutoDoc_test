import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'

/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const metadataLinajeRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_METADATA_LINAJE:
        case Uri.metadataLinaje.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.metadataLinaje.metadataBitbucket));
        }
        case Uri.metadataLinaje.metadataBitbucket: {
            return rootContent.appendChild(pages.metadataBitbucketView(Uri.metadataLinaje.metadataJenkins));
        }
        case Uri.metadataLinaje.metadataJenkins: {
            return rootContent.appendChild(pages.metadataJenkinsView(Uri.metadataLinaje.linajeBitbucket));
        }
        case Uri.metadataLinaje.linajeBitbucket: {
            return rootContent.appendChild(pages.linajeBitbucketView(Uri.metadataLinaje.linajeJenkins));
        }
        case Uri.metadataLinaje.linajeJenkins: {
            return rootContent.appendChild(pages.linajeJenkinsView(Uri.metadataLinaje.description));
        }
        case Uri.metadataLinaje.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.metadataLinaje.save));
        }
        case Uri.metadataLinaje.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { metadataLinajeRouter };