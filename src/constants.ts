import { app } from 'electron';
import path from 'path';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const URL_PEEK_HTML = `file://${__dirname}/url-peek.html`;

export const INDEX_HTML = `file://${__dirname}/index.html`;

export const FIND_HTML = `file://${__dirname}/find.html`;

export const OVERLAY_HTML = `file://${__dirname}/overlay.html`;

export const TAB_PAGE = `file://${__dirname}/tab-page.html`;

export const MAIN_HTML = `file://${__dirname}/main-window.html`;

export const ICON_PNG = getAssetPath('icon.png');

export default RESOURCES_PATH;
