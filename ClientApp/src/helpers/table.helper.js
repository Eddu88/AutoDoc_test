import { Vault } from '../constants/index.constant';

/**
 * It takes a parent element and an object of data and generates a table and
 * append to the parent element
 * @param parent - the parent element where the table will be generated
 * @param dataIssue - the data to generate the table
 */
const generateTable = (parent, dataIssue) => {
    const objectEntryData = Object.entries(dataIssue);
    const content = parent.querySelector('#resumeAcordion');

    const acordionTemplate = 
    `<div class="accordion-item">
        <h2 class="accordion-header" id="{{acordion_id}}-headingOne">
        <button class="accordion-button {{first_group_button}} text-uppercase fw-bold color-minsait" type="button" data-bs-toggle="collapse" data-bs-target="#{{acordion_id}}-collapseOne" aria-expanded="true" aria-controls="{{acordion_id}}-collapseOne">
            <i class="bi bi-list-check"></i>&nbsp; {{acordion_title}}
        </button>
        </h2>
        <div id="{{acordion_id}}-collapseOne" class="accordion-collapse collapse {{first_group}}" aria-labelledby="{{acordion_id}}-headingOne">
        <div class="accordion-body table-responsive">
            <table class="table align-middle border-minsait" id="table_{{acordion_id}}">
                <thead>
                    <tr>
                        <th class="color-minsait" scope="col">Grupo</th>
                        <th class="color-minsait" scope="col">Campo</th>
                        <th class="color-minsait" scope="col">Valor</th>
                    </tr>
                </thead>
                <tbody>
                {{table_body}}
                </tbody>
            </table>
        </div>
        </div>
    </div>`;

    const dataTemplate =
        `<tr>
            <td class="color-minsait font-weight"><span class="badge bg-minsait">{group}</span></td>
            <td><span class="badge bg-light text-dark">{title}</span></td>
            <td><code>{body}</code></td>
        </tr>`;

    const jobExecuteTemplate = `{jobId} - {jobName} - {jobLayer}`;

    content.innerHTML = '';
    let firstGroup = true;

    objectEntryData.forEach(row => {
        const dataFields = Object.entries(row[1]);
        const itemId = row[0];
        let bodyContent = '';

        dataFields.forEach(field => {
            if (field[0] === Vault.groups.jobGroup.key) {
                let jobsExecuteValues = '';
                const countJobs = field[1].length;

                field[1].forEach(job => {
                    const entriesJob = Object.entries(job);
                    jobsExecuteValues += jobExecuteTemplate
                    .replace('{jobId}', job.jobId || entriesJob[0][1])
                    .replace('{jobName}', job.chargeProcess || entriesJob[1][1])
                    .replace('{jobLayer}', job.layerScript || entriesJob[2][1])
                        + (countJobs > 1 ? '<br>' : '');
                });

                bodyContent += dataTemplate.replace('{group}', Vault.groups[itemId].value).replace('{title}', Vault.fields.jobsExecute.value).replace('{body}', jobsExecuteValues);
            }
            else if (field[0] !== row[0]) {
                bodyContent += dataTemplate.replace('{group}', Vault.groups[row[0]].value).replace('{title}', Vault.fields[field[0]].value).replace('{body}', field[1]);
            }
        });

        content.innerHTML += acordionTemplate
            .replaceAll('{{first_group}}', firstGroup ? 'show' : '')
            .replaceAll('{{first_group_button}}', firstGroup ? '' : 'collapsed')
            .replaceAll('{{acordion_id}}', itemId)
            .replaceAll('{{acordion_title}}', Vault.groups[itemId].value)
            .replaceAll('{{table_body}}', bodyContent);
        
        firstGroup = false;
    });
};

export { generateTable };