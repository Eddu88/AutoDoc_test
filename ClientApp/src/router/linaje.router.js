import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'

/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const linajeRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_LINAJE:
        case Uri.linaje.roles: {
            return rootContent.appendChild(pages.rolesView(Uri.linaje.bitbucket));
        }
        case Uri.linaje.bitbucket: {
            return rootContent.appendChild(pages.linajeBitbucketView(Uri.linaje.jenkins));
        }
        case Uri.linaje.jenkins: {
            return rootContent.appendChild(pages.linajeJenkinsView(Uri.linaje.description));
        }
        case Uri.linaje.description: {
            return rootContent.appendChild(pages.descriptionView(Uri.linaje.save));
        }
        case Uri.linaje.save: {
            return rootContent.appendChild(pages.saveIssueView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { linajeRouter };