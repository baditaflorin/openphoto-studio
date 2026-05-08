import { get, set } from 'idb-keyval';
import type { ProjectSnapshot } from '../editor/types';

const lastProjectKey = 'openphoto-studio:last-project';

export async function saveLastProject(snapshot: ProjectSnapshot) {
  await set(lastProjectKey, snapshot);
}

export async function loadLastProject() {
  return get<ProjectSnapshot>(lastProjectKey);
}
