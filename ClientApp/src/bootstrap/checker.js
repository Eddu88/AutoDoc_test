import { App, Jira } from '../constants/index.constant'
import { setStorage, getStorage } from '../helpers/storage.helper'

/**
 * It checks if the server is up and running, and if it is, it activates the robot.
 * @param [callback=null] - function to be called after the checker is done
 * @returns false.
 */
const startChecker = (callback = null) => {
    if (App.modeChecker === 'dev') {

        setStorage(Jira.dataKey, Jira.dataTest, 14400);
        
        activateRobot(callback);        
        verifyStatus('checkLocalServer', true);
        verifyStatus('checkBitbucket', true);
        verifyStatus('checkJira', true);
        verifyStatus('checkJiraCustomFields', true);
        verifyStatus('checkVersion', true);

        return false;
    }

    let constantsLocalCheck = null;
    let bitbucketCheck = null;
    let jiraCheck = null;
    let lastVersionCheck = null;
    let jiraCustomFieldsCheck = null;

    fetch(new Request(`${App.host}`))
        .then(res => res.text())
        .then(res => constantsLocalCheck = true)
        .catch(err => {
            constantsLocalCheck = false;
        });

    fetch(new Request(`${App.host}bitbucket/checkhealth`))
        .then(res => res.text())
        .then(res => {
            fetch(new Request(`${App.host}bitbucket/lastversion`))
                .then(res => res.text())
                .then(res => {
                    lastVersionCheck = eval(res);

                    if (!lastVersionCheck) document.querySelector('#versionError').classList.remove('visually-hidden');
                })
                .catch(err => {
                    lastVersionCheck = false;
                    document.querySelector('#versionError').classList.remove('visually-hidden');
                });

            bitbucketCheck = eval(res);
        })
        .catch(err => {
            bitbucketCheck = false;
            lastVersionCheck = false;
            document.querySelector('#connectionError').classList.remove('visually-hidden');
        });

    fetch(new Request(`${App.host}jira/checkhealth`))
        .then(res => res.text())
        .then(res => {
            jiraCheck = eval(res)

            const lastData = getStorage(Jira.dataKey);
            
            if(lastData) {
                console.log('Se tomo DATOS JIRA de CACHE!');

                jiraCustomFieldsCheck = true;
                return;
            }

            fetch(new Request(`${App.host}jira/allowedvalues/LKDV`))
                .then(res => res.json())
                .then(res => {
                    setStorage(Jira.dataKey, res, 14400);

                    jiraCustomFieldsCheck = true;
                })
                .catch(err => {
                    jiraCustomFieldsCheck = false;
                    document.querySelector('#connectionError').classList.remove('visually-hidden');
                });
        })
        .catch(err => {
            jiraCheck = false;
            jiraCustomFieldsCheck = false;
            document.querySelector('#connectionError').classList.remove('visually-hidden');
        });
    
    const checkerInterval = setInterval(() => {
        console.log('checking...');
        if (constantsLocalCheck !== null) verifyStatus('checkLocalServer', constantsLocalCheck);
        if (bitbucketCheck !== null) verifyStatus('checkBitbucket', bitbucketCheck);
        if (jiraCheck !== null) verifyStatus('checkJira', jiraCheck);
        if (jiraCustomFieldsCheck !== null) verifyStatus('checkJiraCustomFields', jiraCustomFieldsCheck);
        if (lastVersionCheck !== null) verifyStatus('checkVersion', lastVersionCheck);

        if (constantsLocalCheck && bitbucketCheck && jiraCheck && jiraCustomFieldsCheck && lastVersionCheck) {
            activateRobot(callback);
            clearInterval(checkerInterval);
        }
    }, 500);
}

/**
 * It activate the robot mouth, eyes
 * @param callback - function to be executed after the robot is activated
 */
const activateRobot = (callback) => {
    const robot = document.querySelector('#minsait-robot');
    const robotContainer = document.getElementById('container-robot');

    robot.classList.add('smile');
    robot.querySelector('.robot-face .eyes.left').classList.add('active');
    robot.querySelector('.robot-face .eyes.right').classList.add('active');
    robot.querySelector('.robot-face .mouth').classList.add('active');

    robotContainer.classList.add('active-transition');
    robotContainer.classList.remove('col-12');
    robotContainer.classList.add('col-md-4');
    robotContainer.classList.add('col-lg-3');
    robotContainer.classList.add('d-none');
    robotContainer.classList.add('d-md-block');

    document.getElementById('content-container').classList.remove('visually-hidden');
    
    if (typeof callback === 'function') callback();
    
    setTimeout(() => {
        robot.classList.remove('smile');
        robot.querySelector('.circle-bg').classList.add('active');
        robot.querySelector('.robot-face').classList.add('active-transition');
    }, 2000);
}

/**
 * It verify the status of the service and apply especific style on the element
 * @param identifier - the id of the element that contains the spinner and the badge
 * @param health - boolean
 */
const verifyStatus = (identifier, health) => {
    const identity = document.querySelector(`#${identifier}`);
    const badge = identity.querySelector('.badge');
    const textHealth = identity.querySelector('.text-health');

    // @ts-ignore
    textHealth.innerHTML = `<i class="bi bi-hdd-fill color-minsait"></i>` + (App.modeChecker === 'dev' ? textHealth.dataset.health : textHealth.dataset.health);

    identity.querySelector('.spinner-grow').classList.add('invisible');
    badge.innerHTML = App.modeChecker === 'dev' ? App.modeChecker.toUpperCase(): health ? 'OK' : 'ERROR';
    badge.classList.add(health ? 'bg-success' : 'bg-danger')
    badge.classList.remove('invisible');
}

export { startChecker };