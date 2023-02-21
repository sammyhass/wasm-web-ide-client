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
// Lets you visit all the nodes in a tree
export function visitFileTree(
  tree: FileSystemTree,
  cb: (path: string, node: FileNode | DirectoryNode) => void
) {
  for (const [name, node] of Object.entries(tree)) {
    visitNode(node, cb, name);
  }
}
