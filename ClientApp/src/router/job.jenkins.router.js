import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'

/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const generateJobJenkins = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_JOB_JENKINS:
        case Uri.generateJobJenkins.template: {
            return rootContent.appendChild(pages.jobJenkinsView(Uri.generateJobJenkins.save));
        }
        case Uri.generateJobJenkins.save: {
            return rootContent.appendChild(pages.saveJobJenkinsView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { generateJobJenkins };