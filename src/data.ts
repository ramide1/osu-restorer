import { parse, stringify } from 'yaml';
import { readFileSync, existsSync, writeFileSync } from 'fs';

const saveData = (data: any, file: string) => {
    try {
        writeFileSync(file, stringify(data), 'utf8');
        return data;
    } catch (error: any) {
        return false;
    }
};

const loadData = (file: string) => {
    try {
        if (!existsSync(file)) throw new Error('File not exists');
        return parse(readFileSync(file, 'utf8'));
    } catch (error) {
        return false;
    }
};

const getBeatmaps = async (userId: number, limit: number, offset: number = 0) => {
    try {
        const response = await fetch('https://osu.ppy.sh/users/' + userId + '/beatmapsets/most_played?limit=' + limit + '&offset=' + offset, { method: 'GET' });
        if (!response.ok) throw new Error('Response was not ok');
        return await response.json();
    } catch (error) {
        return false;
    }
}

export { saveData, loadData, getBeatmaps };