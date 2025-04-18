const readline = require('readline');
const yargs = require('yargs');
const { execSync } = require('child_process');

const getProjectName = async () => {
    let projectName = yargs.argv.name; 
    if(!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Enter the project name: ');
        rl.close();
    }
    return projectName;
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

const main = async () => {
    const projectName = await getProjectName();
}

main().catch(() => {
    console.error('Error occurred while setting up the project.');
})

const execCommand = (command, options={}) => {
    try {
        execSync(command, {stdio: "inherit", ...options});
    } catch (error) {
        console.error(`Error executing command: ${command}`); 
        process.exit(1);
    }
}
