import MenuController from './generic/menu.controller';
import SaveIssueController from './save/save.issue.controller';
import RolesController from './generic/roles.controller';
import BackupTableController from './backup/backup.table.controller';
import BackupBitbucketController from './backup/backup.bitbucket.controller';
import BackupTaxonomiaController from './backup/backup.taxonomia.controller';
import ProcesoBitbucketController from './process/process.bitbucket.controller';
import ProcesoJenkinsController from './process/process.jenkins.controller';
import ProcesoTaxonomiaController from './process/process.taxonomia.controller';
import ProcesoJobsController from './process/process.jobs.controller';
import MetadataBitbucketController from './metadata/metadata.bitbucket.controller';
import MetadataJenkinsController from './metadata/metadata.jenkins.controller';
import LinajeBitbucketController from './linaje/linaje.bitbucket.controller';
import LinajeJenkinsController from './linaje/linaje.jenkins.controller';
import GeneratorBackupTableController from './generator/generator.backup.table.controller';
import GeneratorBackupBitbucketController from './generator/generator.backup.bitbucket.controller';
import SaveBackupController from './save/save.backup.controller';
import TemplateRepositoryController from './repository/template.repository.controller';
import SaveRepositoryController from './save/save.repository.controller';
import DescriptionController from './generic/description.controller';
import DataEntryTableController from './dataentry/dataentry.table.controller';
import DataEntryBitbucketController from './dataentry/dataentry.bitbucket.controller';
import DataEntryJenkinsController from './dataentry/dataentry.jenkins.controller';
import EngineTaxonomiaController from './extractionEngine/engine.taxonomia.controller';
import JobJenkinsController from './jenkins/job.jenkins.controller';
import SaveJobJenkinsController from './save/save.job.jenkins.controller';

const pages = {
    menuView: MenuController,
    saveIssueView: SaveIssueController,
    rolesView: RolesController,
    backupTableView: BackupTableController,
    backupBitbucketView: BackupBitbucketController,
    backupTaxonomiaView: BackupTaxonomiaController,
    procesoBitbucketView: ProcesoBitbucketController,
    procesoJenkinsView: ProcesoJenkinsController,
    procesoJobsView: ProcesoJobsController,
    procesoTaxonomiaView: ProcesoTaxonomiaController,
    metadataBitbucketView: MetadataBitbucketController,
    metadataJenkinsView: MetadataJenkinsController,
    linajeBitbucketView: LinajeBitbucketController,
    linajeJenkinsView: LinajeJenkinsController,
    generatorBackupTableView: GeneratorBackupTableController,
    saveBackupView: SaveBackupController,
    generatorBackupBitbucketView: GeneratorBackupBitbucketController,
    TemplateRepositoryView: TemplateRepositoryController,
    saveRepositoryView: SaveRepositoryController,
    descriptionView: DescriptionController,
    dataEntryTableView: DataEntryTableController,
    dataEntryBitbucketView: DataEntryBitbucketController,
    dataEntryJenkinsView: DataEntryJenkinsController,
    engineTaxonomiaView: EngineTaxonomiaController,
    jobJenkinsView: JobJenkinsController,
    saveJobJenkinsView: SaveJobJenkinsController,
}

export { pages };