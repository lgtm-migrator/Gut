import { stoyle, theme } from '../../../src/dependencies/stoyle.ts';
Deno.test(stoyle`@int ${`${LOCATION}/getDiffBetweenRefs`}`({ nodes: [ theme.strong ] }), async () => {