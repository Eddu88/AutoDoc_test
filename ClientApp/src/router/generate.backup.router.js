import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'


/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const generateBackupRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_GENERATE_BACKUP:
        case Uri.generateBackup.infoTable: {
            return rootContent.appendChild(pages.generatorBackupTableView(Uri.generateBackup.bitbucket));
        }
        case Uri.generateBackup.bitbucket: {
            return rootContent.appendChild(pages.generatorBackupBitbucketView(Uri.generateBackup.save));
        }
        case Uri.generateBackup.save: {
            return rootContent.appendChild(pages.saveBackupView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { generateBackupRouter };