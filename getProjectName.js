const yargs = require('yargs');

const getPorjectName = async () => {
    let projectName = yargs.argv.name; 
    if(!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Enter the project name: ');
        rl.close();
    }
    return projectName;
}