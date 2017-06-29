const version = 0.1;
const edition = location.hostname === 'localhost' ? `開発版` :
                '';
const versionName = `ver${version}`;

export const Versions = {
  version,
  edition,
  versionName
};
