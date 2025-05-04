import { number, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { downloadBeatmaps } from './download';
import { getBeatmaps, loadData, saveData } from './data';

console.log(chalk.yellowBright.bold('*************************************'));
console.log(chalk.cyanBright.bold('      Welcome to Osu! Restorer'));
console.log(chalk.yellowBright.bold('*************************************'));
console.log(chalk.blue('\nThis tool will help you recover your lost osu! beatmaps'));
console.log(chalk.blue('in a simple and fast way.\n'));

const app = async () => {
    try {
        const loadedUser = await loadData('user.yml');
        const useUser = loadedUser.userId ? (await confirm({message: chalk.blue('Do you want to use saved user?')})) : false;
        const userId = useUser ? loadedUser.userId : (await number({ message: chalk.blue('Enter your Osu! user ID') }));
        if (!userId) throw new Error('No user ID entered');
        const saveUser = !useUser ? await confirm({message: chalk.blue('Do you want to save current user?')}) : false;
        if (saveUser) await saveData({ userId: userId }, 'user.yml');
        const limit = await number({ message: chalk.blue('Enter the limit of beatmaps to download') });
        if (!limit) throw new Error('No limit entered');
        const beatmaps = await getBeatmaps(userId, limit);
        if (!beatmaps) throw new Error('Error getting beatmaps');
        if (beatmaps.length === 0) throw new Error('No beatmaps found');
        const ids = await downloadBeatmaps(beatmaps);
        if (ids.length === 0) throw new Error('Error downloading beatmaps');
        return console.log(chalk.green('Beatmaps with ids ' + ids.join(', ') + ' downloaded successfully'));
    } catch (error: any) {
        return console.log(chalk.red(error));
    }
};

app();