const DEVELOP_HOST = 'http://localhost:5186/';
const PRODUCTION_HOST = 'http://localhost:5555/';

const App = {
    lastVersionApplication: 'https://bitbucket.lima.bcp.com.pe/rest/api/latest/projects/LKDVBCP/repos/bcpserver-autodoc-release/archive?at=refs%2Ftags%2Flasted&format=zip',
    host: process.env.NODE_ENV === 'development' ? DEVELOP_HOST : PRODUCTION_HOST,
    modeChecker: process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
    content404: '<div id="page404">404 <p class="fs-2">Page not found</p></div>'
}

export {
    App
};