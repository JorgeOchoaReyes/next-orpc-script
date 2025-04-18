#!/usr/bin/env node
const readline = require('readline');
const yargs = require('yargs');
const { execSync } = require('child_process');
const path = require('path'); 

const TEMPLATE_REPO_URL = "https://github.com/JorgeOchoaReyes/next-orpc-template.git"; 

const setUpRepo = async (projectName, installDeps, commitChanges) => {
    execCommand(`git clone --depth=1 ${TEMPLATE_REPO_URL} ${projectName}`);
    
    if(installDeps) {
        const projectPath = path.join(process.cwd(), projectName); 
        const cwdPath = {cwd: projectPath}; 
        execCommand("npm install", cwdPath);
        
        if(commitChanges) {
            execCommand("git init", cwdPath);
            execCommand("git add .", cwdPath);
            execCommand("git commit -m 'Initial commit'", cwdPath);
        }
    }
}

const getProjectName = async () => {
    let projectName = yargs.argv.name; 
    if(!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Enter the project name: ');
        rl.close();
    }
    return projectName;
}

const getInstallDeps = async () => {
    let installDeps = yargs.argv.installDeps; 
    if(installDeps === undefined) {
        const rl = createInterface();
        installDeps = await askQuestion(rl, 'Do you want to install dependencies? (y/n): ');
        rl.close();
    }
    const trimToFirstChar = installDeps.trim().charAt(0);
    return trimToFirstChar === 'y';
}

const getCommitChanges = async () => {
    let commitChanges = yargs.argv.commitChanges; 
    if(commitChanges === undefined) {
        const rl = createInterface();
        commitChanges = await askQuestion(rl, 'Do you want to commit changes? (y/n): ');
        rl.close();
    }
    const trimToFirstChar = commitChanges.trim().charAt(0);
    return trimToFirstChar === 'y';
}

const createInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
}

const askQuestion = (rl, question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        }) 
    });
}
 
const execCommand = (command, options={}) => {
    try {
        execSync(command, {stdio: "inherit", ...options});
    } catch (error) {
        console.error(`Error executing command: ${command}`); 
        process.exit(1);
    }
} 

const main = async () => {
    const projectName = await getProjectName();
    const installDeps = await getInstallDeps();
    const commitChanges = await getCommitChanges();
    await setUpRepo(projectName, installDeps, commitChanges); 
}

main().catch(() => {
    console.error('Error occurred while setting up the project.');
})
