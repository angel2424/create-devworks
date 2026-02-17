#!/usr/bin/env node

import inquirer from 'inquirer';
import degit from 'degit';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';

console.log(chalk.bold.blue('🚀 Welcome to the DevWorks Project Generator!'));

async function init() {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: 'my-devworks-project',
      validate: (input) => {
        if (fs.existsSync(input)) {
          return 'A folder with this name already exists.';
        }
        return true;
      },
    },
  ]);

  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'What would you like to build?',
      choices: [
        { name: 'Agency Website (Astro Boilerplate)', value: 'website' },
        { name: 'CMS Panel (DevWorks CMS)', value: 'cms' },
        { name: 'Documentation Site (DevWorks Docs)', value: 'docs' },
      ],
    },
  ]);

  const repos = {
    website: 'github:your-username/devworks-website-template',
    cms: 'github:your-username/devworks-cms-template',
    docs: 'github:your-username/devworks-docs-template',
  };

  const selectedRepo = repos[projectType];

  const spinner = ora(`Downloading ${projectType} template...`).start();

  try {
    const emitter = degit(selectedRepo, {
      cache: false,
      force: true,
      verbose: true,
    });

    await emitter.clone(projectName);

    spinner.succeed(chalk.green('Template created successfully!'));

    console.log('\nTo get started:');
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));

  } catch (error) {
    spinner.fail(chalk.red('Error creating project.'));
    console.error(error);
  }
}

init();
