import 'select2';

/**
 * It takes a string and returns an array of strings if the string matches the regex, otherwise it
 * returns null.
 * @param value - The value of the input field.
 * @returns  object with following properties:
 * 0: Url Completed 
 * 1: Project
 * 2: Repository
 * 3: Path script
 */
const validateBitbucketScript = (value) => {
    const regexValid = /^https:\/\/bitbucket\.lima\.bcp\.com\.pe\/projects\/([a-zA-Z]+)\/repos\/(([_-]?[a-zA-Z0-9]+)*)((\/?[a-zA-Z]+)*)/;
    // const devRegex = /^http:\/\/localhost:7990\/projects\/([a-zA-Z]+)\/repos\/(([_-]?[a-zA-Z0-9]+)*)((\/?[a-zA-Z]+)*)/;

    const validate = value.match(regexValid);

    if (!validate) return null;

    /**
     * 0: Url Completed 
     * 1: Project
     * 2: Repository
     * 3: Path script
     **/
    return [validate[0], validate[1], validate[2], validate[4]];
}

/**
 * It takes an event and a parent element, then it validates the event's target's value against a
 * regex, then it updates the parent's child elements with the results of the regex.
 * @param event - The event object
 * @param parent - the parent element of the input field
 */
const validateBitbucketFields = (event, parent) => {
    const value = event.target.value;

    const data = validateBitbucketScript(value);

    parent.querySelector('#textProject').classList.remove('bg-success', 'bg-danger');
    parent.querySelector('#textRepository').classList.remove('bg-success', 'bg-danger');
    parent.querySelector('#textPath').classList.remove('bg-success', 'bg-danger');

    parent.querySelector('#textProject').textContent = data && data[1] ? data[1] : '-';
    parent.querySelector('#textRepository').textContent = data && data[2] ? data[2] : '-';
    parent.querySelector('#textPath').textContent = data && data[3] ? data[3] : '-';

    parent.querySelector('#textProject').classList.add(data && data[1] ? 'bg-success' : 'bg-danger');
    parent.querySelector('#textRepository').classList.add(data && data[2] ? 'bg-success' : 'bg-danger');
    parent.querySelector('#textPath').classList.add(data && data[3] ? 'bg-success' : 'bg-danger');
}

export { validateBitbucketFields, validateBitbucketScript };