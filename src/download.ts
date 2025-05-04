import { writeFileSync, existsSync, mkdirSync } from 'fs';
import cliProgress from 'cli-progress';
import chalk from 'chalk';

const downloadBeatmap = async (beatmapId: number, title: string, directory: string) => {
    try {
        const response = await fetch('https://beatconnect.io/b/' + beatmapId, { method: 'GET' });
        if (!response.ok) throw new Error('Response was not ok');
        const file = Buffer.from(await response.arrayBuffer());
        if (!existsSync(directory)) mkdirSync(directory);
        writeFileSync(directory + '/' + beatmapId + '-' + title + '.osz', file);
        return beatmapId;
    } catch (error: any) {
        return false;
    }
};

const downloadBeatmaps = async (beatmaps: any[], directory: string = './beatmaps') => {
    const ids: any = [];
    if (beatmaps.length === 0) {
        console.log(chalk.yellow('No beatmaps to download.'));
    } else {
        console.log(chalk.blue('Starting download of ' + beatmaps.length + ' beatmaps...'));
        const progressBar = new cliProgress.SingleBar({
            format: 'Progress |' + chalk.cyan('{bar}') + '| {percentage}% || {value}/{total} Beatmaps',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.shades_classic);
        progressBar.start(beatmaps.length, 0);
        for (const beatmap of beatmaps) {
            const title = beatmap.beatmapset.title.substring(0, 30).trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').toLowerCase();            
            const download = await downloadBeatmap(beatmap.beatmap_id, title, directory);
            if (download) ids.push(download);
            progressBar.increment();
        }
        progressBar.stop();
    }
    return ids;
};

export { downloadBeatmaps };