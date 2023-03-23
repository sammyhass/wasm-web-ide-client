import { DirectoryNode, FileNode, FileSystemTree } from '@webcontainer/api';

export function isFileNode(node: FileNode | DirectoryNode): node is FileNode {
  return 'file' in node;
}

export function isDirectoryNode(
  node: FileNode | DirectoryNode
): node is DirectoryNode {
  return 'directory' in node;
}

function visitNode(
  node: FileNode | DirectoryNode,
  cb: (path: string, node: FileNode | DirectoryNode) => void,
  path = ''
) {
  if (isFileNode(node)) {
    cb(path, node);
  } else if (isDirectoryNode(node)) {
    cb(path, node);
    for (const [name, child] of Object.entries(node.directory)) {
      visitNode(child, cb, `${path}/${name}`);
    }
  }
}

export function findNode(
  tree: FileSystemTree,
  pred: (path: string, node: FileNode | DirectoryNode) => boolean,
  path = ''
): { path: string; node: FileNode | DirectoryNode } | undefined {
  for (const [name, node] of Object.entries(tree)) {
    if (pred(`${path}/${name}`, node))
      return {
        path: `${path}/${name}`.replace(/^\//, ''),
        node,
      };
    if (isDirectoryNode(node)) {
      const found = findNode(node.directory, pred, `${path}/${name}`);
      if (found) return found;
    }
  }
  return undefined;
}

export function visitFileTree(
  tree: FileSystemTree,
  cb: (path: string, node: FileNode | DirectoryNode) => void | false // false to stop
) {
  for (const [name, node] of Object.entries(tree)) {
    visitNode(node, cb, name);
  }
}

export function nodeExists(tree: FileSystemTree, path: string) {
  return !!findNode(tree, p => {
    return p.replace(/^\/+/g, '') === path.replace(/^\/+/g, '');
  });
}
