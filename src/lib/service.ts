import path from 'path';
import {walk} from 'common/util/fs';
import {toArray} from 'common/util/array';
import {slash} from 'common/util/path';
import {ToolMeta, ToolMetaInline} from './meta';

const toolDirectory = path.join(process.cwd(), 'pages/tool');

export async function getAllToolFilePaths() {
  const paths = await toArray(walk(toolDirectory, {
    ext: ['.ts', '.tsx'],
  }));
  return paths.map(e => slash(path.relative(toolDirectory, e)));
}


export async function getToolMetaByFilePath(path: string): Promise<ToolMeta> {
  path = slash(path);
  const module = await import(`pages/tool/${path}`);
  return {
    ...module.default.meta as ToolMetaInline,
    path: path,
    link: fileToUrl(path),
  } as ToolMeta;
}

export async function getAllToolMetas() {
  const slugs = await getAllToolFilePaths();
  return (await Promise.all(slugs.map(slug => getToolMetaByFilePath(slug)))).filter(e => !e.draft);
}


function fileToUrl(p: string) {
  if (p.endsWith('.tsx')) {
    p = p.substring(0, p.length - 4);
  } else if (p.endsWith('.ts')) {
    p = p.substring(0, p.length - 3);
  }
  return p;
}