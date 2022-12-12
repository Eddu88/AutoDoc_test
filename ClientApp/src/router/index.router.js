import { pages} from '../controllers/index.controller';
import { Uri, UriKeys, App } from '../constants/index.constant';
import { chargeProcessRouter } from './charge.proces.router';
import { linajeRouter } from './linaje.router';
import { metadataRouter } from './metadata.router';
import { metadataLinajeRouter } from './metadata.linaje.router';
import { generateBackupRouter } from './generate.backup.router';
import { generateRepositoryRouter } from './template.repository.router';
import { dataEntryRouter } from './dataentry.router';
import { extractionEngineRouter } from './extraction.engine.router';
import { generateJobJenkins } from './job.jenkins.router';

const rootContent = document.getElementById('root');

/**
 * If the route is empty, or the route is the base route, then append the menu view to the root
 * content. Otherwise, if the route contains a specific string, then call a specific function.
 * Otherwise, append the 404 content to the root content.
 * @param route - the route that the user is trying to access
 */
const router = (route) => {
    rootContent.style.opacity = "0";

    setTimeout(() => {
        rootContent.innerHTML = '';
        rootContent.style.opacity = "1";

        switch (route) {
            case '':
            case '/':
            case Uri.menu.base: {
                return rootContent.appendChild(pages.menuView());
            }
            default:
            {
                if (route.includes(UriKeys.KEY_URI_CHARGE_PROCESS)) return chargeProcessRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_URI_LINAJE)) return linajeRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_URI_METADATA)) return metadataRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_URI_METADATA_LINAJE)) return metadataLinajeRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_URI_GENERATE_BACKUP)) return generateBackupRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_URI_CREATE_REPOSITORY)) return generateRepositoryRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_DATA_ENTRY)) return dataEntryRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_EXTRACTION_ENGINE)) return extractionEngineRouter(route, rootContent);
                if (route.includes(UriKeys.KEY_JOB_JENKINS)) return generateJobJenkins(route, rootContent);
                
                return rootContent.innerHTML = App.content404;
            }
        }

    }, 400);
}


export {router}