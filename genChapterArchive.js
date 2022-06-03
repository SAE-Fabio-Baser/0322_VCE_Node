import inquirer from 'inquirer'
import archiver from 'archiver'
import path from 'path'
import removeGitIgnored from 'remove-git-ignored'
import prettyBytes from 'pretty-bytes'
import { exec } from 'child_process'

import fs from 'fs'
import chalk from 'chalk'

const dirname = process.cwd().split('/').pop()

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Wie heißt das Modul?',
        default: dirname,
    },
    {
        type: 'number',
        name: 'chapterNumber',
        message: 'Welches Chapter war das heute?',
        default: 1,
    },
    {
        type: 'list',
        name: 'archiveType',
        message: 'Zip oder Tar',
        choices: ['zip', 'tar'],
    },
]

function removeFiles() {
    return new Promise((resolve) => {
        const remove = removeGitIgnored({
            rootPath: process.cwd(),
            isSilent: true,
        })

        remove.on('project-completed', () => {
            resolve()
        })
    })
}

function createArchive(name, chapterNumber, archiveType) {
    const archivePath = path.resolve(
        `../${name}__chapter_${chapterNumber}.${archiveType}`
    )

    const output = fs.createWriteStream(archivePath)
    const archive = archiver(archiveType, { zlib: { level: 9 } })

    output.on('close', function () {
        console.log(
            chalk.cyan(
                'Ein Archiv mit folgeneder Größe wurde generiert: ',
                prettyBytes(archive.pointer())
            )
        )

        exec('open .')
    })

    archive.pipe(output)

    archive.directory('.', false)

    archive.finalize()

    return archivePath
}

function onDone(answers) {
    const { name, chapterNumber, archiveType } = answers

    removeFiles().then(() => {
        console.log(
            chalk.cyan('Dateien / Ornder in .gitignore wurden gelöscht')
        )

        createArchive(name, chapterNumber, archiveType)
    })
}

inquirer.prompt(questions).then(onDone).catch(console.error)
