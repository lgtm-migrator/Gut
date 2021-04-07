import { __, applyStyle, theme } from '../../../src/dependencies/colors.ts';

import {
  commitShit,
  deleteRepositories, endTestLogs, initializeRepository, startTestLogs,
} from '../../utils/setup.ts';
import { LOCATION } from './git.utils.ts';
import { assertEquals } from '../../utils/assert.ts';

import { getMergeBaseFromParent } from '../../../src/lib/git/getMergeBaseFromParent.ts';
import { executeProcessCriticalTask } from '../../../src/lib/exec/executeProcessCriticalTask.ts';
import { executeAndGetStdout } from '../../../src/lib/exec/executeAndGetStdout.ts';

Deno.test(applyStyle(__`@int ${`${LOCATION}/getMergeBaseFromParent`}`, [ theme.strong ]), async () => {
  await startTestLogs();
  const repository = await initializeRepository('gut_test_getMergeBaseFromParent');

  await commitShit(repository, 1);
  const lastMasterCommitSha = await executeAndGetStdout([ 'git', 'log', '--max-count', '1', '--pretty=format:%H' ], true);

  await executeProcessCriticalTask([ 'git', 'checkout', '-b', 'master__devBranch' ]);

  await commitShit(repository, 2);

  const mergeBase = await getMergeBaseFromParent();

  await deleteRepositories(repository);

  assertEquals(mergeBase, lastMasterCommitSha);
  await endTestLogs();
});
