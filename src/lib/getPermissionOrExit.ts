import log from '../dependencies/log.ts';
import { applyStyle, theme } from '../dependencies/colors.ts';

const getPermissionValue = (permissionDescriptor: Deno.PermissionDescriptor): string | undefined => {
  switch (permissionDescriptor.name) {
    case 'net':
      // eslint-disable-next-line no-case-declarations
      const netPermissionDescriptor: Deno.NetPermissionDescriptor = permissionDescriptor;
      return netPermissionDescriptor.host;
    case 'read':
      // eslint-disable-next-line no-case-declarations
      const readPermissionDescriptor: Deno.ReadPermissionDescriptor = permissionDescriptor;
      return readPermissionDescriptor.path;
    case 'write':
      // eslint-disable-next-line no-case-declarations
      const writePermissionDescriptor: Deno.WritePermissionDescriptor = permissionDescriptor;
      return writePermissionDescriptor.path;
    case 'env':
      // eslint-disable-next-line no-case-declarations
      const envPermissionDescriptor: Deno.EnvPermissionDescriptor = permissionDescriptor;
      return envPermissionDescriptor.variable;
    case 'run':
      // eslint-disable-next-line no-case-declarations
      const runPermissionDescriptor: Deno.RunPermissionDescriptor = permissionDescriptor;
      return runPermissionDescriptor.command;
    default:
      return undefined;
  }
};

export async function getPermissionOrExit (permissionDescriptor: Deno.PermissionDescriptor, value?: string) {
  const { state: currentPermissionStatus } = await Deno.permissions.query(permissionDescriptor);

  if (currentPermissionStatus === 'granted') { return; }

  const permissionValue = value || getPermissionValue(permissionDescriptor);
  const permissionCli = `--allow-${permissionDescriptor.name}${permissionValue ? `=${permissionValue}` : ''}`;
  await log(Deno.stdout, applyStyle(
    `ℹ I need the permission ${permissionCli} to run.\n`,
    [ theme.strong ],
  ));
  await log(Deno.stdout, applyStyle(
    'You can install Gut with this permission to avoir this step next time.\n',
    [ theme.dim ],
  ));

  const { state } = await Deno.permissions.request(permissionDescriptor);
  if (state === 'denied') {
    await log(Deno.stderr, applyStyle('The permission was denied, exiting\n', [ theme.warning ]));
    Deno.exit(1);
  }
}
