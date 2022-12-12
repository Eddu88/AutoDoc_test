import { pages } from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant'

/**
 * It takes a route and a rootContent element and returns a function that appends a child element to
 * the rootContent element.
 * @param route - the route that the user is currently on
 * @param rootContent - is the root element of the page
 * @returns The return is content view
 */
const generateRepositoryRouter = (route, rootContent) => {
    switch (route) {
        case UriKeys.KEY_URI_CREATE_REPOSITORY:
        case Uri.generateRepository.template: {
            return rootContent.appendChild(pages.TemplateRepositoryView(Uri.generateRepository.save));
        }
        case Uri.generateRepository.save: {
            return rootContent.appendChild(pages.saveRepositoryView());
        }
        default:
            return rootContent.innerHTML = App.content404;
    }
}

export { generateRepositoryRouter };